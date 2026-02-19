import { redirect } from "next/navigation";
import { getAuthSession } from "@/auth";
import AuthSessionSync from "@/components/AuthSessionSync";

export default async function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/app");
  }

  return <AuthSessionSync session={session}>{children}</AuthSessionSync>;
}
