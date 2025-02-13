"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Category } from "@/types/category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCategories([]);
        return;
      }

      const { data: allCategories, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) throw error;

      setCategories(allCategories || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
    const channel = supabase
      .channel("categories_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchCategories, supabase]);

  return {
    categories,
    isLoading,
    refetch: fetchCategories,
  };
}
