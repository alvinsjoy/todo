"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 bg-card p-6 rounded-lg shadow-lg text-center"
      >
        <div className="space-y-2">
          <div className="flex justify-center mb-4">
            <FiAlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/">Return to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
}
