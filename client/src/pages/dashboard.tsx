import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Task } from "@shared/schema";
import ProfileCard from "@/components/profile-card";
import TaskList from "@/components/task-list";
import StatisticsPanel from "@/components/statistics-panel";
import TaskCalendar from "@/components/task-calendar";
import ActivityFeed from "@/components/activity-feed";
import ProductivityChart from "@/components/productivity-chart";
import TaskSearch from "@/components/task-search";
import ReportsPanel from "@/components/reports-panel";
import GoalSetting from "@/components/goal-setting";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, ChartLine, ChevronDown, Calendar, Activity, Search, BarChart3, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  thisWeekTasks: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<TaskStats>({
    queryKey: ["/api/stats"],
  });

  if (userLoading || tasksLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load user data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const firstName = user.name.split(' ')[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary dark:text-white flex items-center">
                <ChartLine className="mr-1 sm:mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden xs:inline">Dashboard</span>
                <span className="xs:hidden">DB</span>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 h-8 w-8 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <div className="flex items-center space-x-1 sm:space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-1 sm:p-2 transition-colors">
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                  <AvatarImage src={user.profileImage} alt="Profile picture" />
                  <AvatarFallback className="text-xs sm:text-sm">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">{user.name}</span>
                <ChevronDown className="h-3 w-3 text-gray-500 dark:text-gray-400 hidden sm:block" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Here's what's happening with your tasks today.</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:mb-6 lg:mb-8">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto p-1">
            <TabsTrigger value="overview" className="flex items-center justify-center px-1 sm:px-3 py-2 text-xs sm:text-sm">
              <ChartLine className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center justify-center px-1 sm:px-3 py-2 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center justify-center px-1 sm:px-3 py-2 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center justify-center px-1 sm:px-3 py-2 text-xs sm:text-sm">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center justify-center px-1 sm:px-3 py-2 text-xs sm:text-sm">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center justify-center px-1 sm:px-3 py-2 text-xs sm:text-sm">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - Profile & Tasks */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <ProfileCard user={user} />
                <TaskList tasks={tasks} />
              </div>

              {/* Right Column - Statistics */}
              <div className="space-y-4 sm:space-y-6">
                <StatisticsPanel stats={stats} />
                <ActivityFeed tasks={tasks} />
              </div>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                <TaskCalendar tasks={tasks} />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <StatisticsPanel stats={stats} />
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <ProductivityChart tasks={tasks} />
              <StatisticsPanel stats={stats} />
            </div>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                <TaskSearch tasks={tasks} />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <StatisticsPanel stats={stats} />
              </div>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <ReportsPanel tasks={tasks} />
              <div className="space-y-4 sm:space-y-6">
                <StatisticsPanel stats={stats} />
                <ProductivityChart tasks={tasks} />
              </div>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                <GoalSetting tasks={tasks} />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <StatisticsPanel stats={stats} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
