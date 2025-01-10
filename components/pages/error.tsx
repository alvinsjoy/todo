"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiAlertCircle } from "react-icons/fi";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 bg-card p-6 rounded-lg shadow-lg"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <FiAlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            There was a problem with your authentication request. Please try
            signing in again.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            Need to create an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/signin">Back to Sign In</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
