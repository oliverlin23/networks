'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  BookOpen, 
  FileText, 
  Upload, 
  Plus, 
  Users, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Globe,
  Code
} from 'lucide-react';

export default function HomePage() {
  const [recentFiles] = useState([
    { name: 'newsletter-2024-01.md', date: '2024-01-15', category: 'Newsletter' },
    { name: 'content-strategy.md', date: '2024-01-10', category: 'Strategy' },
    { name: 'community-guidelines.md', date: '2024-01-08', category: 'Guidelines' },
  ]);

  const [quickActions] = useState([
    {
      title: 'Create New Post',
      description: 'Start writing a new newsletter or article',
      icon: Plus,
      href: '/reader',
      color: 'bg-blue-500',
      action: 'Create'
    },
    {
      title: 'Upload Markdown',
      description: 'Upload and preview existing markdown files',
      icon: Upload,
      href: '/reader',
      color: 'bg-green-500',
      action: 'Upload'
    },
    {
      title: 'Browse Library',
      description: 'View all your saved markdown files',
      icon: FileText,
      href: '/library',
      color: 'bg-purple-500',
      action: 'Browse'
    },
    {
      title: 'Analytics',
      description: 'View reader engagement and metrics',
      icon: TrendingUp,
      href: '/analytics',
      color: 'bg-orange-500',
      action: 'View'
    }
  ]);

  const [features] = useState([
    {
      title: 'Rich Markdown Editor',
      description: 'Write with live preview and syntax highlighting',
      icon: Code
    },
    {
      title: 'File Management',
      description: 'Upload, organize, and manage your markdown files',
      icon: FileText
    },
    {
      title: 'Beautiful Themes',
      description: 'Light and dark mode with customizable styling',
      icon: Sparkles
    },
    {
      title: 'Export Options',
      description: 'Download your content in various formats',
      icon: Globe
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Content Hub</h1>
                <p className="text-sm text-muted-foreground">Your markdown writing and publishing platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/reader">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Your Content Hub
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, edit, and manage your markdown content with a beautiful, modern interface. 
            Perfect for newsletters, documentation, and content creation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-foreground mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2">{action.title}</CardTitle>
                  <CardDescription className="mb-4">{action.description}</CardDescription>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={action.href}>
                      {action.action}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-foreground">Recent Files</h3>
            <Button asChild variant="outline" size="sm">
              <Link href="/library">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentFiles.map((file, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Badge variant="secondary">{file.category}</Badge>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">{file.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Last edited {file.date}
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/reader?file=${file.name}`}>
                      Open File
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-foreground mb-6">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">24</p>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                  <p className="text-sm text-muted-foreground">Readers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">89%</p>
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
