import React from "react";
import { Ticket } from "../hooks/useChatBot";

interface TicketAnalyticsProps {
  tickets: Ticket[];
}

// Helper to group tickets by property
function groupBy<T>(arr: T[], key: keyof T) {
  return arr.reduce((acc, item) => {
    const k = item[key] as string;
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// Helper to get tickets created in last N days
function getRecentTickets(tickets: Ticket[], days: number) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return tickets.filter(t => t.createdAt > cutoff);
}

export const TicketAnalytics: React.FC<TicketAnalyticsProps> = ({ tickets }) => {
  const total = tickets.length;
  const byPriority = groupBy(tickets, "priority");
  const byCategory = groupBy(tickets, "category");
  const recent = getRecentTickets(tickets, 7);

  return (
    <div className="p-6 rounded-xl bg-card shadow-xl space-y-6">
      <h2 className="text-2xl font-bold mb-2">Ticket Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold">{total}</div>
          <div className="text-sm text-muted-foreground">Total Tickets</div>
        </div>
        {Object.entries(byPriority).map(([priority, count]) => (
          <div key={priority} className="bg-gradient-to-br from-purple-100 to-purple-300 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-xs text-muted-foreground">{priority.charAt(0).toUpperCase() + priority.slice(1)} Priority</div>
          </div>
        ))}
        {Object.entries(byCategory).map(([category, count]) => (
          <div key={category} className="bg-gradient-to-br from-green-100 to-green-300 rounded-lg p-4 text-center">
            <div className="text-xl font-bold">{count}</div>
            <div className="text-xs text-muted-foreground">{category}</div>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Ticket Activity (7 days)</h3>
        <ul className="space-y-2">
          {recent.length === 0 ? (
            <li className="text-muted-foreground">No tickets created in the last 7 days.</li>
          ) : (
            recent.map(ticket => (
              <li key={ticket.id} className="border-b pb-2">
                <span className="font-bold">{ticket.ticketNumber}</span> - {ticket.category} - <span className="capitalize">{ticket.priority}</span> - {ticket.status}
                <span className="ml-2 text-xs text-muted-foreground">{ticket.createdAt.toLocaleString()}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
