export interface MarkdownFile {
  id: string;
  name: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  readCount: number;
  description?: string;
}

class MarkdownStorage {
  private readonly STORAGE_KEY = 'markdown-files';

  // Get all files
  getAllFiles(): MarkdownFile[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading files from storage:', error);
      return [];
    }
  }

  // Get a single file by ID
  getFile(id: string): MarkdownFile | null {
    const files = this.getAllFiles();
    return files.find(file => file.id === id) || null;
  }

  // Save a file
  saveFile(file: Omit<MarkdownFile, 'id' | 'createdAt' | 'updatedAt'>): MarkdownFile {
    const files = this.getAllFiles();
    const now = new Date().toISOString();
    
    const newFile: MarkdownFile = {
      ...file,
      id: file.id || this.generateId(),
      createdAt: file.createdAt || now,
      updatedAt: now,
    };

    // Update existing file or add new one
    const existingIndex = files.findIndex(f => f.id === newFile.id);
    if (existingIndex >= 0) {
      files[existingIndex] = newFile;
    } else {
      files.push(newFile);
    }

    this.saveAllFiles(files);
    return newFile;
  }

  // Update a file
  updateFile(id: string, updates: Partial<MarkdownFile>): MarkdownFile | null {
    const files = this.getAllFiles();
    const fileIndex = files.findIndex(f => f.id === id);
    
    if (fileIndex === -1) return null;

    files[fileIndex] = {
      ...files[fileIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveAllFiles(files);
    return files[fileIndex];
  }

  // Delete a file
  deleteFile(id: string): boolean {
    const files = this.getAllFiles();
    const filteredFiles = files.filter(f => f.id !== id);
    
    if (filteredFiles.length === files.length) {
      return false; // File not found
    }

    this.saveAllFiles(filteredFiles);
    return true;
  }

  // Increment read count
  incrementReadCount(id: string): void {
    const file = this.getFile(id);
    if (file) {
      this.updateFile(id, { readCount: file.readCount + 1 });
    }
  }

  // Search files
  searchFiles(query: string, category?: string): MarkdownFile[] {
    const files = this.getAllFiles();
    const lowerQuery = query.toLowerCase();

    return files.filter(file => {
      const matchesQuery = 
        file.name.toLowerCase().includes(lowerQuery) ||
        file.content.toLowerCase().includes(lowerQuery) ||
        file.description?.toLowerCase().includes(lowerQuery) ||
        file.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
      
      const matchesCategory = !category || category === 'all' || file.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  // Get files by category
  getFilesByCategory(category: string): MarkdownFile[] {
    const files = this.getAllFiles();
    return files.filter(file => file.category === category);
  }

  // Get recent files
  getRecentFiles(limit: number = 5): MarkdownFile[] {
    const files = this.getAllFiles();
    return files
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  // Export all files
  exportAllFiles(): string {
    const files = this.getAllFiles();
    return JSON.stringify(files, null, 2);
  }

  // Import files
  importFiles(jsonData: string): boolean {
    try {
      const files = JSON.parse(jsonData);
      if (Array.isArray(files)) {
        this.saveAllFiles(files);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing files:', error);
      return false;
    }
  }

  // Clear all files
  clearAllFiles(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get storage statistics
  getStats() {
    const files = this.getAllFiles();
    const categories = new Set(files.map(f => f.category));
    const tags = new Set(files.flatMap(f => f.tags));
    const totalViews = files.reduce((sum, f) => sum + f.readCount, 0);

    return {
      totalFiles: files.length,
      totalViews,
      categories: categories.size,
      uniqueTags: tags.size,
      totalSize: JSON.stringify(files).length, // Rough size estimate
    };
  }

  private saveAllFiles(files: MarkdownFile[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files));
    } catch (error) {
      console.error('Error saving files to storage:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export singleton instance
export const markdownStorage = new MarkdownStorage(); 