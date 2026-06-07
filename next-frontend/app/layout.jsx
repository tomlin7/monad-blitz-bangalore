import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const metadata = {
  title: "Rent Chaukidaar",
  description: "AI-Powered Rental Escrow on Monad",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
          <Navbar />
          <main className="w-full max-w-5xl flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
