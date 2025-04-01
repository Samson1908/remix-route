import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET || "default_secret";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "session",
      secure: process.env.NODE_ENV === "production",
      secrets: [sessionSecret],
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    },
  });

  export async function getUserSession(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    return userId ? { userId } : null; // ✅ Return an object instead of session
  }
  

  export async function createUserSession({
    request,
    userId,
    redirectTo = "/chat", // ✅ Default redirect if not provided
  }: {
    request: Request;
    userId: string;
    redirectTo?: string; // ✅ `?` makes it optional
  }) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", userId);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
  

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}
