import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Target, Zap, Shield, Users, Heart } from "lucide-react";

const About = () => {
  const features = [
    { icon: Zap, title: "Lightning Fast", description: "Instant responses with AI-powered assistance" },
    { icon: Shield, title: "Secure & Private", description: "Your data is encrypted and protected" },
    { icon: Users, title: "24/7 Available", description: "Always here when you need support" },
    { icon: Heart, title: "Human Touch", description: "Smart escalation to human agents when needed" }
  ];

  const team = [
    { name: "AI Engine", role: "Core Intelligence", avatar: "🤖" },
    { name: "Support Team", role: "Human Backup", avatar: "👥" },
    { name: "Dev Team", role: "Technical Excellence", avatar: "💻" },
    { name: "Product Team", role: "User Experience", avatar: "🎨" }
  ];

  return (
    <div className="bg-[image:var(--gradient-background)] p-6 min-h-[calc(100vh-16rem)]">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="p-8 shadow-[var(--shadow-elevated)] border-primary/10 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] shadow-lg">
              <Bot className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">AssistBot</h1>
          <p className="text-lg text-muted-foreground mb-4">Your AI-Powered Support Assistant</p>
          <Badge variant="default" className="bg-[image:var(--gradient-primary)]">Version 1.0.0</Badge>
        </Card>

        <Card className="p-8 shadow-[var(--shadow-elevated)] border-primary/10">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-lg">
              <Target className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                AssistBot is designed to revolutionize customer support by combining cutting-edge AI technology 
                with human expertise. We provide instant, accurate assistance while maintaining the personal 
                touch that makes great support experiences memorable.
              </p>
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            <p>
              Built with advanced natural language processing, sentiment analysis, and intelligent routing, 
              AssistBot handles everything from simple queries to complex troubleshooting scenarios. When issues 
              require human intervention, our smart escalation system ensures seamless handoffs with full context.
            </p>
            <p>
              We believe in transparent AI – you always know when you're talking to our bot, and we make it 
              easy to connect with a human agent whenever needed. Our goal is to resolve issues faster, 
              reduce frustration, and continuously learn from every interaction.
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 shadow-[var(--shadow-elevated)] border-primary/10 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-lg">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 shadow-[var(--shadow-elevated)] border-primary/10">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="text-5xl mb-3">{member.avatar}</div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
