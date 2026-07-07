import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function SubscriptionPanel() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      const response = await apiRequest("POST", "/api/subscription/manage");
      const data = await response.json();
      
      toast({
        title: "Redirecting...",
        description: data.message,
      });
      
      // In a real implementation, this would redirect to Stripe billing portal
      setTimeout(() => {
        window.open(data.url, '_blank');
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open billing portal",
        variant: "destructive",
      });
    }
  };

  const subscriptionTier = user?.subscriptionTier || 'free';
  const tierName = subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Subscription</CardTitle>
          <Badge variant={subscriptionTier === 'free' ? 'secondary' : 'default'}>
            {tierName} Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Profiles</span>
            <span className="font-medium">
              {subscriptionTier === 'free' ? '0 / 1' : 
               subscriptionTier === 'pro' ? '8 / 10' : '8 / 50'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Storage</span>
            <span className="font-medium">
              {subscriptionTier === 'free' ? '0 GB / 1 GB' : '2.4 GB / 5 GB'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Next billing</span>
            <span className="font-medium">
              {subscriptionTier === 'free' ? 'N/A' : 'Aug 15, 2025'}
            </span>
          </div>
        </div>
        <Button 
          className="w-full btn-primary"
          onClick={handleManageSubscription}
        >
          {subscriptionTier === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
        </Button>
      </CardContent>
    </Card>
  );
}
