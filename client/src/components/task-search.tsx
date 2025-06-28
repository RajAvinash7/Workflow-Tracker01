import { useState } from "react";
import { Task } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskSearchProps {
  tasks: Task[];
  onTaskSelect?: (task: Task) => void;
}

export default function TaskSearch({ tasks, onTaskSelect }: TaskSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "completed" && task.completed) ||
                         (statusFilter === "pending" && !task.completed);

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchQuery || priorityFilter !== "all" || statusFilter !== "all";

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found</span>
          </div>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No tasks match your search criteria</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                  onClick={() => onTaskSelect?.(task)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`text-xs ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700' :
                          task.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {task.priority}
                      </Badge>
                      {task.completed && (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}