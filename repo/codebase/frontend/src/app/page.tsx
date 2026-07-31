"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import SlideViewer from "@/components/slide-viewer/SlideViewer";
import type { SlideSelection } from "@/components/slide-viewer/SlideViewer";
import TutorPanel from "@/components/tutor/TutorPanel";
import AnimatedPet from "@/components/gamification/AnimatedPet";
import type {
  PetBubbleKind,
  PetBubbleState,
} from "@/components/gamification/AnimatedPet";
import { loadPetStatus } from "@/lib/api";
import type { PetStatusResponse } from "@/lib/api";
import { useTutorChat } from "@/features/tutor/useTutorChat";
import {
  getTelemetrySessionId,
  track,
} from "@/features/telemetry/useTelemetry";
import { getNextPetIndex, PET_CHARACTERS } from "@/lib/petCharacters";

export default function Home() {
  const tutor = useTutorChat();
  const [pendingSelection, setPendingSelection] =
    useState<SlideSelection | null>(null);
  const [petStatus, setPetStatus] = useState<PetStatusResponse | null>(null);
  const [petBubble, setPetBubble] = useState<PetBubbleState | null>(null);
  const [petIndex, setPetIndex] = useState(0);
  const dismissTimerRef = useRef<number | null>(null);
  const activeInteractionRef = useRef<string | null>(null);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const dismissPetBubble = useCallback(() => {
    clearDismissTimer();
    activeInteractionRef.current = null;
    setPetBubble(null);
  }, [clearDismissTimer]);

  const showTemporaryBubble = useCallback(
    (
      kind: PetBubbleKind,
      message: string,
      duration = 3500,
      snippet?: string
    ) => {
      clearDismissTimer();
      const id = `pet-${Date.now()}`;
      activeInteractionRef.current = id;
      setPetBubble({ id, kind, message, snippet });
      dismissTimerRef.current = window.setTimeout(() => {
        if (activeInteractionRef.current === id) {
          activeInteractionRef.current = null;
          setPetBubble(null);
        }
      }, duration);
    },
    [clearDismissTimer]
  );

  useEffect(() => {
    let cancelled = false;
    loadPetStatus(getTelemetrySessionId())
      .then((status) => {
        if (!cancelled) setPetStatus(status);
      })
      .catch(() => {
        // Pet vẫn hiển thị được; trạng thái EXP sẽ cập nhật sau lần nộp quiz.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(
    () => () => {
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
      }
    },
    []
  );

  const handleTextSelected = useCallback(
    (selection: SlideSelection) => {
      if (petBubble?.kind === "thinking") return;

      clearDismissTimer();
      setPendingSelection(selection);
      activeInteractionRef.current = selection.selectionId;
      setPetBubble({
        id: selection.selectionId,
        kind: "confirm",
        message: "Đoạn này khá khoai đấy! Làm một task nhanh để nhận EXP nhé?",
        snippet:
          selection.text.length > 180
            ? `${selection.text.slice(0, 180)}…`
            : selection.text,
      });
      track("text_highlight", {
        slide_id: selection.slideId,
        page_num: selection.pageNum,
        text: selection.text.slice(0, 500),
      });
      track("quiz_offer", {
        slide_id: selection.slideId,
        page_num: selection.pageNum,
        text_len: selection.text.length,
      });
    },
    [clearDismissTimer, petBubble?.kind]
  );

  const handleAcceptPetTask = useCallback(async () => {
    if (!pendingSelection) return;

    clearDismissTimer();
    const interactionId = pendingSelection.selectionId;
    activeInteractionRef.current = interactionId;
    setPetBubble({
      id: interactionId,
      kind: "thinking",
      message: "Được rồi! Chờ mình chuẩn bị một thử thách vừa sức nhé.",
    });
    track("quiz_offer_response", {
      accepted: true,
      slide_id: pendingSelection.slideId,
      page_num: pendingSelection.pageNum,
    });

    const result = await tutor.startQuizFromSelection(
      pendingSelection.text,
      pendingSelection.slideId,
      pendingSelection.pageNum
    );
    if (activeInteractionRef.current !== interactionId) return;

    setPendingSelection(null);
    if (result.ok) {
      showTemporaryBubble(
        "notice",
        "Task đã sẵn sàng trong bảng Tutor. Chiến thôi! 🎯",
        3000
      );
    } else {
      showTemporaryBubble(
        "error",
        result.error || "Mình chưa tạo được task. Thử lại sau nhé.",
        5000
      );
    }
  }, [
    clearDismissTimer,
    pendingSelection,
    showTemporaryBubble,
    tutor,
  ]);

  const handleDeclinePetTask = useCallback(() => {
    if (pendingSelection) {
      track("quiz_offer_response", {
        accepted: false,
        slide_id: pendingSelection.slideId,
        page_num: pendingSelection.pageNum,
      });
    }
    setPendingSelection(null);
    showTemporaryBubble(
      "notice",
      "Oki, khi nào sẵn sàng thì bôi đen đoạn khác và gọi mình nhé!",
      3000
    );
  }, [pendingSelection, showTemporaryBubble]);

  const handlePetUpdate = useCallback(
    (status: PetStatusResponse) => {
      setPendingSelection(null);
      setPetStatus(status);
      showTemporaryBubble(
        status.emotion === "hungry" ? "encourage" : "success",
        status.message ||
          (status.emotion === "hungry"
            ? "Chưa đúng nhưng không sao, mình vẫn nhận được EXP!"
            : "Chính xác! EXP của mình vừa tăng rồi!"),
        status.emotion === "excited" ? 6000 : 4500
      );
    },
    [showTemporaryBubble]
  );

  const handleChangePet = useCallback(() => {
    if (petBubble?.kind === "confirm" || petBubble?.kind === "thinking") return;
    setPetIndex((previous) => getNextPetIndex(previous));
  }, [petBubble?.kind]);

  const hasQuizOnScreen = tutor.messages.some(
    (message) =>
      message.quiz &&
      (message.quiz.phase === "pending" ||
        message.quiz.phase === "submitting" ||
        message.quiz.phase === "answered")
  );

  // Tránh che chat khi đang xem/làm quiz; nhưng ưu tiên bubble xác nhận & đang tạo quiz
  const shouldPetAvoidChat =
    hasQuizOnScreen &&
    petBubble?.kind !== "confirm" &&
    petBubble?.kind !== "thinking";

  return (
    <>
      <div className="bg-ambient" />
      <Navbar />

      <div className="box-border flex h-dvh min-h-0 overflow-hidden pt-16">
        <Sidebar />

        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row">
          <SlideViewer onTextSelected={handleTextSelected} />
          <TutorPanel
            chat={tutor}
            onPetUpdate={handlePetUpdate}
            currentPet={PET_CHARACTERS[petIndex]}
            onChangePet={handleChangePet}
            canChangePet={
              petBubble?.kind !== "confirm" && petBubble?.kind !== "thinking"
            }
          />
        </main>
      </div>

      <AnimatedPet
        bubble={petBubble}
        petStatus={petStatus}
        petIndex={petIndex}
        isQuizActive={shouldPetAvoidChat}
        onAccept={() => void handleAcceptPetTask()}
        onDecline={handleDeclinePetTask}
        onClose={dismissPetBubble}
      />
    </>
  );
}
