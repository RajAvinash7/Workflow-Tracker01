import { useState, useEffect } from "react";
import { Task } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Edit, Save, X, TrendingUp, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GoalSettingProps {
  tasks: Task[];
}

interface Goal {
  id: string;
  type: "daily" | "weekly" | "monthly";
  target: number;
  description: string;
  period: string;
}

export default function GoalSetting({ tasks }: GoalSettingProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: "daily" as Goal["type"],
    target: 3,
    description: "Complete tasks"
  });

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem("taskGoals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Set default goals
      const defaultGoals: Goal[] = [
        {
          id: "daily-1",
          type: "daily",
          target: 3,
          description: "Complete tasks",
          period: new Date().toDateString()
        },
        {
          id: "weekly-1",
          type: "weekly",
          target: 15,
          description: "Complete tasks",
          period: getWeekPeriod()
        }
      ];
      setGoals(defaultGoals);
      localStorage.setItem("taskGoals", JSON.stringify(defaultGoals));
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("taskGoals", JSON.stringify(goals));
    }
  }, [goals]);

  function getWeekPeriod() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`;
  }

  function getMonthPeriod() {
    const now = new Date();
    return `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
  }

  const calculateProgress = (goal: Goal) => {
    const now = new Date();
    let completedTasks = 0;

    switch (goal.type) {
      case "daily":
        completedTasks = tasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return task.completed && taskDate.toDateString() === now.toDateString();
        }).length;
        break;
      case "weekly":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        completedTasks = tasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return task.completed && taskDate >= startOfWeek && taskDate <= now;
        }).length;
        break;
      case "monthly":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        completedTasks = tasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return task.completed && taskDate >= startOfMonth && taskDate <= now;
        }).length;
        break;
    }

    return {
      completed: completedTasks,
      percentage: goal.target > 0 ? Math.min((completedTasks / goal.target) * 100, 100) : 0,
      isAchieved: completedTasks >= goal.target
    };
  };

  const addGoal = () => {
    const period = newGoal.type === "daily" ? new Date().toDateString() :
                  newGoal.type === "weekly" ? getWeekPeriod() :
                  getMonthPeriod();

    const goal: Goal = {
      id: `${newGoal.type}-${Date.now()}`,
      ...newGoal,
      period
    };

    setGoals([...goals, goal]);
    setNewGoal({ type: "daily", target: 3, description: "Complete tasks" });
    setIsEditing(false);
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Target className="text-primary mr-2 h-5 w-5" />
            Goal Setting
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Goal */}
        {isEditing && (
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Add New Goal</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Period
                  </label>
                  <Select 
                    value={newGoal.type} 
                    onValueChange={(value: Goal["type"]) => setNewGoal({...newGoal, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target
                  </label>
                  <Input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 0})}
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Input
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Complete tasks"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={addGoal}>
                  <Save className="h-3 w-3 mr-1" />
                  Add Goal
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Current Goals */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Target className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No goals set yet</p>
              <Button variant="link" onClick={() => setIsEditing(true)}>
                Set your first goal
              </Button>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = calculateProgress(goal);
              return (
                <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`${
                          goal.type === 'daily' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                          goal.type === 'weekly' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                          'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                        }`}
                      >
                        {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {goal.description}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {progress.isAchieved && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          Achieved!
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progress: {progress.completed} / {goal.target}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {Math.round(progress.percentage)}%
                      </span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                  </div>

                  <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {goal.period}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Goal Insights */}
        {goals.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              Insights
            </h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {(() => {
                const achievedGoals = goals.filter(g => calculateProgress(g).isAchieved).length;
                const totalGoals = goals.length;
                const achievementRate = totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0;

                return (
                  <>
                    <p>• {achievedGoals} of {totalGoals} goals achieved ({achievementRate}%)</p>
                    {achievementRate >= 80 && <p>• Great job! You're consistently meeting your goals 🎯</p>}
                    {achievementRate < 50 && <p>• Consider adjusting your targets to be more achievable</p>}
                    <p>• Completed {tasks.filter(t => t.completed).length} tasks total</p>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}