import { useState, useCallback } from "react";
import { Message } from "@/components/ChatMessage";
import { Ticket } from "@/components/TicketCard";
import { toast } from "sonner";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import emailjs from '@emailjs/browser';

interface ChatState {
  messages: Message[];
  tickets: Ticket[];
  isTyping: boolean;
  conversationContext: {
    issueCategory?: string;
    deviceType?: string;
    startTime?: Date;
    attemptCount: number;
    detectedCompany?: string;
    mainIssue?: string;
    userEmail?: string;
    userName?: string;
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
  // Get user info from localStorage (set during login)
  const loggedInUserEmail = localStorage.getItem("userEmail") || "";
  const loggedInUserName = localStorage.getItem("userName") || "";

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
      userEmail: loggedInUserEmail, // Initialize with logged-in user's email
      userName: loggedInUserName,   // Initialize with logged-in user's name
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

  const detectTicketRequest = useCallback((text: string, lastBotMessage?: string): boolean => {
    const ticketKeywords = [
      "generate ticket", "create ticket", "escalate", "raise ticket",
      "open ticket", "file ticket", "escalate this", "make ticket",
      "send ticket", "need ticket", "want ticket", "get ticket"
    ];
    
    const lowerText = text.toLowerCase().trim();
    
    // Check for explicit ticket keywords
    const hasExplicitKeyword = ticketKeywords.some((keyword) => lowerText.includes(keyword));
    
    // Check if last bot message was asking about generating a ticket (more flexible)
    const botAskedAboutTicket = lastBotMessage?.toLowerCase().includes("support ticket") || 
                                 lastBotMessage?.toLowerCase().includes("escalate") ||
                                 lastBotMessage?.toLowerCase().includes("customer care team");
    
    // If bot asked about ticket and user says yes/sure/okay, treat as confirmation
    const confirmationKeywords = ["yes", "yeah", "yep", "yeas", "sure", "okay", "ok", "please", "go ahead", "do it"];
    const isConfirmation = confirmationKeywords.some((keyword) => lowerText === keyword || lowerText.includes(keyword));
    
    console.log("🎫 Ticket Detection:", {
      hasExplicitKeyword,
      botAskedAboutTicket,
      isConfirmation,
      willGenerateTicket: hasExplicitKeyword || (botAskedAboutTicket && isConfirmation)
    });
    
    return hasExplicitKeyword || (botAskedAboutTicket && isConfirmation);
  }, []);

  const detectCompany = useCallback((text: string): string | null => {
    const companies: Record<string, string[]> = {
      'Airtel': ['airtel', 'bharti'],
      'Jio': ['jio', 'reliance jio'],
      'Vi': ['\\bvi\\b', 'vodafone', 'idea', 'vodafone idea'], // \b for word boundary - won't match "wifi"
      'BSNL': ['bsnl', 'bharat sanchar'],
      'Amazon': ['amazon', 'amzn'],
      'Flipkart': ['flipkart', 'fk'],
      'Swiggy': ['swiggy'],
      'Zomato': ['zomato'],
      'Ola': ['\\bola\\b'], // \b to avoid matching "cola", "ebola", etc.
      'Uber': ['uber'],
      'Paytm': ['paytm'],
      'PhonePe': ['phonepe', 'phone pe'],
      'Google Pay': ['google pay', 'gpay', 'g pay'],
    };

    const lowerText = text.toLowerCase();
    
    for (const [company, keywords] of Object.entries(companies)) {
      for (const keyword of keywords) {
        // Check if keyword contains regex pattern (starts with \b)
        if (keyword.includes('\\b')) {
          const regex = new RegExp(keyword, 'i');
          if (regex.test(lowerText)) {
            return company;
          }
        } else {
          // Simple includes check for other keywords
          if (lowerText.includes(keyword)) {
            return company;
          }
        }
      }
    }
    
    return null;
  }, []);

  const detectEmail = useCallback((text: string): string | null => {
    // Email regex pattern
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : null;
  }, []);

  const extractEmail = useCallback((text: string): string | null => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = text.match(emailRegex);
    return match ? match[0] : null;
  }, []);

