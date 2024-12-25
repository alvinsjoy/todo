"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const PUBLIC_PAGES = ["/signin", "/signup", "/verify"];

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        if (!PUBLIC_PAGES.includes(pathname)) {
          router.push("/signin");
        }
        return;
      }
      if (PUBLIC_PAGES.includes(pathname)) {
        router.push("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);
}
