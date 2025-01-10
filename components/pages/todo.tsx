"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { TodoList } from "@/components/todo-list";
import { AddTodoDialog } from "@/components/add-todo-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { FiPlus, FiLogOut } from "react-icons/fi";
import { useCategories } from "@/hooks/use-categories";
import type { Todo } from "@/types/todo";
import { createClient } from "@/utils/supabase/client";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const router = useRouter();
  const supabase = createClient();

  const fetchTodos = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTodos(data || []);
    } catch (error: any) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to fetch todos");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTodos();
    const channel = supabase
      .channel("todos_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        () => {
          fetchTodos();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchTodos, supabase]);

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

  if (isLoading || isCategoriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
