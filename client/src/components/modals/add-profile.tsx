import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertProfileSchema } from "@shared/schema";
import { z } from "zod";

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const platforms = [
  { value: "twitter", label: "Twitter/X" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
];

export default function AddProfileModal({ isOpen, onClose }: AddProfileModalProps) {
  const [formData, setFormData] = useState({
    platform: "",
    handle: "",
    displayName: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const profileData = {
        platform: data.platform,
        handle: data.handle.replace("@", ""), // Remove @ if present
        displayName: data.displayName || data.handle,
        isActive: true,
        needsReconnect: false,
        totalScreenshots: 0,
      };

      await apiRequest("POST", "/api/profiles", profileData);
    },
    onSuccess: () => {
      toast({
        title: "Profile Added",
        description: "The profile has been added successfully and monitoring will begin shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      onClose();
      setFormData({ platform: "", handle: "", displayName: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.platform || !formData.handle) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Profile to Monitor</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="platform">Platform *</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) => setFormData({ ...formData, platform: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="handle">Handle/Username *</Label>
            <Input
              id="handle"
              type="text"
              placeholder="@username"
              value={formData.handle}
              onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="displayName">Display Name (Optional)</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Friendly name for this profile"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Adding..." : "Add Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
