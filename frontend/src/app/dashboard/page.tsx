import ExpDashboard from "@/components/gamification/ExpDashboard";
import Navbar from "@/components/layout/Navbar";

export default function DashboardPage() {
  return (
    <>
      <div className="bg-ambient"></div>
      <Navbar />
      
      {/* Background Decoration */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <main className="flex-1 pt-16 px-4 pb-12 w-full flex items-center justify-center">
        <ExpDashboard />
      </main>
    </>
  );
}
