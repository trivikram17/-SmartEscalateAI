import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, Mail, MailCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Ticket {
  id: string;
  ticketNumber: string;
  status: "received" | "in-progress" | "resolved";
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
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
}

const statusConfig = {
  received: {
    label: "Received",
    icon: Clock,
    color: "text-muted-foreground",
  },
  "in-progress": {
    label: "In Progress",
    icon: AlertCircle,
    color: "text-warning",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    color: "text-success",
  },
};

const priorityVariants = {
  low: "secondary",
  medium: "outline",
  high: "default",
  urgent: "destructive",
} as const;

export function TicketCard({ ticket }: TicketCardProps) {
  const StatusIcon = statusConfig[ticket.status].icon;

  return (
    <Card className="p-4 shadow-[var(--shadow-elevated)] border-primary/10 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">Ticket #{ticket.ticketNumber}</h3>
            <Badge variant={priorityVariants[ticket.priority]} className="text-xs">
              {ticket.priority.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{ticket.category}</p>
        </div>
        
        <div className={cn("flex items-center gap-1.5", statusConfig[ticket.status].color)}>
          <StatusIcon className="h-5 w-5" />
          <span className="text-sm font-medium">{statusConfig[ticket.status].label}</span>
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
                {ticket.emailSentAt.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
        <span>Created: {ticket.createdAt.toLocaleString()}</span>
        {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
      </div>
    </Card>
  );
}
