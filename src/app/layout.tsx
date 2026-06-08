import type { Metadata } from "next";
import { DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export const DMSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const MontserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Remote Agric",
  description:
    "An agric investment platform that connects investors with farmers to promote sustainable agriculture and improve livelihoods.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${DMSans.variable} ${MontserratFont.variable} antialiased`}
      >
        <ReactQueryProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
