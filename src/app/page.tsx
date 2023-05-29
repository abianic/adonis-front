import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session: any = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/auth/login");
  }

  redirect("/profile");
}
