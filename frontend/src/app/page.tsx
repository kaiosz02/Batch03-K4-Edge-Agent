import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import SlideViewer from "@/components/slide-viewer/SlideViewer";
import TutorPanel from "@/components/tutor/TutorPanel";
import VPetWidget from "@/components/gamification/VPetWidget";

export default function Home() {
  return (
    <>
      <div className="bg-ambient"></div>
      <Navbar />
      
      <div className="flex flex-1 pt-16 h-full overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          <SlideViewer />
          <TutorPanel />
        </main>
      </div>
      
      <VPetWidget />
    </>
  );
}

