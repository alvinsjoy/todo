"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuPlus, LuSearch, LuTag, LuTrash2, LuLogOut } from "react-icons/lu";
import { FiEdit2, FiMoreHorizontal } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import { toast } from "sonner";
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
import { ModeToggle } from "@/components/mode-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/types/category";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/category-actions";
import { createClient } from "@/utils/supabase/client";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategoryForDeletion, setSelectedCategoryForDeletion] =
    useState<Category | null>(null);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    useState<Category | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

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

  const handleCreateCategory = async () => {
    setIsCreatingCategory(true);
    const result = await createCategory(newCategory);
    setIsCreatingCategory(false);

    if (result) {
      setNewCategory("");
      onCategoryCreated();
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategoryForEdit) return;

    setIsEditing(true);
    const result = await updateCategory(
      selectedCategoryForEdit.id,
      editedCategoryName
    );
    setIsEditing(false);

    if (result) {
      setEditedCategoryName("");
      setIsEditDialogOpen(false);
      setSelectedCategoryForEdit(null);
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
              name="search"
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
                name="category"
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <FiMoreHorizontal className="h-4 w-4" />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedCategoryForEdit(category);
                            setEditedCategoryName(category.name);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <FiEdit2 className="mr-2 h-4 w-4" />
                          <span>Edit Category</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedCategoryForDeletion(category);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <LuTrash2 className="mr-2 h-4 w-4" />
                          <span>Delete Category</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <div className="flex items-center justify-between p-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LuLogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </SidebarFooter>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Category name"
              value={editedCategoryName}
              onChange={(e) => setEditedCategoryName(e.target.value)}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditCategory} disabled={isEditing}>
                {isEditing ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
