"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import SlideViewer from "@/components/slide-viewer/SlideViewer";
import TutorPanel from "@/components/tutor/TutorPanel";
import AnimatedPet from "@/components/gamification/AnimatedPet";

export default function Home() {
  // Shared state: SlideViewer cập nhật → TutorPanel dùng để gửi kèm quiz request
  const [slideId, setSlideId] = useState<string | undefined>(undefined);
  const [pageNum, setPageNum] = useState<number>(1);

  const handleSlideContextChange = (id: string, page: number) => {
    setSlideId(id);
    setPageNum(page);
  };

  return (
    <>
      <div className="bg-ambient"></div>
      <Navbar />

      <div className="flex flex-1 pt-16 h-full overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          <SlideViewer onSlideContextChange={handleSlideContextChange} />
          <TutorPanel slideId={slideId} pageNum={pageNum} />
        </main>
      </div>

      <AnimatedPet />
    </>
  );
}