  const generateTicket = useCallback(async (userMessage: string, context: ChatState["conversationContext"], currentMessages?: Message[]) => {
    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;
    const sentiment = detectSentiment(userMessage);
    
    const priority = sentiment === "urgent" ? "urgent" : 
                    sentiment === "frustrated" ? "high" :
                    context.attemptCount > 2 ? "high" : "medium";

    // Extract subject from main issue or use first 100 chars
    const subject = context.mainIssue || userMessage.substring(0, 100);

    // Determine company email
    const detectedCompany = context.detectedCompany?.toLowerCase();
    const companyEmails: Record<string, string> = {
      'airtel': '121@in.airtel.com',
      'jio': 'care@jio.com',
      'vi': 'customercare@myvi.in',
      'bsnl': 'customercare@bsnl.in',
      'amazon': 'cs-reply@amazon.in',
      'flipkart': 'support@flipkart.com',
      'swiggy': 'support@swiggy.in',
      'zomato': 'support@zomato.com',
      'ola': 'support@olacabs.com',
      'uber': 'support@uber.com',
      'paytm': 'care@paytm.com',
      'phonepe': 'support@phonepe.com',
      'googlepay': 'support-in@google.com',
    };
    const companyEmail = (detectedCompany && companyEmails[detectedCompany]) || "support@smartescalate.ai";

    const ticket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      ticketNumber,
      status: "received",
      category: context.issueCategory || "General Support",
      priority,
      description: userMessage,
      subject: subject,
      createdAt: new Date(),
      emailSent: false,
      companyEmail: companyEmail,
    };

    setState((prev) => ({
      ...prev,
      tickets: [...prev.tickets, ticket],
    }));

    // Use provided messages or fallback to state.messages
    // Add current user message to the conversation for email
    const messagesToSend = currentMessages || [
      ...state.messages,
      {
        id: Date.now().toString(),
        role: 'user' as const,
        content: userMessage,
        timestamp: new Date(),
      }
    ];

    // Send ticket email and update ticket status
    const emailSuccess = await sendTicketEmail(ticket, messagesToSend, context);
    
    if (emailSuccess) {
      // Update ticket with email sent status
      setState((prev) => ({
        ...prev,
        tickets: prev.tickets.map(t => 
          t.id === ticket.id 
            ? { ...t, emailSent: true, emailSentAt: new Date() }
            : t
        ),
      }));
    }

    return ticket;
  }, [detectSentiment]);

  const sendTicketEmail = useCallback(async (
    ticket: Ticket,
    messages: Message[],
    context: ChatState["conversationContext"]
  ): Promise<boolean> => {
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        console.warn("EmailJS not configured - ticket email not sent");
        return false;
      }

      // Generate HTML-formatted chat summary for better rendering in emails
      console.log("📧 Generating email with messages:", messages.length, "messages");
      console.log("📧 Messages:", messages.map(m => ({ role: m.role, content: m.content.substring(0, 50) })));
      
      const chatSummary = messages
        .slice(-10) // Last 10 messages
        .map((msg, index) => {
          const speaker = msg.role === 'user' ? '👤 CUSTOMER' : '🤖 AI ASSISTANT';
          const speakerClass = msg.role === 'user' ? 'customer' : 'ai-assistant';
          const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '';
          
          // Convert markdown-style formatting to HTML
          let formattedContent = msg.content
            // Convert **bold** to <strong>bold</strong>
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert line breaks to <br>
            .replace(/\n/g, '<br>')
            // Preserve emoji and special characters
            .trim();
          
          return `
            <div class="chat-message">
              <div class="timestamp">${timestamp}</div>
              <div class="speaker ${speakerClass}">${speaker}</div>
              <div class="message-content">${formattedContent}</div>
            </div>
          `;
        })
        .join('');

      // Determine recipient email based on detected company
      let recipientEmail = "support@smartescalate.ai"; // Default
      const detectedCompany = context.detectedCompany?.toLowerCase();
      
      // Company email mapping
      const companyEmails: Record<string, string> = {
        'airtel': '121@in.airtel.com',
        'jio': 'care@jio.com',
        'vi': 'customercare@myvi.in',
        'bsnl': 'customercare@bsnl.in',
        'amazon': 'cs-reply@amazon.in',
        'flipkart': 'support@flipkart.com',
        // Add more companies as needed
      };

      if (detectedCompany && companyEmails[detectedCompany]) {
        recipientEmail = companyEmails[detectedCompany];
      }

      // Send email
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: recipientEmail,
          from_name: context.userName || "User",
          from_email: context.userEmail || "user@example.com",
          reply_to: context.userEmail || "user@example.com",
          ticket_number: ticket.ticketNumber,
          subject: context.mainIssue || ticket.description.substring(0, 100),
          priority: ticket.priority.toUpperCase(),
          category: ticket.category,
          company: context.detectedCompany || "Not specified",
          chat_summary: chatSummary,
          created_at: ticket.createdAt.toLocaleString(),
        },
        publicKey
      );

      console.log("✅ Ticket email sent successfully to:", recipientEmail);
      return true;
    } catch (error) {
      console.error("Failed to send ticket email:", error);
      return false;
    }
  }, []);

  const handleBotResponse = useCallback(async (userMessage: string) => {
    setState((prev) => ({ ...prev, isTyping: true }));

    try {
      const sentiment = detectSentiment(userMessage);
      const context = state.conversationContext;
      const newAttemptCount = context.attemptCount + 1;

      // Detect company from user message
      const detectedCompany = detectCompany(userMessage);
      if (detectedCompany && !context.detectedCompany) {
        setState((prev) => ({
          ...prev,
          conversationContext: {
            ...prev.conversationContext,
            detectedCompany,
          },
        }));
      }

      // Note: User email and name are already available from login (localStorage)
      // No need to detect/extract from messages

      // Check if user wants to generate a ticket (pass last bot message for context)
      const lastBotMessage = state.messages.length > 0 
        ? state.messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content 
        : undefined;
      const wantsTicket = detectTicketRequest(userMessage, lastBotMessage);

      console.log("🔍 Debug Info:", {
        userMessage,
        detectedCompany,
        contextDetectedCompany: context.detectedCompany,
        wantsTicket,
        lastBotMessageIncludesTicket: lastBotMessage?.toLowerCase().includes("generate a support ticket"),
        lastBotMessage: lastBotMessage?.substring(0, 100) // First 100 chars
      });

      let response = "";
      let shouldGenerateTicket = false;

      // ONLY generate ticket if user explicitly requests it
      if (wantsTicket) {
        shouldGenerateTicket = true;
        console.log("✅ TICKET REQUESTED - shouldGenerateTicket set to true");
      } else {
        console.log("❌ NO TICKET REQUEST - wantsTicket is false, will call AI");
      }

      if (shouldGenerateTicket) {
        // Use company from context (detected earlier) OR newly detected company
        const currentCompany = context.detectedCompany || detectedCompany;
        const currentEmail = context.userEmail; // Always available from login
        const currentName = context.userName;   // Always available from login
        
        console.log("🎫 Ticket generation requested. Company:", currentCompany);
        
        // If company not detected, ask for it
        if (!currentCompany) {
          response = `I'll generate a ticket for you. Which company or service are you experiencing this issue with? (e.g., Airtel, Jio, Vi, Amazon, Flipkart, etc.)`;
        } else {
          // Extract main issue from conversation (look for user's initial problem description)
          const userMessages = state.messages.filter(m => m.role === "user");
          const mainIssueText = userMessages.length > 0 
            ? userMessages[0].content.substring(0, 150) 
            : userMessage.substring(0, 150);

          // Generate ticket with company info and user email
          const updatedContext = {
            ...context,
            detectedCompany: currentCompany,
            mainIssue: mainIssueText,
            userEmail: currentEmail,
            userName: currentName,
          };
          
          // Create a complete messages array including the current user message
          const completeMessages: Message[] = [
            ...state.messages,
            {
              id: Date.now().toString(),
              role: 'user' as const,
              content: userMessage,
              timestamp: new Date(),
            }
          ];
          
          const ticket = await generateTicket(userMessage, updatedContext, completeMessages);
          
          response = `✅ Support ticket generated successfully!\n\n📋 **Ticket Details:**\n- Ticket Number: ${ticket.ticketNumber}\n- Priority: ${ticket.priority.toUpperCase()}\n- Status: ${ticket.status}\n- Company: ${currentCompany}\n- From: ${currentName} (${currentEmail})\n\n📧 An email has been sent from your email address (${currentEmail}) to ${currentCompany}'s customer care team with the complete chat summary. They will review your issue and respond directly to your email.\n\nYou can track your ticket status in the tickets section above.`;
          
          toast.success(`Ticket ${ticket.ticketNumber} created`, {
            description: `Email sent to ${currentCompany} customer care`,
          });
        }
      } else {
        // Determine which AI provider to use
        const aiProvider = import.meta.env.VITE_AI_PROVIDER || "groq";
        console.log("🤖 Using AI provider:", aiProvider);

        const systemPrompt = `You are Smart Escalate AI, a friendly and helpful customer support assistant. Your goal is to help users solve problems through smart, conversational troubleshooting.

Current context:
- Issue category: ${context.issueCategory || "Not specified"}
- Device type: ${context.deviceType || "Not specified"}
- Attempt count: ${newAttemptCount}
- Conversation history: ${state.messages.length} messages
- Company/Service: ${context.detectedCompany || "Not yet identified"}

**RESPONSE STRATEGY**:

**FIRST MESSAGE (Attempt 1):**
- Empathize with the issue
- Ask 2-3 specific questions to understand the situation:
  * **ALWAYS ask which company/service** if not explicitly mentioned (e.g., "Which service are you having issues with - Airtel, Jio, Vi, Amazon, etc.?")
  * What device type (if relevant)
  * When did it start
  * Any error messages
- Keep it short and friendly (50-80 words)

**SUBSEQUENT MESSAGES (Attempts 2-7):**
Once you understand the issue, provide OPTIMIZED SOLUTIONS:

- Give **2-4 clear troubleshooting steps** at once
- Each step should be actionable and specific
- Use **bold** for step titles
- Include what to expect after each step
- Medium-sized responses (150-250 words)
- Format clearly with numbers or bullets
- End with: "Try these steps and let me know what happens!"

**WHEN TO OFFER TICKET (Attempt 8+ OR when needed):**
- After 8+ attempts with no resolution
- If you genuinely cannot solve (hardware issue, account issue, etc.)
- If user is clearly frustrated
- ASK: "Would you like me to generate a support ticket and escalate this to [Company]'s customer care team?"
- NEVER auto-generate! ALWAYS wait for explicit confirmation

**SOLUTION QUALITY GUIDELINES**:

1. **Be Comprehensive BUT Digestible**:
   - Give 2-4 steps per response (not just 1!)
   - Each step should be clear and actionable
   - Don't overwhelm with 7+ steps at once
   - Progressive: Start basic, then advanced

2. **Format for Clarity**:
   - Use numbered steps or bullets
   - Use **bold** for step titles
   - Keep each step clear and actionable
   - Include expected results
   - Add helpful tips with 💡
   - End with friendly prompt for feedback

3. **Use Smart Structure**:
   - Acknowledge their feedback from previous attempt
   - Provide next logical solutions
   - Build on conversation context
   - Be encouraging and supportive

4. **Escalation Keywords** (user explicitly requests ticket):
   - Direct requests: "generate ticket", "create ticket", "escalate this", "raise ticket", "open ticket", "send ticket", "need ticket", "make ticket"
   - Confirmations after you ask: "yes", "yeah", "sure", "okay", "please", "go ahead"
   - When user confirms, immediately acknowledge: "Perfect! I'm generating the support ticket for you now..."
   - The system will automatically create the ticket when they confirm

5. **Tone**:
   - Friendly and conversational
   - Patient and understanding
   - Professional but not robotic
   - Encouraging: "Let's try this...", "This should help..."

**CRITICAL RULES**:
- Give 2-4 solutions per response (not just 1!)
- Keep responses medium-sized: 150-250 words
- ALWAYS ask questions on first attempt
- Provide OPTIMIZED solutions once you understand the issue
- NEVER auto-generate tickets - ALWAYS ask first
- Be honest if you can't solve it
- Make each response valuable and helpful

Example Flow:
User: "My Vi network is not working"
You: "I'm sorry to hear that! Let's get this fixed. A few quick questions: Are you using mobile data or WiFi? Is this issue happening everywhere or just in certain locations? Are you seeing any error messages?"

User: "Mobile data, everywhere, no error"
You: "Got it, thanks! Let's try these steps to fix your Vi mobile data:

**Step 1: Toggle Airplane Mode**
- Turn on Airplane mode for 30 seconds, then turn it off
- This refreshes your connection to the network
- Expected result: You should see 4G/5G signal return

**Step 2: Reset Network Settings**
- Go to Settings > System > Reset > Reset Network Settings
- This clears any network configuration issues
- You'll need to re-enter WiFi passwords

**Step 3: Check APN Settings**
- Go to Settings > Mobile Network > Access Point Names
- Make sure APN is set to "portalnmms" for Vi
- If not, add it manually

💡 Pro tip: Restart your phone after making these changes.

Try these steps and let me know what happens!"

User: "Still not working"
You: "I understand this is frustrating. We've tried several solutions. Would you like me to generate a support ticket and escalate this to Vi's customer care team? They can check if there's a network outage or issue with your account."

User: "yes" or "yeah sure" or "okay"
You: "Perfect! I'm generating the support ticket for you now..."
[System automatically creates ticket and shows confirmation]

**REMEMBER**: Give helpful, medium-sized solutions that actually solve problems! And when user confirms ticket request, acknowledge it clearly!`;


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
