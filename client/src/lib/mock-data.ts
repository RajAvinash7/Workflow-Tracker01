import { User, Task } from "@shared/schema";

export const mockUser: User = {
  id: 1,
  username: "johndoe",
  password: "password123",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Product Manager",
  department: "Engineering",
  location: "San Francisco, CA",
  profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  joinDate: "Jan 2024"
};

export const mockTasks: Task[] = [
  {
    id: 1,
    userId: 1,
    title: "Complete project wireframes",
    description: "Finalize the wireframes for the new dashboard interface",
    completed: false,
    priority: "High",
    dueDate: "Dec 28, 2024",
    createdAt: new Date("2024-12-20")
  },
  {
    id: 2,
    userId: 1,
    title: "Review team performance reports",
    description: "Analyze Q4 performance metrics and prepare feedback",
    completed: true,
    priority: "Medium",
    dueDate: "Dec 25, 2024",
    createdAt: new Date("2024-12-15")
  },
  {
    id: 3,
    userId: 1,
    title: "Prepare client presentation",
    description: "Create slides for upcoming client meeting on project progress",
    completed: false,
    priority: "Medium",
    dueDate: "Dec 30, 2024",
    createdAt: new Date("2024-12-22")
  },
  {
    id: 4,
    userId: 1,
    title: "Update user documentation",
    description: "Revise API documentation based on recent updates",
    completed: false,
    priority: "Low",
    dueDate: "Jan 5, 2025",
    createdAt: new Date("2024-12-18")
  }
];

export const mockStats = {
  totalTasks: 24,
  completedTasks: 16,
  pendingTasks: 8,
  thisWeekTasks: 12
};
