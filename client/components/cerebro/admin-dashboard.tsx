"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Brain,
  Users,
  BookOpen,
  TrendingUp,
  MoreVertical,
  Search,
  LogOut,
  Settings,
  Bell,
  ChevronDown,
  Activity,
  Calendar,
  BarChart3,
  Shield,
} from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
  userEmail: string;
}

// Sample user data
const sampleUsers = [
  {
    id: "1",
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    plan: "Final Exam Prep",
    subjects: 4,
    streak: 12,
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "James Kim",
    email: "james@example.com",
    plan: "MCAT Study Plan",
    subjects: 6,
    streak: 8,
    status: "active",
    joinedAt: "2024-01-18",
  },
  {
    id: "3",
    name: "Emily Roberts",
    email: "emily@example.com",
    plan: "Bar Exam Prep",
    subjects: 3,
    streak: 0,
    status: "inactive",
    joinedAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Michael Chen",
    email: "michael@example.com",
    plan: "GRE Preparation",
    subjects: 5,
    streak: 21,
    status: "active",
    joinedAt: "2024-01-05",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    plan: "CPA Exam",
    subjects: 4,
    streak: 5,
    status: "active",
    joinedAt: "2024-01-20",
  },
];

export function AdminDashboard({ onLogout, userEmail }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "plans" | "analytics">("overview");

  const filteredUsers = sampleUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      title: "Total Users",
      value: "10,482",
      change: "+12.5%",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Plans",
      value: "8,234",
      change: "+8.2%",
      icon: BookOpen,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Completion Rate",
      value: "85.3%",
      change: "+3.1%",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Active Sessions",
      value: "1,249",
      change: "+18.7%",
      icon: Activity,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "plans", label: "Study Plans", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sidebar-foreground">CEREBRO</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Shield className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="max-w-[150px] truncate text-sm">{userEmail}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-border bg-popover">
                <DropdownMenuItem className="text-foreground hover:bg-accent focus:bg-accent">
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                  onClick={onLogout}
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.title} className="border-border bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className="mt-1 text-sm text-success">{stat.change} from last month</p>
                        </div>
                        <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recent Signups</CardTitle>
                    <CardDescription>New users in the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sampleUsers.slice(0, 4).map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                              <span className="text-sm font-medium text-foreground">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Badge
                            variant={user.status === "active" ? "default" : "secondary"}
                            className={user.status === "active" ? "bg-success/20 text-success" : ""}
                          >
                            {user.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Popular Study Plans</CardTitle>
                    <CardDescription>Most created plans this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Final Exam Prep", count: 2341, growth: "+15%" },
                        { name: "MCAT Study Plan", count: 1892, growth: "+12%" },
                        { name: "Bar Exam Prep", count: 1456, growth: "+8%" },
                        { name: "GRE Preparation", count: 1234, growth: "+22%" },
                      ].map((plan) => (
                        <div key={plan.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{plan.name}</p>
                              <p className="text-sm text-muted-foreground">{plan.count} users</p>
                            </div>
                          </div>
                          <span className="text-sm text-success">{plan.growth}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Export Users
                </Button>
              </div>

              {/* Users Table */}
              <Card className="border-border bg-card">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">User</TableHead>
                        <TableHead className="text-muted-foreground">Study Plan</TableHead>
                        <TableHead className="text-muted-foreground">Subjects</TableHead>
                        <TableHead className="text-muted-foreground">Streak</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground">Joined</TableHead>
                        <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-border">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                                <span className="text-sm font-medium text-foreground">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">{user.plan}</TableCell>
                          <TableCell className="text-foreground">{user.subjects}</TableCell>
                          <TableCell>
                            <span className={user.streak > 0 ? "text-primary" : "text-muted-foreground"}>
                              {user.streak} days
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.status === "active" ? "default" : "secondary"}
                              className={user.status === "active" ? "bg-success/20 text-success" : ""}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.joinedAt}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="border-border bg-popover">
                                <DropdownMenuItem className="text-foreground hover:bg-accent focus:bg-accent">
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-foreground hover:bg-accent focus:bg-accent">
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10">
                                  Suspend User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {(activeTab === "plans" || activeTab === "analytics") && (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mb-4 rounded-full bg-secondary p-4">
                  {activeTab === "plans" ? (
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {activeTab === "plans" ? "Study Plans Management" : "Analytics Dashboard"}
                </h3>
                <p className="text-center text-muted-foreground">
                  This section is under development. Check back soon for full functionality.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
