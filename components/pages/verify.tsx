"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiMail } from "react-icons/fi";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 bg-card p-6 rounded-lg shadow-lg"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <FiMail className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground">
            We sent you a verification link. Please check your email and click
            the link to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            Didn&apos;t receive the email?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              try signing up again
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
