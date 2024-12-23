// app/tasks/page.tsx
import TaskDashboard from "@/components/TaskDashboard";

export default function TasksPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Crypto Twitter Challenge
        </h1>
        <TaskDashboard />
      </div>
    </main>
  );
}
