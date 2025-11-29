import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, Mail, MailCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Ticket {
  id: string;
  ticketNumber: string;
  status: "pending" | "in-progress" | "resolved" | "closed";
  category: string;
  priority: "low" | "medium" | "high" | "urgent" | "critical";
  description: string;
  subject?: string; // Main issue/subject line
  createdAt: Date;
  assignedTo?: string;
  emailSent?: boolean; // Track if email was sent
  emailSentAt?: Date; // When email was sent
  companyEmail?: string; // Which company email it was sent to
}

interface TicketCardProps {
  ticket: Ticket;
  showResolveToggle?: boolean; // Show resolve checkbox in Generated Tickets
  onStatusChange?: () => void; // Callback when status changes
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600",
  },
  "in-progress": {
    label: "In Progress",
    icon: AlertCircle,
    color: "text-blue-600",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  closed: {
    label: "Closed",
    icon: CheckCircle2,
    color: "text-gray-600",
  },
};

const priorityVariants = {
  low: "secondary",
  medium: "outline",
  high: "default",
  urgent: "destructive",
  critical: "destructive",
} as const;

export function TicketCard({ ticket, showResolveToggle = false, onStatusChange }: TicketCardProps) {
  // Normalize status to ensure it matches our config
  const normalizedStatus = (ticket.status === "received" ? "pending" : ticket.status) as keyof typeof statusConfig;
  const statusInfo = statusConfig[normalizedStatus] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  const handleResolveToggle = async (checked: boolean) => {
    if (!supabase) {
      toast.error("Database not configured");
      return;
    }

    try {
      const newStatus = checked ? 'resolved' : 'pending';
      
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('ticket_number', ticket.ticketNumber);

      if (error) throw error;

      toast.success(`Ticket marked as ${newStatus}`);
      
      // Call callback to refresh tickets
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Failed to update ticket status');
    }
  };

  return (
    <Card className="p-4 shadow-[var(--shadow-elevated)] border-primary/10 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">Ticket #{ticket.ticketNumber}</h3>
            <Badge variant={priorityVariants[ticket.priority] || priorityVariants.medium} className="text-xs">
              {ticket.priority.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{ticket.category}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-1.5", statusInfo.color)}>
            <StatusIcon className="h-5 w-5" />
            <span className="text-sm font-medium">{statusInfo.label}</span>
          </div>
          
          {showResolveToggle && (
            <div className="flex items-center gap-2">
              <Checkbox 
                id={`resolve-${ticket.ticketNumber}`}
                checked={ticket.status === 'resolved'}
                onCheckedChange={handleResolveToggle}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <label 
                htmlFor={`resolve-${ticket.ticketNumber}`}
                className="text-xs cursor-pointer text-muted-foreground hover:text-foreground"
              >
                Mark Resolved
              </label>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm mb-3 text-foreground/80 line-clamp-2">
        {ticket.subject || ticket.description}
      </p>

      {/* Email Status */}
      {ticket.emailSent && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-green-500/10 border border-green-500/20 rounded-md">
          <MailCheck className="h-4 w-4 text-green-600" />
          <div className="flex-1">
            <p className="text-xs text-green-700 dark:text-green-400 font-medium">
              Email sent to {ticket.companyEmail}
            </p>
            {ticket.emailSentAt && (
              <p className="text-xs text-green-600/70">
                {new Date(ticket.emailSentAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
        <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
        {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
      </div>
    </Card>
  );
}
