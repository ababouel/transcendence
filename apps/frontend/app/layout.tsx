import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "./context/user-context";
import { NavBar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <UserProvider>
          <div className="px-5 md:px-8 ">
            <NavBar />
          </div>
          <div className="px-5 md:px-8 mt-12 mb-24">
            <main className="max-w-container mx-auto">{children}</main>
          </div>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
