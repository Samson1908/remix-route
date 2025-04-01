import { useState } from "react";
import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { createUserSession } from "../utils/session.server";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // ✅ Dummy Login (Replace with DB check)
  if (email === "sam@gmail.com" && password === "password") {
    return createUserSession({ request, userId: "123", email, redirectTo: "/chat" });
  }

  return json({ error: "Invalid credentials" }, { status: 400 });
};

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-md shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        {actionData?.error && <p className="text-red-400">{actionData.error}</p>}
        
        <Form method="post">
          <div className="mb-4">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 text-black rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 text-black rounded-md"
            />
          </div>

          <button type="submit" className="bg-blue-500 px-4 py-2 rounded-md w-full">
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}
