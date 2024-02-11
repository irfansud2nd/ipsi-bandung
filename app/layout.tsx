import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import NavBar from "@/components/NavBar";
import { authOptions } from "@/utils/auth/authOptions";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Breadcrumbs from "@/components/Breadcrumbs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPSI Kota Bandung",
  description: "Website Ikatan Pencak Silat Indonesia Kota Bandung",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`min-h-screen grid grid-rows-[auto_1fr] w-full px-2 bg-applewhite ${inter.className}`}
        >
          <section>
            <NavBar />
            <Breadcrumbs />
          </section>
          <main>
            <ToastContainer />
            {children}
          </main>
        </body>
      </SessionProvider>
    </html>
  );
}
