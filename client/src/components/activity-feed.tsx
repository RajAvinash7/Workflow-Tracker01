import { Task } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Plus, Edit, Trash2, Activity } from "lucide-react";

interface ActivityFeedProps {
  tasks: Task[];
}

interface ActivityItem {
  id: string;
  type: 'completed' | 'created' | 'updated' | 'deleted';
  task: Task;
  timestamp: Date;
  description: string;
}

export default function ActivityFeed({ tasks }: ActivityFeedProps) {
  // Generate activity items based on task data
  const generateActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    tasks.forEach(task => {
      // Add creation activity
      activities.push({
        id: `created-${task.id}`,
        type: 'created',
        task,
        timestamp: new Date(task.createdAt),
        description: `Created task "${task.title}"`
      });

      // Add completion activity if completed
      if (task.completed) {
        activities.push({
          id: `completed-${task.id}`,
          type: 'completed',
          task,
          timestamp: new Date(new Date(task.createdAt).getTime() + Math.random() * 86400000), // Random time after creation
          description: `Completed task "${task.title}"`
        });
      }
    });

    // Sort by timestamp (newest first)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
  };

  const activities = generateActivities();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'created':
        return <Plus className="h-4 w-4 text-blue-600" />;
      case 'updated':
        return <Edit className="h-4 w-4 text-orange-600" />;
      case 'deleted':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'completed':
        return 'bg-green-100';
      case 'created':
        return 'bg-blue-100';
      case 'updated':
        return 'bg-orange-100';
      case 'deleted':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="text-primary mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      className={`text-xs ${
                        activity.task.priority === 'High' ? 'bg-red-100 text-red-700' :
                        activity.task.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {activity.task.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}