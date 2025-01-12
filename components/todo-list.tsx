"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { FiCheck, FiTrash2, FiClock, FiEdit2 } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EditTodoDialog } from "@/components/edit-todo";
import { createClient } from "@/utils/supabase/client";
import { Todo } from "@/types/todo";
import { Category } from "@/types/category";

interface TodoListProps {
  todos: Todo[];
  categories: Category[];
  onUpdate: () => void;
}

const priorityColors = {
  low: "bg-green-500/10 text-green-500",
  medium: "bg-yellow-500/10 text-yellow-500",
  high: "bg-red-500/10 text-red-500",
};

export function TodoList({ todos, categories, onUpdate }: TodoListProps) {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [prevCompletion, setPrevCompletion] = useState(0);
  const supabase = createClient();

  const completionPercentage = todos.length
    ? Math.round(
        (todos.filter((todo) => todo.is_completed).length / todos.length) * 100
      )
    : 0;

  useEffect(() => {
    if (
      completionPercentage === 100 &&
      prevCompletion !== 100 &&
      progressRef.current
    ) {
      const rect = progressRef.current.getBoundingClientRect();
      const x = (rect.left + rect.right) / 2 / window.innerWidth;
      const y = rect.top / window.innerHeight;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899"],
        ticks: 200,
        gravity: 1.2,
        scalar: 1.2,
        shapes: ["circle", "square"],
        zIndex: 9999,
      });
    }
    setPrevCompletion(completionPercentage);
  }, [completionPercentage, prevCompletion]);

  const handleToggleComplete = async (todo: Todo) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_completed: !todo.is_completed })
      .eq("id", todo.id);

    if (error) {
      toast.error("Error", {
        description: "Failed to update todo",
      });
      return;
    }

    onUpdate();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      toast.error("Error", {
        description: "Failed to delete todo",
      });
      return;
    }

    onUpdate();
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Uncategorized";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            Progress
          </h2>
          <span className="text-sm font-medium text-muted-foreground">
            {completionPercentage}%
          </span>
        </div>
        <div ref={progressRef}>
          <Progress value={completionPercentage} />
        </div>
      </div>

      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: todo.is_completed ? 0.7 : 1,
              y: 0,
              scale: todo.is_completed ? 0.98 : 1,
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <Card
              className={cn(
                "p-4 transition-all duration-300",
                todo.is_completed
                  ? "bg-muted"
                  : "bg-card hover:shadow-lg dark:hover:shadow-white/10 hover:shadow-black/5"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <motion.h3
                      className={cn(
                        "text-lg font-semibold transition-all duration-300",
                        todo.is_completed
                          ? "line-through text-muted-foreground"
                          : ""
                      )}
                      animate={{
                        scale: todo.is_completed ? 0.95 : 1,
                      }}
                    >
                      {todo.title}
                    </motion.h3>
                    <Badge
                      variant="secondary"
                      className={
                        priorityColors[
                          todo.priority as keyof typeof priorityColors
                        ]
                      }
                    >
                      {todo.priority}
                    </Badge>
                    <Badge variant="outline">
                      {getCategoryName(todo.category_id)}
                    </Badge>
                  </div>
                  <p
                    className={cn(
                      "text-muted-foreground transition-all duration-300",
                      todo.is_completed ? "opacity-70" : ""
                    )}
                  >
                    {todo.description}
                  </p>
                  {todo.due_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FiClock className="mr-1 h-4 w-4" />
                      {format(new Date(todo.due_date), "PPP")}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleComplete(todo)}
                  >
                    <motion.div
                      animate={{
                        scale: todo.is_completed ? 1.2 : 1,
                        rotate: todo.is_completed ? 360 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      <FiCheck
                        className={cn(
                          "h-4 w-4 transition-colors",
                          todo.is_completed ? "text-green-500" : ""
                        )}
                      />
                    </motion.div>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingTodo(todo)}
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(todo.id)}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      {todos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No todos yet. Add one to get started!
        </div>
      )}

      {editingTodo && (
        <EditTodoDialog
          todo={editingTodo}
          open={!!editingTodo}
          onOpenChange={(open) => !open && setEditingTodo(null)}
          onSuccess={() => {
            setEditingTodo(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}
