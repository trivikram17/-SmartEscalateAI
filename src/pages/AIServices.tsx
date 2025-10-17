import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageSquare, Brain, Zap, Shield, TrendingUp } from "lucide-react";

const services = [
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Natural language understanding with context retention across conversations",
    features: ["Multi-turn dialogue", "Intent detection", "Entity extraction"],
    status: "active"
  },
  {
    icon: Brain,
    title: "Smart Troubleshooting",
    description: "Guided decision trees and knowledge base lookup for issue resolution",
    features: ["Step-by-step guidance", "Interactive diagnostics", "Solution suggestions"],
    status: "active"
  },
  {
    icon: Zap,
    title: "Auto-Escalation",
    description: "Intelligent ticket generation when issues require human intervention",
    features: ["Priority detection", "Auto-routing", "Context preservation"],
    status: "active"
  },
  {
    icon: Shield,
    title: "Sentiment Analysis",
    description: "Real-time emotion detection for better customer experience",
    features: ["Urgency detection", "Frustration alerts", "Satisfaction tracking"],
    status: "active"
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Pattern recognition to prevent issues before they occur",
    features: ["Trend analysis", "Issue forecasting", "Proactive alerts"],
    status: "beta"
  },
  {
    icon: Bot,
    title: "Multi-Channel Support",
    description: "Consistent AI assistance across all customer touchpoints",
    features: ["Chat integration", "Email support", "API access"],
    status: "coming-soon"
  }
];

const AIServices = () => {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Services</h1>
          <p className="text-muted-foreground">Explore the AI capabilities powering AssistBot</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.title} className="p-6 shadow-[var(--shadow-elevated)] border-primary/10 hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-lg">
                  <service.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <Badge variant={service.status === "active" ? "default" : service.status === "beta" ? "secondary" : "outline"}>
                  {service.status === "active" ? "Active" : service.status === "beta" ? "Beta" : "Coming Soon"}
                </Badge>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Key Features:</p>
                <ul className="space-y-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIServices;
