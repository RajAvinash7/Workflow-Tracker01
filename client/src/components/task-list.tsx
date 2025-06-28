import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ListTodo, Plus, Calendar, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AddTaskModal from "./add-task-modal";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: number; completed: boolean }) => {
      await apiRequest("PATCH", `/api/tasks/${taskId}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleToggleComplete = (taskId: number, completed: boolean) => {
    toggleTaskMutation.mutate({ taskId, completed: !completed });
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  return (
    <>
      <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <ListTodo className="text-primary dark:text-blue-400 mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
              My Tasks
            </h2>
            <Button onClick={() => setShowAddModal(true)} size="sm" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Add Task</span>
              <span className="xs:hidden">Add</span>
            </Button>
          </div>

          {/* Task Filter Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setFilter('all')}
            >
              All Tasks
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ListTodo className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No tasks found</p>
                {filter !== 'all' && (
                  <Button variant="link" onClick={() => setFilter('all')}>
                    View all tasks
                  </Button>
                )}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleComplete(task.id, task.completed)}
                    className="mr-4"
                    disabled={toggleTaskMutation.isPending}
                  />
                  <div className="flex-1">
                    <h4 className={`text-gray-900 dark:text-gray-100 font-medium mb-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
                      {task.title}
                    </h4>
                    <p className={`text-gray-600 dark:text-gray-400 text-sm mb-2 ${task.completed ? 'opacity-60' : ''}`}>
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {task.completed ? `Completed: ${task.dueDate}` : `Due: ${task.dueDate}`}
                      </span>
                      <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                        {task.completed ? 'Completed' : task.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deleteTaskMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddTaskModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </>
  );
}
