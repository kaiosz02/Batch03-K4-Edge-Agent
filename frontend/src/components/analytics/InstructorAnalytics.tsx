"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HeatmapResponse, loadHeatmap } from "@/lib/api";

function getSuggestion(score: number, highlights: number): string {
  if (score >= 0.7) {
    return "Tỷ lệ trả lời sai cao; nên giảng lại và bổ sung một ví dụ trực quan.";
  }
  if (highlights >= 5) {
    return "Nhiều học viên dừng ở đoạn này; nên rút gọn câu chữ hoặc thêm chú thích.";
  }
  return "Tiếp tục theo dõi khi có thêm lượt học và làm quiz.";
}

function quoteCsv(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export default function InstructorAnalytics() {
  const [data, setData] = useState<HeatmapResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await loadHeatmap("all"));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không tải được dữ liệu heatmap."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadHeatmap("all")
      .then((heatmap) => {
        if (!cancelled) setData(heatmap);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không tải được dữ liệu heatmap."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const exportCsv = () => {
    if (!data) return;
    const rows = [
      [
        "slide_id",
        "page_num",
        "text_segment",
        "highlight_count",
        "wrong_answer_count",
        "difficulty_score",
      ],
      ...data.highlights.map((item) => [
        item.slide_id,
        item.page_num ?? "",
        item.text_segment,
        item.highlight_count,
        item.wrong_answer_count,
        item.difficulty_score,
      ]),
    ];
    const csv = rows.map((row) => row.map(quoteCsv).join(",")).join("\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" })
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "vpet-knowledge-heatmap.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative z-10 mx-auto mb-12 mt-24 w-full max-w-5xl overflow-hidden rounded-3xl glass-panel shadow-2xl">
      <div className="relative flex h-48 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950/80 via-surface-container-highest to-teal-950/80">
        <div className="relative z-10 space-y-2 text-center">
          <span className="text-5xl">📊</span>
          <h1 className="text-[32px] font-bold tracking-tight text-white md:text-[40px]">
            Knowledge Heatmap
          </h1>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">
            Dữ liệu tương tác thật + bộ demo minh họa
          </p>
        </div>
      </div>

      <div className="space-y-8 p-6">
        {error && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void refresh()}
              className="rounded-lg bg-red-500/20 px-3 py-1.5 font-bold"
            >
              Thử lại
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              label: "Học viên đã tương tác",
              value: data?.total_students ?? 0,
              icon: "👥",
            },
            {
              label: "Lượt trả lời quiz",
              value: data?.total_answers ?? 0,
              icon: "🧠",
            },
            {
              label: "Lượt trả lời sai",
              value: data?.total_wrong ?? 0,
              icon: "⚠️",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl p-6 text-center glass-panel"
            >
              <span className="mb-1 text-sm text-white/70">{stat.label}</span>
              <div className="mt-2 flex items-center gap-2 text-3xl font-bold text-white">
                <span className="text-2xl">{stat.icon}</span>
                <span>{isLoading ? "…" : stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center">
            <h2 className="flex items-center gap-2 text-[20px] font-bold text-white">
              🔥 Điểm mù kiến thức
            </h2>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={isLoading}
              className="self-start rounded-full bg-white/10 px-3 py-1 text-xs text-white disabled:opacity-50 md:self-auto"
            >
              {isLoading ? "Đang cập nhật…" : "Cập nhật dữ liệu"}
            </button>
          </div>

          {data?.highlights.some((item) => item.is_demo) && (
            <div className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-3 text-xs text-blue-200">
              ℹ️ Các thẻ có nhãn <strong>DEMO</strong> là dữ liệu mô phỏng để
              minh họa rõ ba mức nhiệt. Log tương tác thật vẫn được tổng hợp
              song song.
            </div>
          )}

          {!isLoading && data && data.highlights.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/60">
              Chưa có dữ liệu. Hãy bôi đen một đoạn slide, làm quiz rồi quay lại
              dashboard.
            </div>
          )}

          <div className="space-y-4">
            {data?.highlights.map((spot) => {
              const severity =
                spot.difficulty_score >= 0.7
                  ? "#ff5252"
                  : spot.difficulty_score >= 0.4
                    ? "#fb8c00"
                    : "#4caf50";
              const severityLabel =
                spot.difficulty_score >= 0.7
                  ? "Rất khó"
                  : spot.difficulty_score >= 0.4
                    ? "Cần chú ý"
                    : "Ổn định";
              return (
                <article
                  key={spot.id}
                  className="flex flex-col gap-4 rounded-2xl border-l-4 p-5 glass-panel md:flex-row md:items-center"
                  style={{ borderLeftColor: severity }}
                >
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <span className="text-[10px] uppercase text-white/50">
                      Trang
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {spot.page_num ?? "—"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start gap-2">
                      <p className="min-w-0 flex-1 break-words font-semibold text-white">
                        “{spot.text_segment}”
                      </p>
                      {spot.is_demo && (
                        <span className="rounded-full border border-blue-400/30 bg-blue-400/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-300">
                          DEMO
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded bg-orange-500/20 px-2 py-1 text-orange-300">
                        {spot.highlight_count} lượt bôi đen
                      </span>
                      <span className="rounded bg-red-500/20 px-2 py-1 text-red-300">
                        {spot.wrong_answer_count} lượt sai
                      </span>
                      <span className="rounded bg-blue-500/20 px-2 py-1 text-blue-300">
                        Độ khó {Math.round(spot.difficulty_score * 100)}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="text-white/50">Cường độ điểm mù</span>
                        <span className="font-bold" style={{ color: severity }}>
                          {severityLabel}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(
                              spot.difficulty_score * 100,
                              3
                            )}%`,
                            backgroundColor: severity,
                            boxShadow: `0 0 12px ${severity}80`,
                          }}
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-white/65">
                      💡 {getSuggestion(spot.difficulty_score, spot.highlight_count)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="flex justify-end gap-4 border-t border-white/5 pt-6">
          <Link
            href="/"
            className="rounded-xl px-5 py-3 text-sm text-white glass-panel hover:bg-white/10"
          >
            ← Về trang học tập
          </Link>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!data || data.highlights.length === 0}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Xuất CSV
          </button>
        </div>
      </div>
    </div>
  );
}
