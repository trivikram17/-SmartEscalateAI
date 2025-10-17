import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, Zap, Clock, Shield, Sparkles, TrendingUp, CheckCircle2,
  BarChart3, BookOpen, MessageSquare, ArrowRight, Brain, Rocket,
  Users, Award, Target, PlayCircle, Star, Globe
} from "lucide-react";

const Index = () => {
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
    <div className="bg-[image:var(--gradient-background)] min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center space-y-8">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 animate-in fade-in slide-in-from-top duration-700">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Welcome {isGuest ? "Guest" : userName}!</span>
              <Badge className="bg-white/30 text-white border-0 hover:bg-white/40">New</Badge>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-1000">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Smart Support with
                <span className="block bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                  AI-Powered Intelligence
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Experience the future of customer support. Get instant solutions, smart escalations, 
                and 24/7 assistance powered by advanced AI technology.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 shadow-2xl hover:shadow-white/20 transition-all text-lg px-8 py-6 group"
                onClick={() => navigate("/ai-services")}
              >
                <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Chatting Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                className="bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-600 backdrop-blur-md shadow-xl hover:shadow-white/30 transition-all text-lg px-8 py-6 group font-semibold"
                onClick={() => navigate("/about")}
              >
                <Globe className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Learn More
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center pt-8 animate-in fade-in duration-1000 delay-300">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm">AI Powered</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Shield className="w-4 h-4 text-green-300" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Clock className="w-4 h-4 text-blue-300" />
                <span className="text-sm">24/7 Available</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Rocket className="w-4 h-4 text-pink-300" />
                <span className="text-sm">Lightning Fast</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
                  fill="currentColor" 
                  className="text-background dark:text-background" />
          </svg>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 mb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl border-none shadow-xl backdrop-blur-sm bg-card/95 hover:shadow-2xl hover:scale-105 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20 dark:to-transparent" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">10K+</p>
                <p className="text-sm text-muted-foreground font-medium">Happy Users</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border-none shadow-xl backdrop-blur-sm bg-card/95 hover:shadow-2xl hover:scale-105 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">50K+</p>
                <p className="text-sm text-muted-foreground font-medium">Conversations</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border-none shadow-xl backdrop-blur-sm bg-card/95 hover:shadow-2xl hover:scale-105 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 dark:to-transparent" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">95%</p>
                <p className="text-sm text-muted-foreground font-medium">Success Rate</p>
              </div>
            </div>
          </div>
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

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1 text-center">Why Choose SmartEscalate AI?</h2>
          <p className="text-muted-foreground text-center">Powerful features designed to enhance your support experience</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">AI-Powered Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI understands your issues and provides accurate solutions instantly
            </p>
          </Card>

          <Card className="p-6 border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Get instant responses and resolve issues in seconds, not hours
            </p>
          </Card>

          <Card className="p-6 border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">Secure & Reliable</h3>
            <p className="text-sm text-muted-foreground">
              Enterprise-grade security with 99.9% uptime guarantee
            </p>
          </Card>

          <Card className="p-6 border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">Smart Escalation</h3>
            <p className="text-sm text-muted-foreground">
              Automatically escalates complex issues to the right team members
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <Card className="relative overflow-hidden border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <div className="relative p-8 md:p-12 text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Experience the future of customer support with AI-powered assistance. 
              Start chatting now and see the difference.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity"
                onClick={() => navigate("/ai-services")}
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Try AI Chat Now
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/about")}
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
