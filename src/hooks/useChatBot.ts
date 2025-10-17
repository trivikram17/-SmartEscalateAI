import { useState, useCallback } from "react";
import { Message } from "@/components/ChatMessage";
import { Ticket } from "@/components/TicketCard";
import { toast } from "sonner";
import Groq from "groq-sdk";

interface ChatState {
  messages: Message[];
  tickets: Ticket[];
  isTyping: boolean;
  conversationContext: {
    issueCategory?: string;
    deviceType?: string;
    startTime?: Date;
    attemptCount: number;
  };
}

// Initialize Groq client
const getGroqClient = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.warn("Groq API key not found. Please add VITE_GROQ_API_KEY to your .env file");
    return null;
  }
  return new Groq({ apiKey, dangerouslyAllowBrowser: true });
};

export function useChatBot() {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm AssistBot, your virtual assistant. I'm here to help resolve any issues you're experiencing.\n\nTo get started, could you briefly describe the problem you're facing?",
        timestamp: new Date(),
      },
    ],
    tickets: [],
    isTyping: false,
    conversationContext: {
      attemptCount: 0,
    },
  });

  const addMessage = useCallback((message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage;
  }, []);

  const detectSentiment = useCallback((text: string): Message["sentiment"] => {
    const urgentKeywords = ["urgent", "critical", "emergency", "immediately", "asap"];
    const frustratedKeywords = ["frustrated", "annoyed", "angry", "terrible", "worst"];
    
    const lowerText = text.toLowerCase();
    
    if (urgentKeywords.some((keyword) => lowerText.includes(keyword))) {
      return "urgent";
    }
    if (frustratedKeywords.some((keyword) => lowerText.includes(keyword))) {
      return "frustrated";
    }
    return "neutral";
  }, []);

  const generateTicket = useCallback((userMessage: string, context: ChatState["conversationContext"]) => {
    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;
    const sentiment = detectSentiment(userMessage);
    
    const priority = sentiment === "urgent" ? "urgent" : 
                    sentiment === "frustrated" ? "high" :
                    context.attemptCount > 2 ? "high" : "medium";

    const ticket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      ticketNumber,
      status: "received",
      category: context.issueCategory || "General Support",
      priority,
      description: userMessage,
      createdAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      tickets: [...prev.tickets, ticket],
    }));

    return ticket;
  }, [detectSentiment]);

  const handleBotResponse = useCallback(async (userMessage: string) => {
    setState((prev) => ({ ...prev, isTyping: true }));

    try {
      const sentiment = detectSentiment(userMessage);
      const context = state.conversationContext;
      const newAttemptCount = context.attemptCount + 1;

      let response = "";
      let shouldEscalate = false;

      // Check if we should escalate
      if (newAttemptCount > 3 || sentiment === "urgent" || sentiment === "frustrated") {
        shouldEscalate = true;
      }

      if (shouldEscalate) {
        const ticket = generateTicket(userMessage, context);
        response = `I understand this is ${sentiment === "urgent" ? "urgent" : "frustrating"}. I've created a support ticket for you.\n\nTicket Number: ${ticket.ticketNumber}\nPriority: ${ticket.priority.toUpperCase()}\nStatus: ${ticket.status}\n\nYour issue has been escalated to our specialist team. They will reach out to you shortly. You can track your ticket status above.`;
        
        toast.success(`Ticket ${ticket.ticketNumber} created`, {
          description: "Our team will contact you soon",
        });
      } else {
        // Use Groq API for intelligent responses
        const groqClient = getGroqClient();
        
        if (groqClient) {
          try {
            const systemPrompt = `You are a helpful IT support assistant named Smart Escalate AI. Your role is to help users troubleshoot technical issues. 
            
Current context:
- Issue category: ${context.issueCategory || "Not specified"}
- Device type: ${context.deviceType || "Not specified"}
- Attempt count: ${newAttemptCount}

Guidelines:
- Be concise and helpful
- Ask clarifying questions if needed
- Provide step-by-step troubleshooting
- Be empathetic and professional
- If the issue seems complex or user is frustrated, suggest creating a support ticket`;

            const chatCompletion = await groqClient.chat.completions.create({
              messages: [
                { role: "system", content: systemPrompt },
                ...state.messages.slice(-5).map(msg => ({
                  role: msg.role,
                  content: msg.content
                })),
                { role: "user", content: userMessage }
              ],
              model: import.meta.env.VITE_GROQ_MODEL || "llama-3.1-70b-versatile",
              temperature: 0.7,
              max_tokens: 500,
            });

            response = chatCompletion.choices[0]?.message?.content || "I apologize, but I'm having trouble generating a response. Could you please rephrase your question?";
          } catch (error) {
            console.error("Groq API error:", error);
            response = "I'm having trouble connecting to my knowledge base. Let me try to help with some general troubleshooting steps.\n\n1. First, please try restarting your device\n2. Check if your software is up to date\n3. Verify your internet connection is stable\n\nHave you tried any of these steps already?";
          }
        } else {
          // Fallback responses if no API key
          if (!context.issueCategory) {
            response = "Thank you for that information. To help you better, could you tell me which category best describes your issue?\n\n• Network/Connectivity\n• Software/Application\n• Hardware/Device\n• Account/Access\n• Other";
          } else if (!context.deviceType) {
            response = "Got it. What type of device are you experiencing this issue on? (e.g., Windows PC, Mac, iPhone, Android, etc.)";
          } else {
            response = `Let's try some troubleshooting steps:\n\n1. First, please try restarting your ${context.deviceType}\n2. Check if your software is up to date\n3. Verify your internet connection is stable\n\nHave you tried any of these steps already?`;
          }
        }
      }

      addMessage({
        role: "assistant",
        content: response,
        sentiment: sentiment === "urgent" ? "urgent" : undefined,
      });

      setState((prev) => ({
        ...prev,
        isTyping: false,
        conversationContext: {
          ...prev.conversationContext,
          attemptCount: newAttemptCount,
          startTime: prev.conversationContext.startTime || new Date(),
        },
      }));
    } catch (error) {
      console.error("Error in handleBotResponse:", error);
      setState((prev) => ({ ...prev, isTyping: false }));
      toast.error("Failed to get response", {
        description: "Please try again"
      });
    }
  }, [addMessage, detectSentiment, generateTicket, state.conversationContext, state.messages]);

  const sendMessage = useCallback((content: string) => {
    const sentiment = detectSentiment(content);
    
    addMessage({
      role: "user",
      content,
      sentiment,
    });

    handleBotResponse(content);
  }, [addMessage, detectSentiment, handleBotResponse]);

  const handleQuickAction = useCallback((action: string) => {
    const categoryMap: Record<string, string> = {
      network: "Network/Connectivity",
      software: "Software/Application",
      device: "Hardware/Device",
      other: "Other",
    };

    setState((prev) => ({
      ...prev,
      conversationContext: {
        ...prev.conversationContext,
        issueCategory: categoryMap[action],
      },
    }));

    sendMessage(`I'm having issues with ${action}`);
  }, [sendMessage]);

  return {
    messages: state.messages,
    tickets: state.tickets,
    isTyping: state.isTyping,
    sendMessage,
    handleQuickAction,
  };
}
