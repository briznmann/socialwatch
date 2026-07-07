import { Card, CardContent } from "@/components/ui/card";
import { Users, Camera, HardDrive, Bell, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  activeProfiles: number;
  screenshotsToday: number;
  totalScreenshots: number;
  storageUsed: string;
  alerts: number;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Active Profiles",
      value: stats.activeProfiles,
      icon: Users,
      change: "+12%",
      changeText: "from last month",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Screenshots Today",
      value: stats.screenshotsToday,
      icon: Camera,
      change: "+8%",
      changeText: "from yesterday",
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    {
      title: "Storage Used",
      value: stats.storageUsed,
      icon: HardDrive,
      change: null,
      changeText: "48% of 5 GB used",
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      title: "Alerts",
      value: stats.alerts,
      icon: Bell,
      change: null,
      changeText: stats.alerts > 0 ? `${stats.alerts} requiring attention` : "All good",
      bgColor: "bg-warning/10",
      iconColor: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`${card.iconColor} w-6 h-6`} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              {card.change && (
                <>
                  <TrendingUp className="text-accent w-4 h-4 mr-1" />
                  <span className="text-accent font-medium">{card.change}</span>
                  <span className="text-slate-600 ml-1">from last month</span>
                </>
              )}
              {!card.change && (
                <span className="text-slate-600">{card.changeText}</span>
              )}
              {card.title === "Storage Used" && (
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "48%" }}></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
