import { users, tasks, type User, type InsertUser, type Task, type InsertTask, type UpdateUser, type UpdateTask } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UpdateUser): Promise<User | undefined>;
  
  // Task operations
  getTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Statistics
  getTaskStats(userId: number): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    thisWeekTasks: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private currentUserId: number;
  private currentTaskId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.currentUserId = 1;
    this.currentTaskId = 1;
    
    // Initialize with default user and tasks
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "avinash",
      password: "password123",
      name: "Avinash",
      email: "avinash@example.com",
      role: "Product Manager",
      department: "Engineering",
      location: "Pune, Maharashtra",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      joinDate: "Jan 2024"
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Create sample tasks
    const sampleTasks: Task[] = [
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

    sampleTasks.forEach(task => {
      this.tasks.set(task.id, task);
    });
    this.currentTaskId = 5;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      username: insertUser.email,
      password: "password123"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = {
      id,
      userId: insertTask.userId,
      title: insertTask.title,
      description: insertTask.description,
      completed: insertTask.completed ?? false,
      priority: insertTask.priority,
      dueDate: insertTask.dueDate,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: UpdateTask): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTaskStats(userId: number): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    thisWeekTasks: number;
  }> {
    const userTasks = await this.getTasks(userId);
    const completedTasks = userTasks.filter(task => task.completed).length;
    const pendingTasks = userTasks.filter(task => !task.completed).length;
    
    // Calculate this week's tasks (simplified - tasks created in last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekTasks = userTasks.filter(task => 
      new Date(task.createdAt) >= oneWeekAgo
    ).length;

    return {
      totalTasks: userTasks.length,
      completedTasks,
      pendingTasks,
      thisWeekTasks
    };
  }
}

export const storage = new MemStorage();
