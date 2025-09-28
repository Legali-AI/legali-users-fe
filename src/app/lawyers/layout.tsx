import { QueryProvider } from "../../lib/query-client";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryProvider>{children}</QueryProvider>;
}
