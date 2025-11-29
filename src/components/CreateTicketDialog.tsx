import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTicketManager, Ticket } from "@/hooks/useTicketManager";
import { useToast } from "@/hooks/use-toast";
import { Ticket as TicketIcon } from "lucide-react";

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preFilledIssue?: string;
  preFilledDescription?: string;
}

export const CreateTicketDialog = ({ 
  open, 
  onOpenChange, 
  preFilledIssue = "", 
  preFilledDescription = "" 
}: CreateTicketDialogProps) => {
  const { createTicket } = useTicketManager();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    issue: preFilledIssue,
    description: preFilledDescription,
    priority: "medium" as Ticket['priority'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get user info from localStorage
    const userEmail = localStorage.getItem("userEmail") || "guest@smartescalate.ai";
    const userName = localStorage.getItem("userName") || "Guest User";

    try {
      const newTicket = await createTicket({
        issue: formData.issue,
        description: formData.description,
        priority: formData.priority,
        status: "pending",
        userEmail,
        userName,
      });

      toast({
        title: "Ticket Created Successfully",
        description: `Ticket ${newTicket.id} has been created and assigned to our support team.`,
      });

      // Reset form
      setFormData({
        issue: "",
        description: "",
        priority: "medium",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error Creating Ticket",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update form when pre-filled data changes
  React.useEffect(() => {
    if (preFilledIssue || preFilledDescription) {
      setFormData(prev => ({
        ...prev,
        issue: preFilledIssue || prev.issue,
        description: preFilledDescription || prev.description,
      }));
    }
  }, [preFilledIssue, preFilledDescription]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TicketIcon className="h-5 w-5" />
            Create Support Ticket
          </DialogTitle>
          <DialogDescription>
            Describe your issue and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issue">Issue Summary *</Label>
            <Input
              id="issue"
              placeholder="Brief description of your issue"
              value={formData.issue}
              onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Provide more details about your issue, steps to reproduce, error messages, etc."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value: Ticket['priority']) => 
                setFormData(prev => ({ ...prev, priority: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - General inquiry</SelectItem>
                <SelectItem value="medium">Medium - Standard issue</SelectItem>
                <SelectItem value="high">High - Blocking workflow</SelectItem>
                <SelectItem value="critical">Critical - System down</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.issue.trim()}>
              {isLoading ? "Creating..." : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};