"use client";

import { useState } from "react";
import { LuPlus, LuSearch, LuTag, LuTrash2 } from "react-icons/lu";
import { FaSort } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddTodoDialog } from "@/components/add-todo";
import { SortControls } from "@/components/sort-controls";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Category } from "@/types/category";
import { createCategory, deleteCategory } from "@/lib/category-actions";

interface TodoSidebarProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (categoryId: string | undefined) => void;
  onSearch: (query: string) => void;
  onCategoryCreated: () => void;
  onSortChange?: (field: string, order: string) => void;
}

export function TodoSidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  onSearch,
  onCategoryCreated,
  onSortChange,
}: TodoSidebarProps) {
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategoryForDeletion, setSelectedCategoryForDeletion] =
    useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateCategory = async () => {
    setIsCreatingCategory(true);
    const result = await createCategory(newCategory);
    setIsCreatingCategory(false);

    if (result) {
      setNewCategory("");
      onCategoryCreated();
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryForDeletion) return;

    setIsDeleting(true);
    const success = await deleteCategory(selectedCategoryForDeletion.id);
    setIsDeleting(false);

    if (success) {
      if (selectedCategory === selectedCategoryForDeletion.id) {
        onCategorySelect(undefined);
      }
      setIsDeleteDialogOpen(false);
      setSelectedCategoryForDeletion(null);
      onCategoryCreated();
    }
  };

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader className="space-y-4">
          <Button onClick={() => setIsAddTodoOpen(true)} className="w-full">
            <LuPlus />
            Add Todo
          </Button>
          <div className="relative">
            <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search todos..."
              className="pl-8"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <FaSort className="mr-2" /> Sort by
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SortControls onSortChange={onSortChange || (() => {})} />
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>
              <LuTag className="mr-2" />
              Categories
            </SidebarGroupLabel>
            <SidebarGroupAction onClick={handleCreateCategory}>
              <LuPlus />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <Input
                placeholder="New category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateCategory();
                  }
                }}
                disabled={isCreatingCategory}
                className="mb-2"
              />
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onCategorySelect(undefined)}
                    isActive={!selectedCategory}
                  >
                    All Todos
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {categories.map((category) => (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton
                      onClick={() => onCategorySelect(category.id)}
                      isActive={selectedCategory === category.id}
                    >
                      {category.name}
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={() => {
                        setSelectedCategoryForDeletion(category);
                        setIsDeleteDialogOpen(true);
                      }}
                      showOnHover
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <AddTodoDialog
        open={isAddTodoOpen}
        onOpenChange={setIsAddTodoOpen}
        onSuccess={() => setIsAddTodoOpen(false)}
      />

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
    </>
  );
}
