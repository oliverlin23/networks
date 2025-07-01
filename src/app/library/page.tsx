'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  BookOpen, 
  FileText, 
  Search, 
  Filter,
  Calendar,
  Tag,
  ArrowLeft,
  Download,
  Eye,
  Edit
} from 'lucide-react';

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [files] = useState([
    { 
      name: 'newsletter-2024-01.md', 
      date: '2024-01-15', 
      category: 'Newsletter',
      description: 'Monthly newsletter covering content creation trends and strategies',
      tags: ['content', 'strategy', 'monthly'],
      readCount: 1247
    },
    { 
      name: 'content-strategy.md', 
      date: '2024-01-10', 
      category: 'Strategy',
      description: 'Comprehensive guide to building a sustainable content strategy',
      tags: ['strategy', 'guide', 'content'],
      readCount: 892
    },
    { 
      name: 'community-guidelines.md', 
      date: '2024-01-08', 
      category: 'Guidelines',
      description: 'Community guidelines and best practices for engagement',
      tags: ['community', 'guidelines', 'engagement'],
      readCount: 567
    },
    { 
      name: 'tech-trends-2024.md', 
      date: '2024-01-05', 
      category: 'Analysis',
      description: 'Analysis of emerging technology trends in content creation',
      tags: ['technology', 'trends', 'analysis'],
      readCount: 1103
    },
    { 
      name: 'monetization-guide.md', 
      date: '2024-01-03', 
      category: 'Guide',
      description: 'Complete guide to monetizing your content across platforms',
      tags: ['monetization', 'guide', 'business'],
      readCount: 756
    },
    { 
      name: 'social-media-strategy.md', 
      date: '2024-01-01', 
      category: 'Strategy',
      description: 'Social media strategy for content creators and influencers',
      tags: ['social media', 'strategy', 'influencers'],
      readCount: 634
    }
  ]);

  const categories = ['all', 'Newsletter', 'Strategy', 'Guidelines', 'Analysis', 'Guide'];

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Hub
                </Link>
              </Button>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Content Library</h1>
                <p className="text-sm text-muted-foreground">Browse and manage your markdown files</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/reader">
                  <FileText className="h-4 w-4 mr-2" />
                  New File
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{files.length}</p>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{files.reduce((sum, file) => sum + file.readCount, 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{new Set(files.flatMap(f => f.tags)).size}</p>
                  <p className="text-sm text-muted-foreground">Unique Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{new Set(files.map(f => f.category)).size}</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Badge variant="secondary">{file.category}</Badge>
                </div>
                <CardTitle className="text-lg">{file.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {file.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {file.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {file.date}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {file.readCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/reader?file=${file.name}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/reader?file=${file.name}&edit=true`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or category filter
            </p>
            <Button asChild>
              <Link href="/reader">
                Create your first file
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
} 