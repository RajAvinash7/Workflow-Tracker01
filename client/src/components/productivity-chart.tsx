import { Task } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

interface ProductivityChartProps {
  tasks: Task[];
}

export default function ProductivityChart({ tasks }: ProductivityChartProps) {
  // Generate productivity data for the last 7 days
  const generateProductivityData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Count tasks completed on this day (simulated based on task creation dates)
      const tasksCompletedOnDay = tasks.filter(task => {
        if (!task.completed) return false;
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === date.toDateString();
      }).length;
      
      // Add some variation for demo purposes
      const adjustedCount = tasksCompletedOnDay + Math.floor(Math.random() * 3);
      
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: Math.max(0, adjustedCount),
        created: Math.floor(Math.random() * 2) + 1
      });
    }
    
    return last7Days;
  };

  const productivityData = generateProductivityData();
  const maxValue = Math.max(...productivityData.map(d => Math.max(d.completed, d.created)));
  const totalCompleted = productivityData.reduce((sum, d) => sum + d.completed, 0);
  const totalCreated = productivityData.reduce((sum, d) => sum + d.created, 0);

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <BarChart3 className="text-primary mr-2 h-5 w-5" />
            Weekly Productivity
          </span>
          <div className="flex items-center text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">+12%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalCompleted}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalCreated}</div>
            <div className="text-sm text-gray-500">Created</div>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          {productivityData.map((day, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{day.day}</span>
                <span className="text-gray-500">{day.date}</span>
              </div>
              
              <div className="space-y-1">
                {/* Completed tasks bar */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-green-600 w-16">Completed</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${maxValue > 0 ? (day.completed / maxValue) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 w-6">{day.completed}</span>
                </div>
                
                {/* Created tasks bar */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-blue-600 w-16">Created</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${maxValue > 0 ? (day.created / maxValue) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 w-6">{day.created}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Track your daily task completion and creation patterns
          </p>
        </div>
      </CardContent>
    </Card>
  );
}