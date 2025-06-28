import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, ListIcon, CheckCircle, Clock, CalendarDays, Zap, TrendingUp, Download, FileText } from "lucide-react";

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  thisWeekTasks: number;
}

interface StatisticsPanelProps {
  stats?: TaskStats;
}

export default function StatisticsPanel({ stats }: StatisticsPanelProps) {
  if (!stats) {
    return (
      <div className="space-y-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Statistics Section */}
      <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center">
            <BarChart className="text-primary mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden sm:inline">Statistics</span>
            <span className="sm:hidden">Stats</span>
          </h2>
          
          {/* Stats Cards */}
          <div className="space-y-4">
            {/* Total Tasks */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 sm:p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Tasks</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalTasks}</p>
                </div>
                <ListIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 sm:p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs sm:text-sm font-medium">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.completedTasks}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-200" />
              </div>
              <div className="mt-2">
                <div className="bg-green-400 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-green-100 text-xs mt-1">{completionPercentage}% completion rate</p>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 sm:p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-xs sm:text-sm font-medium">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.pendingTasks}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
              </div>
            </div>

            {/* This Week */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 sm:p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs sm:text-sm font-medium">This Week</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.thisWeekTasks}</p>
                </div>
                <CalendarDays className="h-6 w-6 sm:h-8 sm:w-8 text-purple-200" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="text-primary mr-2 h-5 w-5" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="text-primary mr-3 h-4 w-4" />
              <span className="font-medium">View Reports</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="text-primary mr-3 h-4 w-4" />
              <span className="font-medium">Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="text-primary mr-2 h-5 w-5" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="text-green-600 h-3 w-3" />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">Task completed</p>
                <p className="text-xs text-gray-500">Review team performance reports</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <ListIcon className="text-blue-600 h-3 w-3" />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">New task created</p>
                <p className="text-xs text-gray-500">Prepare client presentation</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <FileText className="text-purple-600 h-3 w-3" />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">Profile updated</p>
                <p className="text-xs text-gray-500">Changed department to Engineering</p>
                <p className="text-xs text-gray-400">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
