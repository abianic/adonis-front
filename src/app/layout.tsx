import "./globals.css";
import { NextAuthProvider } from "./providers";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={"h-full bg-gray-50"}>
      <body className={"h-full"}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
