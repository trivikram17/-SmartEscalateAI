import { useState, useCallback } from "react";
import { Message, MessageRole } from "@/components/ChatMessage";
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

// Helper: Detect if user is making progress
const detectProgress = (messages: Message[]): boolean => {
  // Look for positive feedback in last 5 user messages
  const positiveKeywords = ["thanks", "resolved", "fixed", "working", "solved", "improved", "got it", "helped", "success"];  
  const recentUserMessages = messages.slice(-5).filter(m => m.role === "user");
  return recentUserMessages.some(m => positiveKeywords.some(k => m.content.toLowerCase().includes(k)));
};

// Helper: Get company support email based on device type
const getCompanySupportEmail = (deviceType: string | undefined): string => {
  if (!deviceType) return "support@defaultcompany.com";
  const map: Record<string, string> = {
    lenovo: "customercare@lenovo.com",
    dell: "support@dell.com",
    hp: "support@hp.com",
    apple: "support@apple.com",
    asus: "support@asus.com",
    acer: "support@acer.com",
    // Add more as needed
  };
  const key = deviceType.toLowerCase();
  return map[key] || "support@defaultcompany.com";
};

// Helper: Get ticket priority based on issue type
const getPriorityByIssue = (issue: string): "low" | "medium" | "high" | "urgent" => {
  const urgentIssues = ["screen not working", "won't turn on", "no display", "battery overheating", "data loss", "system crash", "security breach"];
  const highIssues = ["wifi not working", "slow performance", "keyboard not working", "touchpad issue", "audio problem"];
  const issueLower = issue.toLowerCase();
  if (urgentIssues.some(i => issueLower.includes(i))) return "urgent";
  if (highIssues.some(i => issueLower.includes(i))) return "high";
  return "medium";
};

// Helper: Prepare email content for ticket
const prepareTicketEmail = (ticket: Ticket, messages: Message[], companyEmail: string): { to: string, subject: string, body: string } => {
  const last20 = messages.slice(-20);
  const summary = last20.map(m => `- ${m.role === "user" ? "User" : "Assistant"} (${m.timestamp.toLocaleTimeString()}): ${m.content}`).join("\n");
  const header = `Smart Escalate AI - Support Ticket`;
  const body = [
    header,
    "",
    `Ticket: ${ticket.ticketNumber}`,
    `Category: ${ticket.category}`,
    `Priority: ${ticket.priority.toUpperCase()}`,
    `Status: ${ticket.status}`,
    `Created: ${ticket.createdAt.toLocaleString()}`,
    "",
    `Reported Issue: ${ticket.description}`,
    "",
    "Conversation Summary (latest 20 messages):",
    summary,
  ].join("\n");
  return {
    to: companyEmail || (import.meta.env.EMAIL_FALLBACK_TO as string) || "support@defaultcompany.com",
    subject: `Support Ticket ${ticket.ticketNumber} - ${ticket.category}`,
    body,
  };
};

