import "./globals.css";
import Sidebar from "@/components/sidebar";

export const metadata = {
  title: "Swen — Intelligence Platform",
  description: "AI-native intelligence platform for endowments and foundations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
