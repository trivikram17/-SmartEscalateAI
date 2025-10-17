import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatMessage } from "@/components/ChatMessage";
import { TicketCard } from "@/components/TicketCard";
import { TypingIndicator } from "@/components/TypingIndicator";
import { QuickActions } from "@/components/QuickActions";
import { useChatBot } from "@/hooks/useChatBot";
import { Bot, MessageSquare, Brain, Zap, Shield, TrendingUp, Send, Sparkles } from "lucide-react";

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
  const [inputValue, setInputValue] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { messages, tickets, isTyping, sendMessage, handleQuickAction } = useChatBot();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
      setShowQuickActions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickActionClick = (action: string) => {
    handleQuickAction(action);
    setShowQuickActions(false);
  };

  return (
    <div className="bg-[image:var(--gradient-background)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Services</h1>
          <p className="text-muted-foreground">Explore and interact with our AI capabilities</p>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="services">
              <Sparkles className="w-4 h-4 mr-2" />
              Service Overview
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="w-4 h-4 mr-2" />
              Try AI Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-6">
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
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <div className="grid lg:grid-cols-[1fr_350px] gap-4">
              {/* Chat Interface */}
              <Card className="flex flex-col shadow-[var(--shadow-elevated)] border-primary/10 overflow-hidden" style={{ height: '600px' }}>
                {/* Header */}
                <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-lg">
                      <Bot className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">AI Assistant Demo</h2>
                      <p className="text-sm text-muted-foreground">Test our intelligent chatbot</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    
                    {isTyping && <TypingIndicator />}
                    
                    {showQuickActions && messages.length === 1 && (
                      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                        <p className="text-sm text-muted-foreground mb-3 text-center">
                          Try asking about:
                        </p>
                        <QuickActions onActionClick={handleQuickActionClick} />
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-background"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-[image:var(--gradient-primary)] hover:opacity-90 transition-opacity"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Tickets Sidebar */}
              <Card className="flex flex-col shadow-[var(--shadow-elevated)] border-primary/10 overflow-hidden" style={{ height: '600px' }}>
                <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold">Generated Tickets</h3>
                  <p className="text-xs text-muted-foreground">Auto-escalation in action</p>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  {tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Bot className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        No tickets yet. Complex issues will be auto-escalated.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIServices;