async function sendTicketEmail(payload: { to: string; subject: string; body: string }) {
  try {
    const res = await fetch("/api/sendTicketEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || "Failed to send email");
    return data;
  } catch (err: any) {
    throw new Error(err?.message || "Email send failed");
  }
}

// Update Ticket type to include companyEmail
export interface Ticket {
  id: string;
  ticketNumber: string;
  status: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  description: string;
  createdAt: Date;
  companyEmail: string;
}

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

  // Add a new state to track if ticket confirmation is pending
  const [pendingTicket, setPendingTicket] = useState<null | { userMessage: string, context: ChatState["conversationContext"] }>(null);

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

  const generateTicket = useCallback(async (userMessage: string, context: ChatState["conversationContext"]) => {
    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;
    const deviceType = context.deviceType;
    const priority = getPriorityByIssue(userMessage);
    const companyEmail = getCompanySupportEmail(deviceType);

    const ticket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      ticketNumber,
      status: "received",
      category: context.issueCategory || "General Support",
      priority,
      description: userMessage,
      createdAt: new Date(),
      companyEmail,
    };

    setState((prev) => ({
      ...prev,
      tickets: [...prev.tickets, ticket],
    }));

    // Prepare email and send
    const email = prepareTicketEmail(ticket, state.messages, companyEmail);
    try {
      await sendTicketEmail(email);
      toast.success(`Ticket ${ticket.ticketNumber} email sent`, { description: `Sent to ${email.to}` });
    } catch (e: any) {
      console.error("Email send failed:", e);
      toast.error("Failed to email ticket", { description: e.message });
    }

    return ticket;
  }, []);

  const handleBotResponse = useCallback(async (userMessage: string) => {
    setState((prev) => ({ ...prev, isTyping: true }));

    try {
      const context = state.conversationContext;
      const newAttemptCount = context.attemptCount + 1;
      const sentiment = detectSentiment(userMessage);
      const messages = [...state.messages, {
        id: Math.random().toString(36).substr(2, 9),
        role: "user" as MessageRole,
        content: userMessage,
        timestamp: new Date(),
        sentiment,
      }];
      const progress = detectProgress(messages);

      let response = "";
      let shouldEscalate = false;

      // Only escalate if NO progress after 10-15 attempts
      if (!progress && newAttemptCount >= 10) {
        // Instead of auto-creating ticket, ask user for confirmation
        setPendingTicket({ userMessage, context });
        response = `We've tried many solutions but haven't resolved your issue. Would you like to create a support ticket and send a summary to the support team for further assistance? (yes/no)`;
        addMessage({
          role: "assistant",
          content: response,
          sentiment: undefined,
        });
        setState((prev) => ({ ...prev, isTyping: false }));
        return;
      }

      if (shouldEscalate) {
        const deviceType = context.deviceType;
        const priority = getPriorityByIssue(userMessage);
        const companyEmail = getCompanySupportEmail(deviceType);
        const ticket: Ticket = {
          id: Math.random().toString(36).substr(2, 9),
          ticketNumber: `TKT-${Date.now().toString().slice(-6)}`,
          status: "received",
          category: context.issueCategory || "General Support",
          priority,
          description: userMessage,
          createdAt: new Date(),
          companyEmail,
        };
        setState((prev) => ({
          ...prev,
          tickets: [...prev.tickets, ticket],
        }));
        // Prepare email (simulate sending)
        const email = prepareTicketEmail(ticket, state.messages, companyEmail);
        console.log("📧 Ticket email prepared:", email);
        response = `It looks like we've tried many solutions but haven't resolved your issue. I've created a support ticket for you and sent a summary to ${ticket.companyEmail} for further assistance.\n\nTicket Number: ${ticket.ticketNumber}\nPriority: ${ticket.priority.toUpperCase()}\nStatus: ${ticket.status}\n\nYour issue has been escalated to the specialist team. You can track your ticket status above.`;
        toast.success(`Ticket ${ticket.ticketNumber} created`, {
          description: `Email sent to ${ticket.companyEmail}`,
        });
      } else {
        // Determine which AI provider to use
        const aiProvider = import.meta.env.VITE_AI_PROVIDER || "groq";
        console.log("🤖 Using AI provider:", aiProvider);

        const systemPrompt = `You are Smart Escalate AI, an expert IT support assistant. Your job is to help users solve their problems in a way that is clear, adaptive, and genuinely helpful.

Guidelines:
1. Carefully read the user's latest message and all previous messages in the conversation.
2. Reference what the user has already tried and avoid repeating the same steps.
3. Adapt your troubleshooting steps to the specific device, issue, and user feedback.
4. Use simple, clear language and explain the reasoning behind each step.
5. If helpful, use analogies, examples, or visuals to clarify your advice.
6. If the user seems confused, rephrase your instructions or offer alternative solutions.
7. Always provide new, relevant, and personalized advice—never generic or template-like answers.
8. Summarize your advice at the end and check if the user understands or needs more help.
9. Be empathetic, encouraging, and positive throughout the conversation.
10. Only suggest escalation or ticket creation if all reasonable troubleshooting steps have failed.

Response format:
- Start with a friendly greeting or acknowledgment of the specific issue.
- Provide 2-5 clear, context-aware troubleshooting steps (not generic).
- Reference previous attempts and adapt your advice.
- End with a summary and a simple follow-up question to check progress or understanding.

Keep responses concise (under 200 words), positive, and easy to follow.`;

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

            // Create a temporary message that will be updated as we receive chunks
            const tempMessageId = Math.random().toString(36).substr(2, 9);
            const tempMessage: Message = {
              id: tempMessageId,
              role: "assistant",
              content: "",
              timestamp: new Date(),
              sentiment: sentiment === "urgent" ? "urgent" : undefined,
              isStreaming: true, // Mark as streaming for cursor animation
            };

            setState((prev) => ({
              ...prev,
              messages: [...prev.messages, tempMessage],
            }));

            // Stream the response for interactive experience
            const result = await chat.sendMessageStream(userMessage);
            
            let chunkCount = 0;
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              response += chunkText;
              chunkCount++;
              
              // Update the message with accumulated content (still streaming)
              setState((prev) => ({
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === tempMessageId 
                    ? { ...msg, content: response, isStreaming: true }
                    : msg
                ),
              }));
            }
            
            console.log("✅ Gemini streaming complete:", { 
              chunkCount, 
              responseLength: response.length 
            });

            // Mark streaming as complete
            setState((prev) => ({
              ...prev,
              messages: prev.messages.map(msg => 
                msg.id === tempMessageId 
                  ? { ...msg, isStreaming: false }
                  : msg
              ),
            }));

            if (!response) {
              response = "I apologize, but I'm having trouble generating a response right now. Could you please rephrase your question, or would you like me to create a support ticket?";
              setState((prev) => ({
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === tempMessageId 
                    ? { ...msg, content: response, isStreaming: false }
                    : msg
                ),
              }));
            }
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

            // Create a streaming response for more interactive experience
            const stream = await groqClient.chat.completions.create({
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
              stream: true, // Enable streaming for interactive responses
            });

            // Create a temporary message that will be updated as we receive chunks
            const tempMessageId = Math.random().toString(36).substr(2, 9);
            const tempMessage: Message = {
              id: tempMessageId,
              role: "assistant",
              content: "",
              timestamp: new Date(),
              sentiment: sentiment === "urgent" ? "urgent" : undefined,
              isStreaming: true, // Mark as streaming for cursor animation
            };

            setState((prev) => ({
              ...prev,
              messages: [...prev.messages, tempMessage],
            }));

            // Process the stream and update the message in real-time
            let chunkCount = 0;
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || "";
              response += content;
              chunkCount++;
              
              // Update the message with accumulated content (still streaming)
              setState((prev) => ({
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === tempMessageId 
                    ? { ...msg, content: response, isStreaming: true }
                    : msg
                ),
              }));
            }
            
            console.log("✅ Groq streaming complete:", { 
              chunkCount, 
              responseLength: response.length 
            });

            // Mark streaming as complete
            setState((prev) => ({
              ...prev,
              messages: prev.messages.map(msg => 
                msg.id === tempMessageId 
                  ? { ...msg, isStreaming: false }
                  : msg
              ),
            }));

            if (!response) {
              response = "I apologize, but I'm having trouble generating a response right now. Could you please rephrase your question, or would you like me to create a support ticket?";
              setState((prev) => ({
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === tempMessageId 
                    ? { ...msg, content: response, isStreaming: false }
                    : msg
                ),
              }));
            }
          }
        } catch (error: any) {
          console.error(`${aiProvider} API error details:`, {
            error,
            message: error?.message,
            status: error?.status,
          });
          response = `I'm experiencing technical difficulties connecting to my AI service (${aiProvider}). Error: ${error?.message || 'Unknown error'}. To ensure you get immediate help, I recommend creating a support ticket. Would you like me to do that for you?`;
          
          // Add error message if not already added during streaming
          if (!response.includes("I'm experiencing technical difficulties")) {
            addMessage({
              role: "assistant",
              content: response,
              sentiment: sentiment === "urgent" ? "urgent" : undefined,
            });
          }
        }
      }

      // For escalation responses (non-streaming), add the message
      if (shouldEscalate) {
        addMessage({
          role: "assistant",
          content: response,
          sentiment: sentiment === "urgent" ? "urgent" : undefined,
        });
      }

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
  }, [generateTicket, state.conversationContext, state.messages, detectSentiment]);

  // Listen for user confirmation to create ticket
  const handleUserConfirmation = useCallback(async (userMessage: string) => {
    if (pendingTicket && ["yes", "y", "create ticket", "please do"].includes(userMessage.trim().toLowerCase())) {
      const { userMessage: originalMessage, context } = pendingTicket;
      const ticket = await generateTicket(originalMessage, context);
      addMessage({
        role: "assistant",
        content: `Your support ticket has been created and a summary sent to ${ticket.companyEmail}.\n\nTicket Number: ${ticket.ticketNumber}\nPriority: ${ticket.priority.toUpperCase()}\nStatus: ${ticket.status}\n\nYour issue has been escalated to the specialist team. You can track your ticket status above.`,
        sentiment: undefined,
      });
      setPendingTicket(null);
      setState((prev) => ({ ...prev, isTyping: false }));
    } else if (pendingTicket) {
      addMessage({
        role: "assistant",
        content: `No ticket has been created. Let's keep trying to resolve your issue together!`,
        sentiment: undefined,
      });
      setPendingTicket(null);
      setState((prev) => ({ ...prev, isTyping: false }));
    }
  }, [pendingTicket, state.messages, generateTicket, addMessage]);

  // Update sendMessage to check for pending ticket confirmation
  const sendMessage = useCallback(async (content: string) => {
    if (pendingTicket) {
      await handleUserConfirmation(content);
      return;
    }
    const sentiment = detectSentiment(content);
    addMessage({
      role: "user",
      content,
      sentiment,
    });
    handleBotResponse(content);
  }, [addMessage, detectSentiment, handleBotResponse, pendingTicket, handleUserConfirmation]);

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
