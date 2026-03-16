"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PracticeQuestion } from "@/lib/api";

interface SectionCardProps {
  label: string;
  Icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function SectionCard({
  label,
  Icon,
  iconColor,
  iconBg,
  defaultOpen = false,
  children,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.03]">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
      >
        <span className={cn("flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-sm", iconBg, iconColor)}>
          <Icon size={14} />
        </span>
        <span className="flex-1 text-sm font-medium text-gray-200">{label}</span>
        <ChevronDown
          size={14}
          className={cn("text-gray-500 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-4 py-4 text-sm leading-relaxed text-gray-300">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PracticeQuestionItem({ q, index }: { q: PracticeQuestion; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className={cn(
      "overflow-hidden rounded-lg border transition-colors duration-150",
      showAnswer ? "border-violet-500/30" : "border-white/5"
    )}>
      <div className="flex items-baseline gap-3 px-3 py-3">
        <span className="flex-shrink-0 text-xs font-semibold tracking-wide text-violet-400">
          Q{index + 1}
        </span>
        <span className="flex-1 text-sm text-gray-200">{q.question}</span>
        <button
          onClick={() => setShowAnswer((p) => !p)}
          className="flex-shrink-0 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-0.5 text-xs text-violet-300 transition-colors hover:bg-violet-500/20"
        >
          {showAnswer ? "Hide" : "Show answer"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showAnswer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-violet-500/20 bg-violet-500/[0.05] px-3 py-3 pl-9 text-sm text-violet-200">
              {q.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
