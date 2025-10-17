import { Button } from "@/components/ui/button";
import { Wifi, Monitor, Smartphone, HelpCircle } from "lucide-react";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const quickActions = [
  { icon: Wifi, label: "Network Issue", value: "network" },
  { icon: Monitor, label: "Software Problem", value: "software" },
  { icon: Smartphone, label: "Device Issue", value: "device" },
  { icon: HelpCircle, label: "Other", value: "other" },
];

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.value}
            variant="outline"
            onClick={() => onActionClick(action.value)}
            className="h-auto py-3 flex flex-col gap-2 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
