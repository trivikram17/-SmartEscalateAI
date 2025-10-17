import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, ChevronRight } from "lucide-react";
import { useState } from "react";

const articles = [
  {
    category: "Account & Login",
    items: [
      { title: "How to reset your password", views: "1.2K", updated: "2 days ago" },
      { title: "Enable two-factor authentication", views: "890", updated: "1 week ago" },
      { title: "Troubleshoot login issues", views: "2.1K", updated: "3 days ago" }
    ]
  },
  {
    category: "Payment & Billing",
    items: [
      { title: "Update payment method", views: "1.5K", updated: "1 day ago" },
      { title: "Understanding your invoice", views: "980", updated: "5 days ago" },
      { title: "Refund policy and process", views: "1.8K", updated: "1 week ago" }
    ]
  },
  {
    category: "Technical Issues",
    items: [
      { title: "Fix connection errors", views: "3.2K", updated: "1 day ago" },
      { title: "Clear cache and cookies", views: "2.4K", updated: "3 days ago" },
      { title: "Browser compatibility guide", views: "1.1K", updated: "2 weeks ago" }
    ]
  },
  {
    category: "Features & Usage",
    items: [
      { title: "Getting started guide", views: "4.5K", updated: "1 week ago" },
      { title: "Advanced features overview", views: "2.8K", updated: "4 days ago" },
      { title: "Integration setup", views: "1.9K", updated: "1 week ago" }
    ]
  }
];

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-[image:var(--gradient-background)] p-6 min-h-[calc(100vh-16rem)]">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">Find answers to common questions and issues</p>
        </div>

        <Card className="p-6 shadow-[var(--shadow-elevated)] border-primary/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="pl-10"
            />
          </div>
        </Card>

        <div className="space-y-6">
          {articles.map((category) => (
            <Card key={category.category} className="p-6 shadow-[var(--shadow-elevated)] border-primary/10">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{category.category}</h2>
                <Badge variant="secondary" className="ml-auto">{category.items.length} articles</Badge>
              </div>
              
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div key={item.title} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <div className="font-medium group-hover:text-primary transition-colors">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.views} views • Updated {item.updated}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
