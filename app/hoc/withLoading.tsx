import { useState, useEffect } from "react";

export function withLoading(Component: React.ComponentType) {
  return function LoadingWrapper(props: any) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 1000); // Simulate API delay
      return () => clearTimeout(timer);
    }, []);

    if (loading) {
      return <div className="text-center p-4">Loading...</div>;
    }

    return <Component {...props} />;
  };
}
