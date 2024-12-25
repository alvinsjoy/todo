"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { TodoList } from "@/components/todo-list";
import { AddTodoDialog } from "@/components/add-todo-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { FiPlus, FiLogOut } from "react-icons/fi";
import { useCategories } from "@/hooks/use-categories";
import type { Todo } from "@/types/todo";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const router = useRouter();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch todos");
      return;
    }

    setTodos(data);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/signin");
    } catch (error: any) {
      toast.error("Error signing out", {
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Todos</h1>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <FiLogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-end">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center space-x-2"
            >
              <FiPlus className="h-5 w-5" />
              <span>Add Todo</span>
            </Button>
          </div>

          <TodoList
            todos={todos}
            categories={categories}
            onUpdate={fetchTodos}
          />
        </motion.div>
      </main>

      <AddTodoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchTodos}
      />
    </div>
  );
}
