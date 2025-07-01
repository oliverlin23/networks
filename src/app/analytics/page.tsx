'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock,
  ArrowLeft,
  BarChart3,
  Activity,
  Target,
  Calendar,
  FileText
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const [overviewStats] = useState([
    {
      title: 'Total Views',
      value: '12,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Eye
    },
    {
      title: 'Unique Readers',
      value: '3,421',
      change: '+8.2%',
      changeType: 'positive',
      icon: Users
    },
    {
      title: 'Avg. Time on Page',
      value: '4m 32s',
      change: '+2.1%',
      changeType: 'positive',
      icon: Clock
    },
    {
      title: 'Engagement Rate',
      value: '89%',
      change: '+5.3%',
      changeType: 'positive',
      icon: Target
    }
  ]);

  const [topContent] = useState([
    {
      title: 'newsletter-2024-01.md',
      views: 1247,
      engagement: 92,
      timeOnPage: '5m 12s',
      category: 'Newsletter'
    },
    {
      title: 'content-strategy.md',
      views: 892,
      engagement: 87,
      timeOnPage: '6m 45s',
      category: 'Strategy'
    },
    {
      title: 'tech-trends-2024.md',
      views: 1103,
      engagement: 85,
      timeOnPage: '4m 18s',
      category: 'Analysis'
    },
    {
      title: 'monetization-guide.md',
      views: 756,
      engagement: 91,
      timeOnPage: '7m 23s',
      category: 'Guide'
    }
  ]);

  const [categoryPerformance] = useState([
    { category: 'Newsletter', views: 1247, engagement: 92, files: 3 },
    { category: 'Strategy', views: 1526, engagement: 87, files: 2 },
    { category: 'Analysis', views: 1103, engagement: 85, files: 1 },
    { category: 'Guide', views: 756, engagement: 91, files: 1 },
    { category: 'Guidelines', views: 567, engagement: 78, files: 1 }
  ]);

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
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
                <p className="text-sm text-muted-foreground">Track your content performance and reader engagement</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">vs last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Performing Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Top Performing Content
              </CardTitle>
              <CardDescription>
                Your most viewed and engaged content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm">{content.title}</h4>
                        <Badge variant="outline" className="text-xs">{content.category}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {content.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {content.engagement}%
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {content.timeOnPage}
                        </span>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/reader?file=${content.title}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Category Performance
              </CardTitle>
              <CardDescription>
                How different content categories perform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryPerformance.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm">{category.category}</h4>
                        <Badge variant="secondary" className="text-xs">{category.files} files</Badge>
                      </div>
                      <span className="text-sm font-medium">{category.views.toLocaleString()} views</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(category.views / Math.max(...categoryPerformance.map(c => c.views))) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Engagement: {category.engagement}%</span>
                      <span>Avg. time: 5m 12s</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Reader Growth Over Time
            </CardTitle>
            <CardDescription>
              Track your audience growth and engagement trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chart visualization would go here</p>
                <p className="text-sm text-muted-foreground">Showing growth trends over the selected time period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 