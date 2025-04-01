import { Layout } from "~/root";

export function withLayout(Component: React.ComponentType) {
  return function LayoutWrapper(props: any) {
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  };
}
