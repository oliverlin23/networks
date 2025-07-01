import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  can_publish: boolean;
  is_verified: boolean;
  is_moderator: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  read_count: number;
  like_count: number;
  author?: Profile;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  author?: Profile;
  replies?: Comment[];
}

// Post operations
export const postService = {
  // Get all published posts
  async getPublishedPosts(limit = 10, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(username, display_name, avatar_url),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  // Get post by slug
  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(username, display_name, avatar_url, bio),
        tags:post_tags(tag:tags(name, slug)),
        comments:comments(
          *,
          author:profiles(username, display_name, avatar_url),
          replies:comments(
            *,
            author:profiles(username, display_name, avatar_url)
          )
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    return data;
  },

  // Create new post
  async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'read_count' | 'like_count'>) {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update post
  async updatePost(id: string, updates: Partial<Post>) {
    const { data, error } = await supabase
      .from('posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete post
  async deletePost(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Increment read count
  async incrementReadCount(id: string) {
    const { error } = await supabase.rpc('increment_read_count', { post_id: id });
    if (error) throw error;
  }
};

// Comment operations
export const commentService = {
  // Get comments for a post
  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles(username, display_name, avatar_url),
        replies:comments(
          *,
          author:profiles(username, display_name, avatar_url)
        )
      `)
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create comment
  async createComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'like_count'>) {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select(`
        *,
        author:profiles(username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Update comment
  async updateComment(id: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete comment
  async deleteComment(id: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// User/Profile operations
export const userService = {
  // Get user profile
  async getUserProfile(username: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        posts:posts(
          *,
          tags:post_tags(tag:tags(name, slug))
        )
      `)
      .eq('username', username)
      .single();

    if (error) throw error;
    return data;
  },

  // Get current user profile
  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Check if username is available
  async isUsernameAvailable(username: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows returned, username is available
      return true;
    }

    return !data; // Username is taken if data exists
  }
};

// Tag operations
export const tagService = {
  // Get all tags
  async getAllTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get posts by tag
  async getPostsByTag(tagSlug: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(username, display_name, avatar_url),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('status', 'published')
      .eq('post_tags.tag.slug', tagSlug)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Like operations
export const likeService = {
  // Toggle like on a post
  async toggleLike(postId: string, userId: string) {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) throw error;
      return false; // Now unliked
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: userId });

      if (error) throw error;
      return true; // Now liked
    }
  },

  // Check if user liked a post
  async hasLiked(postId: string, userId: string) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      return false; // Not liked
    }

    return !!data; // Liked if data exists
  }
}; 