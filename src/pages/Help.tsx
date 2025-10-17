import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Book, MessageCircle, Mail, Phone, FileText, Video, Users } from "lucide-react";

const Help = () => {
  const helpCategories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of using Smart Escalate AI",
      articles: 12,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Using the Chatbot",
      description: "Tips for better AI conversations",
      articles: 8,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Account Management",
      description: "Manage your profile and settings",
      articles: 15,
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: FileText,
      title: "Troubleshooting",
      description: "Common issues and solutions",
      articles: 20,
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@smartescalate.ai",
      action: "Send Email"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 24/7",
      action: "Start Chat"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with a support agent",
      contact: "+1 (555) 123-4567",
      action: "Call Now"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      contact: "50+ videos available",
      action: "Watch Now"
    }
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to your questions or get in touch with our support team
          </p>
        </div>

        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Browse Help Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {category.articles} articles
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <Card className="p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
          <div className="space-y-3">
            {[
              "How to create your first AI conversation",
              "Understanding ticket escalation rules",
              "Best practices for using AI Services",
              "Managing your account settings",
              "Integrating with third-party tools"
            ].map((article, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <FileText className="w-5 h-5 text-primary" />
                <span className="flex-1">{article}</span>
                <Button variant="ghost" size="sm">Read →</Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Support */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Contact Support</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">{option.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                <p className="text-xs text-muted-foreground mb-4">{option.contact}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {option.action}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
