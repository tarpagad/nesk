import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  return <>{children}</>;
}

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}
