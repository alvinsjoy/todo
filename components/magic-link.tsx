"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaMagic } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
interface MagicLinkProps {
  getEmail: () => string;
}

export function MagicLink({ getEmail }: MagicLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleMagicLinkSignIn(email: string) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;

      toast.success("Magic link sent", {
        description: "Please check your email for the login link",
      });
      router.push("/verify");
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        className="w-full"
        disabled={isLoading}
        onClick={() => {
          const email = getEmail();
          if (!email) {
            toast.error("Please enter your email address first");
            return;
          }
          handleMagicLinkSignIn(email);
        }}
      >
        {isLoading ? (
          "Sending magic link..."
        ) : (
          <>
            <FaMagic className="mr-2 h-4 w-4" /> Sign in with Magic Link
          </>
        )}
      </Button>
    </>
  );
}
