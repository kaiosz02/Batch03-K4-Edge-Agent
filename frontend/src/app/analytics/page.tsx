import InstructorAnalytics from "@/components/analytics/InstructorAnalytics";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Instructor Analytics | VLearn AI Tutor",
  description: "Dashboard thống kê điểm mù kiến thức dành cho giảng viên",
};

export default function AnalyticsPage() {
  return (
    <>
      <div className="bg-ambient fixed inset-0 -z-20"></div>
      <Navbar />
      
      {/* Background Decoration */}
      <div className="fixed top-20 left-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <main className="flex-1 pt-16 px-4 w-full min-h-screen overflow-y-auto custom-scrollbar">
        <InstructorAnalytics />
      </main>
    </>
  );
}
