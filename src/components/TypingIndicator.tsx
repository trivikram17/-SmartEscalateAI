import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4 animate-in fade-in-0 duration-300">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg bg-card border-2 border-primary/20 shadow-sm">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      
      <div className="flex items-center gap-2 rounded-2xl px-4 py-3 bg-card border border-border shadow-[var(--shadow-chat)]">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></div>
        </div>
        <span className="text-sm text-muted-foreground">AssistBot is thinking...</span>
      </div>
    </div>
  );
}
