import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/ChatMessage";
import { TicketCard } from "@/components/TicketCard";
import { TypingIndicator } from "@/components/TypingIndicator";
import { QuickActions } from "@/components/QuickActions";
import { useChatBot } from "@/hooks/useChatBot";
import { Send, Bot } from "lucide-react";

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

  return (
    <div className="bg-[image:var(--gradient-background)] p-6">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-[1fr_350px] gap-4" style={{ height: 'calc(100vh - 8rem)' }}>
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
  );
};

export default Index;
