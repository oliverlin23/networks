'use client';

import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { Upload, Eye, Trash2, Download, Plus, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MarkdownReader() {
  const [markdown, setMarkdown] = useState(`# Welcome to Your Newsletter

*Published on ${new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}*

---

## The Future of Content Creation

In today's digital age, the way we consume and create content is evolving rapidly. This newsletter explores the latest trends, tools, and techniques that are shaping the future of content creation.

### What You'll Learn

- **Content Strategy**: How to build a sustainable content strategy
- **Technology Trends**: The latest tools and platforms
- **Community Building**: Creating engaged audiences
- **Monetization**: Turning your content into a business

## Getting Started with Content Creation

Content creation is more than just writing—it's about building relationships with your audience. Here's how to get started:

### 1. Define Your Niche

Choose a topic you're passionate about and that has an audience. The more specific, the better.

### 2. Create Consistently

Consistency is key. Whether it's daily, weekly, or monthly, stick to your schedule.

### 3. Engage with Your Audience

Respond to comments, ask questions, and create content based on feedback.

## Code Example: Building a Newsletter

Here's how you might structure a newsletter system:

\`\`\`javascript
class Newsletter {
  constructor(title, author) {
    this.title = title;
    this.author = author;
    this.subscribers = [];
    this.issues = [];
  }

  addSubscriber(email) {
    this.subscribers.push(email);
    console.log(\`Welcome \${email} to \${this.title}!\`);
  }

  publishIssue(content) {
    const issue = {
      id: Date.now(),
      content,
      publishedAt: new Date(),
      readCount: 0
    };
    this.issues.push(issue);
    this.notifySubscribers(issue);
  }

  notifySubscribers(issue) {
    this.subscribers.forEach(subscriber => {
      console.log(\`Sending issue #\${issue.id} to \${subscriber}\`);
    });
  }
}
\`\`\`

## Reader Engagement Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Open Rate | 45% | 50% |
| Click Rate | 12% | 15% |
| Subscriber Growth | +8% | +10% |
| Engagement Score | 7.2/10 | 8.0/10 |

## What's Next?

In the coming weeks, we'll explore:

- [ ] Advanced content distribution strategies
- [ ] Building a personal brand
- [ ] Monetization through multiple channels
- [ ] Community management best practices

---

*Thanks for reading! If you found this valuable, consider sharing it with a friend.*

**Subscribe to get the next issue delivered to your inbox.**`);

  const [fileName, setFileName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/markdown' || file.name.endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdown(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/markdown' || file.name.endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdown(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const clearContent = () => {
    setMarkdown('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'newsletter.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Substack-style Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Hub
                </Link>
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Markdown Reader</h1>
                <p className="text-sm text-muted-foreground">Create and preview your content</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </Button>
              )}
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,text/markdown"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          // Editor Mode
          <div className="space-y-6">
            {/* Editor Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">Create New Post</h2>
              <div className="flex space-x-3">
                <Button
                  onClick={downloadMarkdown}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Save</span>
                </Button>
                <Button
                  onClick={clearContent}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </div>
            </div>

            {/* File Upload Area */}
            <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors cursor-pointer">
              <CardContent
                className="p-6 text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Drop your markdown file here
                </h3>
                <p className="text-muted-foreground mb-3">
                  or click to browse files
                </p>
                {fileName && (
                  <Badge variant="secondary" className="text-sm">
                    📎 {fileName}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Editor */}
            <Card>
              <CardContent className="p-0">
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Start writing your newsletter..."
                  className="w-full h-96 p-6 resize-none border-0 focus:ring-0 focus:outline-hidden text-foreground font-mono text-sm leading-relaxed bg-transparent"
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          // Reader Mode (Substack-style)
          <article className="prose prose-lg max-w-none dark:prose-invert">
            <div className="mb-8">
              {fileName && (
                <Badge variant="outline" className="mb-4">
                  📎 {fileName}
                </Badge>
              )}
            </div>
            
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom styling for code blocks
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <pre className="bg-muted text-muted-foreground p-4 rounded-lg overflow-x-auto my-6">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-muted text-muted-foreground px-1 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                // Custom styling for tables
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full divide-y divide-border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 text-sm text-foreground border-t border-border">
                    {children}
                  </td>
                ),
                // Custom styling for blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-border pl-4 py-2 bg-muted italic text-muted-foreground my-6">
                    {children}
                  </blockquote>
                ),
                // Custom styling for horizontal rules
                hr: () => (
                  <hr className="border-border my-8" />
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>

            {/* Substack-style footer */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Thanks for reading! If you found this valuable, consider sharing it with a friend.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Subscribe to get the next issue
                </Button>
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
} 