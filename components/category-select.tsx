import { useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";
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
import { Category } from "@/types/category";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/category-actions";

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  categories: Category[];
  onCategoryCreated: () => void;
  disabled?: boolean;
}

export function CategorySelect({
  value,
  onValueChange,
  categories,
  onCategoryCreated,
  disabled,
}: CategorySelectProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategoryForDeletion, setSelectedCategoryForDeletion] =
    useState<Category | null>(null);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateCategory = async () => {
    setIsCreating(true);
    const result = await createCategory(newCategory);
    setIsCreating(false);

    if (result) {
      setNewCategory("");
      setIsCreateDialogOpen(false);
      onValueChange(result.id);
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
      if (value === selectedCategoryForDeletion.id) {
        onValueChange("");
      }
      setIsDeleteDialogOpen(false);
      setSelectedCategoryForDeletion(null);
      onCategoryCreated();
    }
  };

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger disabled={disabled}>
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
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedCategoryForEdit(category);
                    setEditedCategoryName(category.name);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <FiEdit2 className="h-4 w-4" />
                </Button>
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
    </div>
  );
}
