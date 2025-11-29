// Ticket Management Hook
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Ticket {
  id: string;
  issue: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  userEmail: string;
  userName: string;
}

export const useTicketManager = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tickets from Supabase on mount with real-time subscription
  useEffect(() => {
    // Clear old localStorage tickets ONCE per session
    const hasCleared = sessionStorage.getItem('ticketsCleared');
    if (!hasCleared) {
      localStorage.removeItem('tickets');
      localStorage.removeItem('chatTickets');
      sessionStorage.setItem('ticketsCleared', 'true');
      console.log('✅ useTicketManager: One-time clear of old localStorage tickets');
    }
    
    loadTickets();

    // Subscribe to real-time ticket changes
    if (!supabase) return;
    
    const channel = supabase
      .channel('tickets-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'tickets' 
        },
        () => {
          // Reload tickets when any change occurs
          loadTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadTickets = async () => {
    if (!supabase) {
      console.warn('Supabase not configured, no tickets to load');
      // Don't load from localStorage - force empty state
      setTickets([]);
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Map Supabase tickets to local Ticket format
        const mappedTickets: Ticket[] = data.map((dbTicket: any) => ({
          id: dbTicket.ticket_number, // Use ticket_number as ID for compatibility
          issue: dbTicket.subject || dbTicket.category || 'No subject',
          description: dbTicket.description,
          priority: dbTicket.priority,
          status: dbTicket.status,
          createdAt: dbTicket.created_at,
          updatedAt: dbTicket.updated_at,
          userEmail: dbTicket.user_email,
          userName: dbTicket.user_name,
          assignedTo: undefined, // Not in schema yet
        }));
        
        setTickets(mappedTickets);
      }
    } catch (error) {
      console.error('Error loading tickets from Supabase:', error);
      toast.error('Could not load tickets from cloud');
      
      // Fallback to localStorage
      try {
        const savedTickets = localStorage.getItem('tickets');
        if (savedTickets) {
          const parsedTickets = JSON.parse(savedTickets);
          setTickets(parsedTickets);
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveTickets = async (newTickets: Ticket[]) => {
    // Note: This is primarily for local state updates
    // Individual operations use Supabase directly
    setTickets(newTickets);
  };

  const generateTicketId = () => {
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TKT-${timestamp}${random}`;
  };

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const ticketNumber = generateTicketId();
    
    if (!supabase) {
      console.warn('Supabase not configured, using localStorage');
      const newTicket: Ticket = {
        ...ticketData,
        id: ticketNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedTickets = [newTicket, ...tickets];
      setTickets(updatedTickets);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));
      return newTicket;
    }
    
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          ticket_number: ticketNumber,
          status: ticketData.status,
          category: ticketData.issue,
          priority: ticketData.priority,
          description: ticketData.description || '',
          subject: ticketData.issue,
          user_email: ticketData.userEmail,
          user_name: ticketData.userName,
          email_sent: false,
        }])
        .select()
        .single();

      if (error) throw error;

      const newTicket: Ticket = {
        id: ticketNumber,
        ...ticketData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Real-time subscription will handle state update
      toast.success('Ticket created successfully');
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Could not create ticket in cloud');
      
      // Fallback to local
      const newTicket: Ticket = {
        ...ticketData,
        id: ticketNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedTickets = [newTicket, ...tickets];
      saveTickets(updatedTickets);
      return newTicket;
    }
  };

  const updateTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    if (!supabase) {
      console.warn('Supabase not configured, using localStorage');
      const updatedTickets = tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      );
      setTickets(updatedTickets);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));
      return;
    }
    
    try {
      // Map local Ticket fields to Supabase schema
      const dbUpdates: any = {
        updated_at: new Date().toISOString(),
      };
      
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.priority) dbUpdates.priority = updates.priority;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.issue) {
        dbUpdates.category = updates.issue;
        dbUpdates.subject = updates.issue;
      }

      const { error } = await supabase
        .from('tickets')
        .update(dbUpdates)
        .eq('ticket_number', ticketId);

      if (error) throw error;

      toast.success('Ticket updated successfully');
      // Real-time subscription will handle state update
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Could not update ticket in cloud');
      
      // Fallback to local update
      const updatedTickets = tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      );
      saveTickets(updatedTickets);
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!supabase) {
      console.warn('Supabase not configured, using localStorage');
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      setTickets(updatedTickets);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('ticket_number', ticketId);

      if (error) throw error;

      toast.success('Ticket deleted successfully');
      // Real-time subscription will handle state update
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Could not delete ticket from cloud');
      
      // Fallback to local delete
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      saveTickets(updatedTickets);
    }
  };

  const getTicketsByStatus = (status: Ticket['status']) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const getTicketsByPriority = (priority: Ticket['priority']) => {
    return tickets.filter(ticket => ticket.priority === priority);
  };

  const getRecentTickets = (limit: number = 5) => {
    return [...tickets]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  };

  const getTicketStats = () => {
    const total = tickets.length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const pending = tickets.filter(t => t.status === 'pending').length;
    const inProgress = tickets.filter(t => t.status === 'in-progress').length;
    const critical = tickets.filter(t => t.priority === 'critical').length;
    
    return {
      total,
      resolved,
      pending,
      inProgress,
      critical,
      resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : '0',
    };
  };

  const clearAllTickets = async () => {
    if (!supabase) {
      console.warn('Supabase not configured, using localStorage');
      localStorage.removeItem('tickets');
      setTickets([]);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .neq('id', 0); // Delete all records

      if (error) throw error;

      setTickets([]);
      toast.success('All tickets cleared from cloud');
    } catch (error) {
      console.error('Error clearing tickets:', error);
      toast.error('Could not clear tickets from cloud');
      
      // Fallback to local clear
      localStorage.removeItem('tickets');
      setTickets([]);
    }
  };

  const initializeSampleTickets = async () => {
    if (!supabase) {
      console.warn('Supabase not configured, cannot initialize sample tickets');
      toast.error('Database not configured');
      return;
    }
    
    const sampleTickets = [
      {
        ticket_number: 'TKT-1234',
        status: 'in-progress' as const,
        category: 'Login issues',
        priority: 'high' as const,
        description: 'User unable to login with correct credentials',
        subject: 'Login issues',
        user_email: 'user@example.com',
        user_name: 'John Doe',
        email_sent: false,
      },
      {
        ticket_number: 'TKT-1233',
        status: 'resolved' as const,
        category: 'Payment failed',
        priority: 'critical' as const,
        description: 'Credit card payment processing error',
        subject: 'Payment failed',
        user_email: 'jane@example.com',
        user_name: 'Jane Smith',
        email_sent: true,
      },
      {
        ticket_number: 'TKT-1232',
        status: 'pending' as const,
        category: 'Feature request',
        priority: 'low' as const,
        description: 'Request for dark mode toggle',
        subject: 'Feature request',
        user_email: 'feature@example.com',
        user_name: 'Feature User',
        email_sent: false,
      },
      {
        ticket_number: 'TKT-1231',
        status: 'resolved' as const,
        category: 'Account access',
        priority: 'medium' as const,
        description: 'Cannot access premium features',
        subject: 'Account access',
        user_email: 'premium@example.com',
        user_name: 'Premium User',
        email_sent: false,
      },
      {
        ticket_number: 'TKT-1230',
        status: 'in-progress' as const,
        category: 'Data sync problem',
        priority: 'high' as const,
        description: 'Data not syncing across devices',
        subject: 'Data sync problem',
        user_email: 'sync@example.com',
        user_name: 'Sync User',
        email_sent: false,
      }
    ];

    try {
      const { error } = await supabase
        .from('tickets')
        .insert(sampleTickets);

      if (error) throw error;

      toast.success('Sample tickets initialized');
      loadTickets();
    } catch (error) {
      console.error('Error initializing sample tickets:', error);
      toast.error('Could not initialize sample tickets in cloud');
    }
  };

  return {
    tickets,
    loading,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketsByStatus,
    getTicketsByPriority,
    getRecentTickets,
    getTicketStats,
    clearAllTickets,
    initializeSampleTickets,
    loadTickets,
  };
};