"use client";

import Link from "next/link";

// Mock data cho Dashboard
const MOCK_STATS = {
  totalStudents: 128,
  totalQuestions: 1261,
  unansweredQuestions: 582, // AI Tutor trả lời thiếu căn cứ
};

const BLIND_SPOTS = [
  {
    id: 1,
    slideNumber: 12,
    term: "Retrieval-Augmented Generation (RAG)",
    count: 45,
    status: "critical",
    suggestion: "Nên bổ sung thêm sơ đồ luồng hoạt động của RAG.",
  },
  {
    id: 2,
    slideNumber: 15,
    term: "Vector Embeddings",
    count: 32,
    status: "warning",
    suggestion: "Học viên gặp khó khăn trong việc phân biệt Vector DB và SQL DB.",
  },
  {
    id: 3,
    slideNumber: 8,
    term: "Hallucination trong LLM",
    count: 28,
    status: "warning",
    suggestion: "Cần đưa ra ví dụ thực tế về Hallucination.",
  },
  {
    id: 4,
    slideNumber: 21,
    term: "Chunking Strategy",
    count: 15,
    status: "normal",
    suggestion: "Slide có thể hơi dài, cần ngắt nhỏ ý.",
  }
];

export default function InstructorAnalytics() {
  const notImplemented = () => {
    alert("Tính năng đang phát triển!");
  };

  return (
    <div className="relative z-10 w-full max-w-5xl glass-panel rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500 mx-auto mt-24 mb-12">
      {/* Header / Banner Section */}
      <div className="relative h-48 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-surface-container-highest to-teal-900/50 opacity-90"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #4facfe 0%, transparent 50%), radial-gradient(circle at 80% 70%, #00f2fe 0%, transparent 50%)' }}
          ></div>
        </div>
        <div className="relative z-10 text-center space-y-2">
          <span className="material-symbols-outlined text-blue-400 text-5xl mb-2 filter drop-shadow-[0_0_8px_rgba(79,172,254,0.8)]" style={{ fontVariationSettings: "'FILL' 1" }}>
            monitoring
          </span>
          <h1 className="font-display-lg text-[32px] md:text-[40px] text-white tracking-tight font-bold">Analytics Dashboard</h1>
          <p className="font-label-sm text-sm text-blue-300 uppercase tracking-[0.2em]">Khóa 4 • AI Product Hackathon</p>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-stack-lg space-y-stack-lg p-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
            <span className="font-label-sm text-sm text-white/70 mb-1">Tổng Số Học Viên</span>
            <div className="text-white font-headline-md text-3xl font-bold flex items-center gap-2 mt-2">
              <span className="material-symbols-outlined text-blue-400 text-2xl">group</span>
              <span>{MOCK_STATS.totalStudents}</span>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
            <span className="font-label-sm text-sm text-white/70 mb-1">Tổng Số Câu Hỏi AI Tutor</span>
            <div className="text-white font-headline-md text-3xl font-bold flex items-center gap-2 mt-2">
              <span className="material-symbols-outlined text-purple-400 text-2xl">forum</span>
              <span>{MOCK_STATS.totalQuestions}</span>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300 border border-red-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
            <span className="font-label-sm text-sm text-white/70 mb-1 relative z-10">Câu Hỏi Không Tìm Thấy Căn Cứ</span>
            <div className="text-red-400 font-headline-md text-3xl font-bold flex items-center gap-2 mt-2 relative z-10">
              <span className="material-symbols-outlined text-red-400 text-2xl">warning</span>
              <span className="animate-pulse">{MOCK_STATS.unansweredQuestions}</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden relative z-10">
              <div className="h-full bg-red-500 w-[46%] shadow-[0_0_8px_rgba(255,82,82,0.6)]"></div>
            </div>
          </div>
        </div>
        
        {/* Heatmap / Blind Spots Section */}
        <div className="space-y-6 mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-4">
            <h3 className="font-headline-md text-[20px] text-white flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-orange-400 text-[24px]">visibility_off</span>
              Điểm Mù Kiến Thức (Heatmap)
            </h3>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white self-start md:self-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Cập nhật trực tiếp
            </span>
          </div>
          
          <div className="space-y-4">
            {BLIND_SPOTS.map((spot) => (
              <div key={spot.id} className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-white/5 transition-colors border-l-4 group" style={{ borderLeftColor: spot.status === 'critical' ? '#ff5252' : spot.status === 'warning' ? '#fb8c00' : '#4caf50' }}>
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex-shrink-0">
                    <span className="text-xs text-white/50 uppercase">Slide</span>
                    <span className="text-2xl font-bold text-white">{spot.slideNumber}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h4 className="font-body-lg text-[16px] text-white font-semibold">"{spot.term}"</h4>
                      <span className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold font-mono">
                        <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                        {spot.count} học viên hỏi
                      </span>
                    </div>
                    <p className="text-white/70 text-[14px] flex items-start gap-2 mt-2">
                      <span className="material-symbols-outlined text-[18px] text-yellow-400 flex-shrink-0 mt-0.5">lightbulb</span>
                      <span><strong className="text-white/90">Gợi ý AI: </strong>{spot.suggestion}</span>
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-4 flex gap-2 w-full md:w-auto">
                  <button onClick={notImplemented} className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Sửa Slide
                  </button>
                  <button onClick={notImplemented} className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    Tạo giải thích mẫu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Modal Actions */}
        <div className="pt-8 mt-4 flex gap-4 justify-end border-t border-white/5">
          <Link href="/">
            <button className="px-6 py-3 rounded-xl glass-panel font-label-sm text-sm text-white hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Về trang học tập
            </button>
          </Link>
          <button onClick={notImplemented} className="py-3 px-6 rounded-xl font-label-sm text-sm text-white bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95 transition-all duration-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Xuất Báo Cáo PDF
          </button>
        </div>
      </div>
      
      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-2 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent blur-xl"></div>
    </div>
  );
}
