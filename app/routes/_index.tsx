import { useEffect } from "react";
import { useNavigate, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getUserSession } from "../utils/session.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserSession(request);
  
  // Server-side redirect for better performance
  if (user) return redirect("/chat");
  return json({ isLoggedIn: false });
};

export default function Index() {
  const { isLoggedIn } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(isLoggedIn ? "/chat" : "/login");
    }, 100); // Small delay to prevent React warning

    return () => clearTimeout(timer); // Cleanup function
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Redirecting...</h1>
    </div>
  );
}
