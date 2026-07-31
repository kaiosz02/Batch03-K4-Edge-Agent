"use client";

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { MOCK_USER_PROGRESS } from '@/constants/mock-data';
import { UserProgress } from '@/lib/types';

interface GamificationContextType {
  progress: UserProgress;
  gainExp: (amount: number, reason: string) => void;
  feedPet: () => void;
  playWithPet: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(MOCK_USER_PROGRESS);

  const gainExp = useCallback((amount: number, reason: string) => {
    setProgress((prev) => {
      const newExp = prev.pet.exp + amount;
      const leveledUp = newExp >= prev.pet.maxExp;
      
      const newPetState = {
        ...prev.pet,
        exp: leveledUp ? (newExp - prev.pet.maxExp) : newExp,
        level: leveledUp ? prev.pet.level + 1 : prev.pet.level,
        maxExp: leveledUp ? prev.pet.maxExp + 200 : prev.pet.maxExp,
        mood: "Cực Kì Vui 😸"
      };

      return {
        ...prev,
        totalExp: prev.totalExp + amount,
        pet: newPetState,
        recentActivities: [
          {
            id: `act-${Date.now()}`,
            type: "other",
            title: reason,
            expGained: amount,
            timeAgo: "Vừa xong",
            context: "Hành động V-Pet"
          },
          ...prev.recentActivities.slice(0, 4) // Keep last 5
        ]
      };
    });
    
    // Reset mood after 5s
    setTimeout(() => {
      setProgress((prev) => ({
        ...prev,
        pet: { ...prev.pet, mood: "Đang Vui 😻" }
      }));
    }, 5000);
  }, []);

  const feedPet = useCallback(() => gainExp(5, "Cho thú cưng ăn"), [gainExp]);
  const playWithPet = useCallback(() => gainExp(10, "Chơi với thú cưng"), [gainExp]);

  return (
    <GamificationContext.Provider value={{ progress, gainExp, feedPet, playWithPet }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
