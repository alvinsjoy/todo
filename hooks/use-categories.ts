"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types/category";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data: userCategories, error: userError } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (userError) throw userError;

      const allCategories = [
        ...DEFAULT_CATEGORIES,
        ...(userCategories || []).map((cat) => ({
          ...cat,
          is_default: false,
        })),
      ];

      const sortedCategories = allCategories.sort((a, b) => {
        if (a.is_default === b.is_default) {
          return a.name.localeCompare(b.name);
        }
        return a.is_default ? -1 : 1;
      });

      setCategories(sortedCategories);
    } catch (error: any) {
      toast.error("Failed to fetch categories", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    refetch: fetchCategories,
  };
}
