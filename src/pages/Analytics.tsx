import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const Analytics = () => {
  const stats = [
    { label: "Total Tickets", value: "1,234", change: "+12%", trend: "up", icon: Activity },
    { label: "Resolved", value: "1,089", change: "+8%", trend: "up", icon: CheckCircle2 },
    { label: "Avg. Resolution Time", value: "2.4h", change: "-15%", trend: "down", icon: Clock },
    { label: "Pending", value: "145", change: "+5%", trend: "up", icon: AlertCircle }
  ];

  const recentTickets = [
    { id: "TKT-1234", issue: "Login issues", priority: "high", status: "in-progress", time: "2h ago" },
    { id: "TKT-1233", issue: "Payment failed", priority: "critical", status: "resolved", time: "4h ago" },
    { id: "TKT-1232", issue: "Feature request", priority: "low", status: "pending", time: "6h ago" },
    { id: "TKT-1231", issue: "Account access", priority: "medium", status: "resolved", time: "8h ago" },
    { id: "TKT-1230", issue: "Data sync problem", priority: "high", status: "in-progress", time: "10h ago" }
  ];

  return (
    <div className="bg-[image:var(--gradient-background)] p-6 min-h-[calc(100vh-16rem)]">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor ticket metrics and performance</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
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
          <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium">{ticket.id}</div>
                    <div className="text-sm text-muted-foreground">{ticket.issue}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    ticket.priority === "critical" ? "destructive" :
                    ticket.priority === "high" ? "default" :
                    ticket.priority === "medium" ? "secondary" : "outline"
                  }>
                    {ticket.priority}
                  </Badge>
                  <Badge variant={ticket.status === "resolved" ? "default" : "secondary"}>
                    {ticket.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground w-20 text-right">{ticket.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
