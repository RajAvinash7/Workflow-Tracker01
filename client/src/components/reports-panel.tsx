import { useState } from "react";
import { Task } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, TrendingUp, CheckCircle, Clock, BarChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportsPanelProps {
  tasks: Task[];
}

type ReportPeriod = "week" | "month" | "quarter";

export default function ReportsPanel({ tasks }: ReportsPanelProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("week");

  const generateReport = (period: ReportPeriod) => {
    const now = new Date();
    let startDate: Date;
    let periodName: string;

    switch (period) {
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        periodName = "This Week";
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        periodName = "This Month";
        break;
      case "quarter":
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        periodName = "This Quarter";
        break;
    }

    // Filter tasks for the period
    const periodTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= startDate && taskDate <= now;
    });

    const completedTasks = periodTasks.filter(task => task.completed);
    const highPriorityTasks = periodTasks.filter(task => task.priority === "High");
    const overdueTasks = periodTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < now && !task.completed;
    });

    // Calculate completion rate by priority
    const priorityStats = {
      High: {
        total: periodTasks.filter(t => t.priority === "High").length,
        completed: completedTasks.filter(t => t.priority === "High").length
      },
      Medium: {
        total: periodTasks.filter(t => t.priority === "Medium").length,
        completed: completedTasks.filter(t => t.priority === "Medium").length
      },
      Low: {
        total: periodTasks.filter(t => t.priority === "Low").length,
        completed: completedTasks.filter(t => t.priority === "Low").length
      }
    };

    return {
      periodName,
      totalTasks: periodTasks.length,
      completedTasks: completedTasks.length,
      completionRate: periodTasks.length > 0 ? Math.round((completedTasks.length / periodTasks.length) * 100) : 0,
      highPriorityTasks: highPriorityTasks.length,
      overdueTasks: overdueTasks.length,
      priorityStats,
      periodTasks
    };
  };

  const report = generateReport(selectedPeriod);

  const exportReport = () => {
    const reportData = {
      period: report.periodName,
      generated: new Date().toLocaleString(),
      summary: {
        totalTasks: report.totalTasks,
        completed: report.completedTasks,
        completionRate: `${report.completionRate}%`,
        overdue: report.overdueTasks
      },
      tasks: report.periodTasks.map(task => ({
        title: task.title,
        priority: task.priority,
        status: task.completed ? "Completed" : "Pending",
        dueDate: task.dueDate
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FileText className="text-primary mr-2 h-5 w-5" />
            Productivity Reports
          </span>
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Period Selector */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Report Period:</span>
          <Select value={selectedPeriod} onValueChange={(value: ReportPeriod) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Report Header */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            {report.periodName} Report
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{report.totalTasks}</p>
              </div>
              <BarChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Completion Rate</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">{report.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">High Priority</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{report.highPriorityTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Overdue</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-300">{report.overdueTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">Completion by Priority</h4>
          <div className="space-y-3">
            {Object.entries(report.priorityStats).map(([priority, stats]) => {
              const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      className={`${
                        priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                        priority === 'Medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}
                    >
                      {priority}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.completed}/{stats.total} completed
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Tasks Summary */}
        {report.totalTasks > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent Tasks</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {report.periodTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between text-sm">
                  <span className={`flex-1 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {task.title}
                  </span>
                  <Badge 
                    className={`ml-2 text-xs ${
                      task.completed ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}
                  >
                    {task.completed ? 'Done' : task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}