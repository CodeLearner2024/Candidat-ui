// app/layout.tsx ou src/app/layout.tsx

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer /> {/* Ce composant s'affiche une seule fois ici */}
      </body>
    </html>
  );
}
