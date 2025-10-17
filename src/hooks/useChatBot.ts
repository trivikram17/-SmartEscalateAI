import { useState, useCallback } from "react";
import { Message } from "@/components/ChatMessage";
import { Ticket } from "@/components/TicketCard";
import { toast } from "sonner";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  console.log("🔍 Debug - Groq API Key check:", {
    keyExists: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyStart: apiKey?.substring(0, 8) + "...",
  });
  
  if (!apiKey) {
    console.warn("❌ Groq API key not found. Please add VITE_GROQ_API_KEY to your .env file");
    return null;
  }
  
  console.log("✅ Creating Groq client with API key");
  return new Groq({ apiKey, dangerouslyAllowBrowser: true });
};

// Initialize Gemini client
const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log("🔍 Debug - Gemini API Key check:", {
    keyExists: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyStart: apiKey?.substring(0, 8) + "...",
  });
  
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn("❌ Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file");
    return null;
  }
  
  console.log("✅ Creating Gemini client with API key");
  return new GoogleGenerativeAI(apiKey);
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
        // Determine which AI provider to use
        const aiProvider = import.meta.env.VITE_AI_PROVIDER || "groq";
        console.log("🤖 Using AI provider:", aiProvider);

        const systemPrompt = `You are Smart Escalate AI, an expert IT support assistant. Your role is to analyze user issues and provide intelligent, step-by-step troubleshooting solutions.

Current context:
- Issue category: ${context.issueCategory || "Not specified"}
- Device type: ${context.deviceType || "Not specified"}
- Attempt count: ${newAttemptCount}
- Conversation history available: ${state.messages.length} messages

Your response guidelines:
1. **Extract Information**: Identify the specific problem from the user's description
2. **Provide Clear Steps**: Give numbered, actionable troubleshooting steps
3. **Be Specific**: Tailor solutions to the exact issue and device type mentioned
4. **Ask Smart Questions**: If you need more details, ask targeted questions
5. **Progressive Support**: Start with simple fixes, then move to advanced solutions
6. **Escalation Awareness**: If the issue seems complex or requires human intervention, suggest creating a support ticket

Response format:
- Start with acknowledging the specific issue
- Provide 3-5 clear, numbered troubleshooting steps
- End with a follow-up question to check progress

Keep responses concise (under 300 words) and professional.`;

        try {
          if (aiProvider === "gemini") {
            // Use Google Gemini
            const geminiClient = getGeminiClient();
            
            if (!geminiClient) {
              response = "I apologize, but I'm unable to connect to my AI service (Gemini). Please ensure the API key is configured correctly. Would you like me to create a support ticket for immediate assistance?";
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
              return;
            }

            const model = geminiClient.getGenerativeModel({ 
              model: import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash",
              systemInstruction: systemPrompt
            });

            // Build conversation history for Gemini
            // Filter to only include user/assistant pairs, and ensure it starts with user
            const conversationHistory = state.messages
              .slice(-6)
              .filter(msg => msg.role === "user" || msg.role === "assistant")
              .map(msg => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }]
              }));

            // Ensure history starts with a user message (Gemini requirement)
            if (conversationHistory.length > 0 && conversationHistory[0].role !== "user") {
              conversationHistory.shift();
            }

            const chat = model.startChat({
              history: conversationHistory,
              generationConfig: {
                maxOutputTokens: 600,
                temperature: 0.7,
              },
            });

            const result = await chat.sendMessage(userMessage);
            response = result.response.text() || "I apologize, but I'm having trouble generating a response right now. Could you please rephrase your question, or would you like me to create a support ticket?";
          } else {
            // Use Groq (default)
            const groqClient = getGroqClient();
            
            if (!groqClient) {
              response = "I apologize, but I'm unable to connect to my AI service (Groq). Please ensure the API key is configured correctly. Would you like me to create a support ticket for immediate assistance?";
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
              return;
            }

            const chatCompletion = await groqClient.chat.completions.create({
              messages: [
                { role: "system", content: systemPrompt },
                ...state.messages.slice(-6).map(msg => ({
                  role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
                  content: msg.content
                })),
                { role: "user" as const, content: userMessage }
              ],
              model: import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile",
              temperature: 0.7,
              max_tokens: 600,
            });

            response = chatCompletion.choices[0]?.message?.content || "I apologize, but I'm having trouble generating a response right now. Could you please rephrase your question, or would you like me to create a support ticket?";
          }
        } catch (error: any) {
          console.error(`${aiProvider} API error details:`, {
            error,
            message: error?.message,
            status: error?.status,
          });
          response = `I'm experiencing technical difficulties connecting to my AI service (${aiProvider}). Error: ${error?.message || 'Unknown error'}. To ensure you get immediate help, I recommend creating a support ticket. Would you like me to do that for you?`;
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
