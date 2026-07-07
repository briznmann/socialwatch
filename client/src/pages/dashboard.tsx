import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Plus } from "lucide-react";
import Sidebar from "@/components/navigation/sidebar";
import StatsCards from "@/components/dashboard/stats-cards";
import MonitoredProfiles from "@/components/dashboard/monitored-profiles";
import SubscriptionPanel from "@/components/dashboard/subscription-panel";
import RecentScreenshots from "@/components/dashboard/recent-screenshots";
import AddProfileModal from "@/components/modals/add-profile";

export default function Dashboard() {
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
              <p className="text-slate-600">Monitor your social media profiles</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search profiles, posts..."
                  className="pl-10 pr-4 py-2 w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative text-slate-600 hover:text-slate-900"
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center p-0">
                  3
                </Badge>
              </Button>
              
              {/* Add Profile */}
              <Button
                onClick={() => setIsAddProfileOpen(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Profile
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monitored Profiles */}
            <div className="lg:col-span-2">
              <MonitoredProfiles />
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              <SubscriptionPanel />
              <RecentScreenshots />
              
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => setIsAddProfileOpen(true)}
                  >
                    <div className="flex items-center space-x-3">
                      <Plus className="w-4 h-4 text-primary" />
                      <span className="font-medium">Add Profile</span>
                    </div>
                    <span className="text-slate-400">→</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 text-primary">📥</span>
                      <span className="font-medium">Export Data</span>
                    </div>
                    <span className="text-slate-400">→</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 text-primary">⚙️</span>
                      <span className="font-medium">Settings</span>
                    </div>
                    <span className="text-slate-400">→</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddProfileModal
        isOpen={isAddProfileOpen}
        onClose={() => setIsAddProfileOpen(false)}
      />
    </div>
  );
}
