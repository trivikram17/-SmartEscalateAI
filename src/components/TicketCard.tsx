import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Ticket {
  id: string;
  ticketNumber: string;
  status: "received" | "in-progress" | "resolved";
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  description: string;
  createdAt: Date;
  assignedTo?: string;
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

      <p className="text-sm mb-3 text-foreground/80">{ticket.description}</p>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
        <span>Created: {ticket.createdAt.toLocaleString()}</span>
        {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
      </div>
    </Card>
  );
}
