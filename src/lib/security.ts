import { supabase } from './supabase';
import { Post, User } from './supabase';

// Rate limiting
class RateLimiter {
  private limits = new Map<string, { count: number; resetTime: number }>();

  isLimited(userId: string, action: string, limit: number = 100, windowMs: number = 3600000): boolean {
    const key = `${userId}:${action}`;
    const now = Date.now();
    const userLimit = this.limits.get(key);

    if (!userLimit || now > userLimit.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs });
      return false;
    }

    if (userLimit.count >= limit) {
      return true;
    }

    userLimit.count++;
    return false;
  }
}

export const rateLimiter = new RateLimiter();

// Permission checking
export class PermissionService {
  static async canReadPost(postId: string, userId?: string): Promise<boolean> {
    const { data: post } = await supabase
      .from('posts')
      .select('status, author_id')
      .eq('id', postId)
      .single();

    if (!post) return false;
    
    // Published posts are readable by everyone
    if (post.status === 'published') return true;
    
    // Authors can read their own posts
    if (userId && post.author_id === userId) return true;
    
    return false;
  }

  static async canEditPost(postId: string, userId: string): Promise<boolean> {
    const { data: post } = await supabase
      .from('posts')
      .select('author_id, status')
      .eq('id', postId)
      .single();

    if (!post) return false;
    
    // Only authors can edit their posts
    if (post.author_id !== userId) return false;
    
    // Can't edit published posts (should create new version)
    if (post.status === 'published') return false;
    
    return true;
  }

  static async canPublish(userId: string): Promise<boolean> {
    // Check if user has publishing permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('can_publish, is_verified')
      .eq('id', userId)
      .single();

    return profile?.can_publish && profile?.is_verified;
  }

  static async canModerate(userId: string): Promise<boolean> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_moderator, is_admin')
      .eq('id', userId)
      .single();

    return profile?.is_moderator || profile?.is_admin;
  }
}

// Content validation
export class ContentValidator {
  static validatePost(post: Partial<Post>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!post.title || post.title.length < 3) {
      errors.push('Title must be at least 3 characters');
    }

    if (!post.content || post.content.length < 10) {
      errors.push('Content must be at least 10 characters');
    }

    if (post.title && post.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    // Check for inappropriate content (basic example)
    const inappropriateWords = ['spam', 'scam', 'fake'];
    const content = (post.title + ' ' + post.content).toLowerCase();
    
    for (const word of inappropriateWords) {
      if (content.includes(word)) {
        errors.push('Content contains inappropriate language');
        break;
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static sanitizeContent(content: string): string {
    // Basic XSS prevention
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
}

// Audit logging
export class AuditLogger {
  static async logAction(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details?: any
  ) {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      resource,
      resource_id: resourceId,
      details,
      ip_address: 'client_ip', // Would get from request
      user_agent: 'user_agent' // Would get from request
    });
  }
}

// Enhanced post service with security
export class SecurePostService {
  static async getPost(postId: string, userId?: string): Promise<Post | null> {
    // Check permissions first
    const canRead = await PermissionService.canReadPost(postId, userId);
    if (!canRead) {
      throw new Error('Access denied');
    }

    // Rate limiting
    if (userId && rateLimiter.isLimited(userId, 'read_post', 1000)) {
      throw new Error('Rate limit exceeded');
    }

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(display_name, username, avatar_url),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('id', postId)
      .single();

    if (error) throw error;

    // Log access
    if (userId) {
      await AuditLogger.logAction(userId, 'read', 'post', postId);
    }

    return data;
  }

  static async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'read_count' | 'like_count'>, userId: string): Promise<Post> {
    // Rate limiting
    if (rateLimiter.isLimited(userId, 'create_post', 10)) {
      throw new Error('Rate limit exceeded');
    }

    // Content validation
    const validation = ContentValidator.validatePost(post);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Sanitize content
    const sanitizedPost = {
      ...post,
      title: ContentValidator.sanitizeContent(post.title),
      content: ContentValidator.sanitizeContent(post.content),
      excerpt: post.excerpt ? ContentValidator.sanitizeContent(post.excerpt) : undefined
    };

    const { data, error } = await supabase
      .from('posts')
      .insert(sanitizedPost)
      .select()
      .single();

    if (error) throw error;

    // Log creation
    await AuditLogger.logAction(userId, 'create', 'post', data.id, { title: data.title });

    return data;
  }

  static async updatePost(postId: string, updates: Partial<Post>, userId: string): Promise<Post> {
    // Check permissions
    const canEdit = await PermissionService.canEditPost(postId, userId);
    if (!canEdit) {
      throw new Error('Access denied');
    }

    // Rate limiting
    if (rateLimiter.isLimited(userId, 'update_post', 50)) {
      throw new Error('Rate limit exceeded');
    }

    // Content validation for updates
    const validation = ContentValidator.validatePost(updates);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Sanitize content
    const sanitizedUpdates = {
      ...updates,
      title: updates.title ? ContentValidator.sanitizeContent(updates.title) : undefined,
      content: updates.content ? ContentValidator.sanitizeContent(updates.content) : undefined,
      excerpt: updates.excerpt ? ContentValidator.sanitizeContent(updates.excerpt) : undefined
    };

    const { data, error } = await supabase
      .from('posts')
      .update({ ...sanitizedUpdates, updated_at: new Date().toISOString() })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;

    // Log update
    await AuditLogger.logAction(userId, 'update', 'post', postId, { fields: Object.keys(updates) });

    return data;
  }

  static async publishPost(postId: string, userId: string): Promise<Post> {
    // Check publishing permissions
    const canPublish = await PermissionService.canPublish(userId);
    if (!canPublish) {
      throw new Error('Insufficient publishing permissions');
    }

    // Check if user owns the post
    const canEdit = await PermissionService.canEditPost(postId, userId);
    if (!canEdit) {
      throw new Error('Access denied');
    }

    const { data, error } = await supabase
      .from('posts')
      .update({ 
        status: 'published', 
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;

    // Log publication
    await AuditLogger.logAction(userId, 'publish', 'post', postId);

    return data;
  }
} 