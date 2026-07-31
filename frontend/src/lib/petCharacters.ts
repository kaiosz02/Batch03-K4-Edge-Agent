export type PetRenderType = "animated-bear" | "sprite-sheet";

export interface PetCharacter {
  id: string;
  name: string;
  color: string;
  glow: string;
  renderType: PetRenderType;
  spriteFile?: string;
}

export const PET_CHARACTERS: PetCharacter[] = [
  {
    id: "bear",
    name: "V-Bear",
    color: "text-amber-400",
    glow: "bg-amber-500/40",
    renderType: "animated-bear",
  },
  {
    id: "necromancer",
    name: "V-Mage",
    color: "text-purple-400",
    glow: "bg-purple-500/40",
    renderType: "sprite-sheet",
    spriteFile: "Necromancer_16x16.png",
  },
  {
    id: "toad",
    name: "V-Toad",
    color: "text-green-400",
    glow: "bg-green-500/40",
    renderType: "sprite-sheet",
    spriteFile: "Toad_16x16.png",
  },
  {
    id: "ghost",
    name: "V-Ghost",
    color: "text-tertiary",
    glow: "bg-tertiary/40",
    renderType: "sprite-sheet",
    spriteFile: "Ghost_16x16.png",
  },
  {
    id: "imp",
    name: "V-Imp",
    color: "text-red-400",
    glow: "bg-red-500/40",
    renderType: "sprite-sheet",
    spriteFile: "Imp_16x16.png",
  },
  {
    id: "spider",
    name: "V-Spider",
    color: "text-slate-300",
    glow: "bg-slate-500/40",
    renderType: "sprite-sheet",
    spriteFile: "Spider_16x16.png",
  },
];

export function getNextPetIndex(currentIndex: number): number {
  return (currentIndex + 1) % PET_CHARACTERS.length;
}
