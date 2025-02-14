"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { TodoList } from "@/components/todo-list";
import { TodoSidebar } from "@/components/todo-sidebar";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { useCategories } from "@/hooks/use-categories";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import type { Todo } from "@/types/todo";
import { createClient } from "@/utils/supabase/client";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("due_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const {
    categories,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useCategories();
  const supabase = createClient();

  const fetchTodos = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      let query = supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("is_completed", { ascending: true })
        .order(sortField, { ascending: sortOrder === "asc" });

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setTodos(data || []);
    } catch (error: any) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to fetch todos");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, selectedCategory, searchQuery, sortField, sortOrder]);

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

  const handleSortChange = (field: string, order: string) => {
    setSortField(field);
    setSortOrder(order as "asc" | "desc");
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <TodoSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onSearch={setSearchQuery}
          onCategoryCreated={refetchCategories}
          onSortChange={handleSortChange}
        />

        <SidebarInset className="flex-1">
          <header className="border-b">
            <div className="container mx-auto px-6 py-4 flex items-center gap-4">
              <SidebarToggle />
              <h1 className="text-2xl font-bold">My Todos</h1>
            </div>
          </header>

          <main className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <TodoList
                todos={todos}
                categories={categories}
                onUpdate={fetchTodos}
              />
            </motion.div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
