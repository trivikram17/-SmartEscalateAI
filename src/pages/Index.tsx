import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "@/components/ChatMessage";
import { TicketCard } from "@/components/TicketCard";
import { TypingIndicator } from "@/components/TypingIndicator";
import { QuickActions } from "@/components/QuickActions";
import { useChatBot } from "@/hooks/useChatBot";
import { 
  Send, Bot, Zap, Clock, Shield, Sparkles, TrendingUp, CheckCircle2,
  BarChart3, BookOpen, MessageSquare, ArrowRight, Brain, Rocket
} from "lucide-react";

const Index = () => {
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

  const userName = localStorage.getItem("userName") || "there";
  const isGuest = userName === "Guest User";
  const navigate = useNavigate();

  const exploreCards = [
    {
      icon: Sparkles,
      title: "AI Services",
      description: "Explore our AI capabilities and chat with our intelligent assistant",
      gradient: "from-blue-500 to-purple-600",
      path: "/ai-services",
      features: ["Live Chat Demo", "Service Overview", "Feature Testing"]
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "View insights and performance metrics of the support system",
      gradient: "from-purple-500 to-pink-600",
      path: "/analytics",
      features: ["Real-time Stats", "Visual Reports", "Trend Analysis"]
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Browse documentation, FAQs, and troubleshooting guides",
      gradient: "from-green-500 to-teal-600",
      path: "/knowledge-base",
      features: ["Search Articles", "Step Guides", "Quick Solutions"]
    }
  ];

  return (
    <div className="bg-[image:var(--gradient-background)]">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                {isGuest 
                  ? "You're browsing as a guest. Start chatting to get instant AI-powered support!"
                  : "How can I help you today? I'm here to resolve your issues quickly."}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Clock className="w-3 h-3 mr-1" />
                24/7 Available
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 shadow-lg border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'resolved').length}</p>
                <p className="text-sm text-muted-foreground">Issues Resolved</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{messages.length}</p>
                <p className="text-sm text-muted-foreground">Messages Exchanged</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tickets.length}</p>
                <p className="text-sm text-muted-foreground">Active Tickets</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Explore Section */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Explore Our Platform</h2>
            <p className="text-muted-foreground">Discover powerful features to enhance your support experience</p>
          </div>
          <Rocket className="w-8 h-8 text-primary" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {exploreCards.map((card) => (
            <Card 
              key={card.title}
              className="group relative overflow-hidden border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl cursor-pointer"
              onClick={() => navigate(card.path)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="p-6 relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {card.description}
                </p>

                <ul className="space-y-2 mb-4">
                  {card.features.map((feature) => (
                    <li key={feature} className="text-sm flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Explore Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Support Section */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Quick Support Chat</h2>
          <p className="text-muted-foreground">Need help now? Start chatting with our AI assistant</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-4" style={{ height: '500px' }}>
          {/* Main Chat Area */}
          <Card className="flex flex-col shadow-[var(--shadow-elevated)] border-primary/10 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-lg">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold">AssistBot</h1>
                <p className="text-sm text-muted-foreground">Your AI Support Assistant</p>
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
                    Or select a common issue:
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
                placeholder="Describe your issue..."
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
        <Card className="flex flex-col shadow-[var(--shadow-elevated)] border-primary/10 overflow-hidden">
          <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold">Active Tickets</h2>
            <p className="text-xs text-muted-foreground">Track your support requests</p>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No tickets yet. I'll create one if we need to escalate your issue.
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
      </div>
    </div>
  );
};

export default Index;
