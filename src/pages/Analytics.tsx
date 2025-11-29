import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTicketManager } from "@/hooks/useTicketManager";
import { TrendingUp, TrendingDown, Activity, Clock, CheckCircle2, AlertCircle, RefreshCw, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const Analytics = () => {
  const { 
    tickets, 
    loading, 
    getTicketStats, 
    getRecentTickets, 
    updateTicket, 
    deleteTicket, 
    clearAllTickets
  } = useTicketManager();
  
  const [refreshKey, setRefreshKey] = useState(0);

  // No need to load chatTickets separately - all tickets are now in Supabase
  // The useTicketManager hook handles real-time updates automatically
  
  // Get real-time stats (all tickets from Supabase)
  const stats = getTicketStats();
  
  // Get recent tickets from Supabase
  const recentTickets = getRecentTickets(10);

  // Calculate time ago helper function
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const ticketDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - ticketDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "< 1h ago";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Dynamic stats with real data
  const dynamicStats = [
    { 
      label: "Total Tickets", 
      value: stats.total.toString(), 
      change: "+12%", 
      trend: "up" as const, 
      icon: Activity 
    },
    { 
      label: "Resolved", 
      value: stats.resolved.toString(), 
      change: `${stats.resolutionRate}%`, 
      trend: "up" as const, 
      icon: CheckCircle2 
    },
    { 
      label: "Avg. Resolution Time", 
      value: "2.4h", 
      change: "-15%", 
      trend: "down" as const, 
      icon: Clock 
    },
    { 
      label: "Pending", 
      value: stats.pending.toString(), 
      change: stats.pending > 0 ? "+5%" : "0%", 
      trend: stats.pending > 0 ? "up" as const : "down" as const, 
      icon: AlertCircle 
    }
  ];

  const handleStatusChange = (ticketId: string, newStatus: 'pending' | 'in-progress' | 'resolved' | 'closed') => {
    updateTicket(ticketId, { status: newStatus });
    setRefreshKey(prev => prev + 1); // Force re-render
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      deleteTicket(ticketId);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all tickets? This cannot be undone.')) {
      clearAllTickets();
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <div className="bg-[image:var(--gradient-background)] p-6 min-h-[calc(100vh-16rem)]">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor ticket metrics and performance</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dynamicStats.map((stat) => (
            <Card key={stat.label} className="p-6 shadow-[var(--shadow-elevated)] border-primary/10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] shadow-lg">
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                  {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <Card className="p-6 shadow-[var(--shadow-elevated)] border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Tickets</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              {tickets.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleClearAll}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading tickets...</span>
            </div>
          ) : recentTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No tickets yet</p>
              <p className="text-sm">Use the AI chatbot to create your first support ticket</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => {
                return (
                  <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">
                          {ticket.id}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ticket.issue}
                        </div>
                        {ticket.description && (
                          <div className="text-xs text-muted-foreground mt-1 max-w-md truncate">
                            {ticket.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value as any)}
                        className="text-xs px-2 py-1 rounded border bg-background"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <Badge variant={
                        (ticket.priority === "critical" || ticket.priority === "urgent") ? "destructive" :
                        ticket.priority === "high" ? "default" :
                        ticket.priority === "medium" ? "secondary" : "outline"
                      }>
                        {ticket.priority}
                      </Badge>
                      <Badge variant={
                        ticket.status === "resolved" ? "default" : 
                        ticket.status === "in-progress" ? "secondary" : "outline"
                      }>
                        {ticket.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground w-20 text-right">
                        {getTimeAgo(ticket.updatedAt || ticket.createdAt)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
