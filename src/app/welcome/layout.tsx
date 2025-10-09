import Navbar from "../../components/elements/navbar";
import { QueryProvider } from "../../lib/query-client";

export default function WelcomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <Navbar />
      {children}
    </QueryProvider>
  );
}
