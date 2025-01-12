import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export async function createCategory(name: string) {
  const supabase = createClient();

  if (!name.trim()) {
    toast.error("Please enter a category name");
    return null;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: name.trim(),
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    toast.success("Category created");
    return data;
  } catch (error: any) {
    toast.error("Error creating category", {
      description: error.message,
    });
    return null;
  }
}

export async function deleteCategory(categoryId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;

    const { error: updateError } = await supabase
      .from("todos")
      .update({ category_id: null })
      .eq("category_id", categoryId);

    if (updateError) throw updateError;

    toast.success("Category deleted");
    return true;
  } catch (error: any) {
    toast.error("Error deleting category", {
      description: error.message,
    });
    return false;
  }
}
