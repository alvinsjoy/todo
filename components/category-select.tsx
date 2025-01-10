"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LuPlus, LuTrash2 } from "react-icons/lu";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategoryForDeletion, setSelectedCategoryForDeletion] =
    useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

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
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Category created");
      setNewCategory("");
      setIsCreateDialogOpen(false);
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

  const handleDeleteCategory = async () => {
    if (!selectedCategoryForDeletion) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", selectedCategoryForDeletion.id);

      if (error) throw error;
      const { error: updateError } = await supabase
        .from("todos")
        .update({ category_id: null })
        .eq("category_id", selectedCategoryForDeletion.id);

      if (updateError) throw updateError;

      toast.success("Category deleted");
      setIsDeleteDialogOpen(false);
      setSelectedCategoryForDeletion(null);
      if (value === selectedCategoryForDeletion.id) {
        onValueChange("");
      }
      onCategoryCreated();
    } catch (error: any) {
      toast.error("Error deleting category", {
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
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
            <div
              key={category.id}
              className="flex items-center justify-between"
            >
              <SelectItem value={category.id} className="flex-1">
                {category.name}
              </SelectItem>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedCategoryForDeletion(category);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <LuTrash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category &quot;
              {selectedCategoryForDeletion?.name}&quot;? All todos in this
              category will become uncategorized.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
