"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LuPlus } from "react-icons/lu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types/category";

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  categories: Category[];
  onCategoryCreated: () => void;
}

export function CategorySelect({
  value,
  onValueChange,
  categories,
  onCategoryCreated,
}: CategorySelectProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsCreating(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: newCategory.trim(),
          user_id: user.id,
          is_default: false,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Category created");
      setNewCategory("");
      setIsDialogOpen(false);
      onValueChange(data.id);
      onCategoryCreated();
    } catch (error: any) {
      toast.error("Error creating category", {
        description: error.message,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="relative w-full justify-start font-normal"
              >
                <LuPlus className="mr-2 h-4 w-4" />
                Add new category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button
                  onClick={handleCreateCategory}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </SelectContent>
      </Select>
    </div>
  );
}
