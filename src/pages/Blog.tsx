import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, TrendingUp } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      title: "The Future of AI in Customer Support",
      excerpt: "Discover how artificial intelligence is transforming the way businesses handle customer inquiries and support tickets.",
      author: "Sarah Johnson",
      date: "Oct 15, 2025",
      category: "AI Technology",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop"
    },
    {
      title: "10 Best Practices for Efficient Ticket Escalation",
      excerpt: "Learn the proven strategies for managing and escalating support tickets to ensure customer satisfaction.",
      author: "Michael Chen",
      date: "Oct 12, 2025",
      category: "Best Practices",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop"
    },
    {
      title: "How Machine Learning Improves Response Times",
      excerpt: "An in-depth look at how ML algorithms analyze patterns and predict the best solutions for customer issues.",
      author: "Dr. Emily Rodriguez",
      date: "Oct 10, 2025",
      category: "Machine Learning",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop"
    },
    {
      title: "Building Trust Through Transparent AI",
      excerpt: "Why transparency in AI decision-making is crucial for customer trust and how to implement it.",
      author: "James Wilson",
      date: "Oct 8, 2025",
      category: "Customer Success",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop"
    },
    {
      title: "Integrating AI Support with Your Existing Stack",
      excerpt: "A comprehensive guide to seamlessly integrating AI-powered support into your current technology ecosystem.",
      author: "Sarah Johnson",
      date: "Oct 5, 2025",
      category: "Integration",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"
    },
    {
      title: "The ROI of AI-Powered Customer Support",
      excerpt: "Real numbers and case studies showing the financial impact of implementing intelligent support systems.",
      author: "Michael Chen",
      date: "Oct 3, 2025",
      category: "Business",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop"
    }
  ];

  const categories = ["All", "AI Technology", "Best Practices", "Machine Learning", "Customer Success", "Integration", "Business"];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">Our Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest Insights</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest trends, best practices, and innovations in AI-powered customer support.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        <Card className="mb-12 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img 
                src={posts[0].image} 
                alt={posts[0].title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-4 left-4 bg-primary">
                <TrendingUp className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <Badge variant="secondary" className="w-fit mb-3">{posts[0].category}</Badge>
              <h2 className="text-3xl font-bold mb-4">{posts[0].title}</h2>
              <p className="text-muted-foreground mb-6">{posts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {posts[0].author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {posts[0].date}
                </div>
                <span>{posts[0].readTime}</span>
              </div>
              <Button className="w-fit bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                </div>
                <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
