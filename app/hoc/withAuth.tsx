import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { getSession } from "../utils/session.server"; // Adjust as needed

export function withAuth(Component: React.ComponentType) {
  return function AuthWrapper(props: any) {
    const navigate = useNavigate();

    useEffect(() => {
      async function checkAuth() {
        const session = await getSession(); // Fetch session
        if (!session?.user) {
          navigate("/login");
        }
      }
      checkAuth();
    }, [navigate]);

    return <Component {...props} />;
  };
}
