// app/layout.js ou app/page.js ou _app.js selon ta structure
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer /> {/* Ajoute ce composant une fois dans ton app */}
      </body>
    </html>
  );
}
