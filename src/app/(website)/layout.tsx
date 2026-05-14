import Footer from "@/components/website/Footer";
import Navbar from "@/components/website/Navbar";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer/>
    </div>
  );
}