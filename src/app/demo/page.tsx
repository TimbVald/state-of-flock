import type { Metadata } from "next";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Démo - TailAdmin Dashboard",
  description: "Découvrez notre dashboard en action",
};

export default function DemoPage() {
  // Rediriger automatiquement vers le dashboard admin
  redirect("/admin");
} 