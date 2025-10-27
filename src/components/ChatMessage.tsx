import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Bot, User } from "lucide-react";

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  sentiment?: "neutral" | "frustrated" | "urgent";
  metadata?: {
    category?: string;
    priority?: string;
  };
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isUrgent = message.sentiment === "urgent" || message.sentiment === "frustrated";

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg shadow-sm transition-transform hover:scale-105",
          isUser
            ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
            : "bg-card border-2 border-primary/20"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
      </div>
      
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl px-4 py-3 max-w-[80%] shadow-[var(--shadow-chat)] transition-all",
          isUser
            ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
            : "bg-card border border-border"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        
        {message.metadata && (
          <div className="flex gap-2 flex-wrap mt-1">
            {message.metadata.category && (
              <Badge variant="secondary" className="text-xs">
                {message.metadata.category}
              </Badge>
            )}
            {message.metadata.priority && (
              <Badge
                variant={isUrgent ? "destructive" : "outline"}
                className="text-xs"
              >
                {message.metadata.priority}
              </Badge>
            )}
          </div>
        )}
        
        <span className="text-xs opacity-60 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
