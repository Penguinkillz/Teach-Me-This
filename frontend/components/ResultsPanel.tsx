"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Info,
  Mountain,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { SectionCard, PracticeQuestionItem } from "./SectionCard";
import type { ExplainResponse } from "@/lib/api";

interface ResultsPanelProps {
  data: ExplainResponse;
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function ResultsPanel({ data }: ResultsPanelProps) {
  const { sections } = data;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {/* Meta bar */}
      <motion.div variants={fadeUp} className="mb-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {data.level} · {data.style}
        </p>
      </motion.div>

      {/* 1. Simple Explanation */}
      <motion.div variants={fadeUp}>
        <SectionCard
          label="Simple Explanation"
          Icon={Sparkles}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/15"
          defaultOpen
        >
          <p>{sections.simple_explanation}</p>
        </SectionCard>
      </motion.div>

      {/* 2. Detailed Explanation */}
      <motion.div variants={fadeUp}>
        <SectionCard
          label="Detailed Explanation"
          Icon={Info}
          iconColor="text-sky-400"
          iconBg="bg-sky-500/15"
          defaultOpen
        >
          <p className="whitespace-pre-line">{sections.detailed_explanation}</p>
        </SectionCard>
      </motion.div>

      {/* 3. Real-Life Example */}
      <motion.div variants={fadeUp}>
        <SectionCard
          label="Real-Life Example"
          Icon={Mountain}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/15"
        >
          <p>{sections.real_life_example}</p>
        </SectionCard>
      </motion.div>

      {/* 4. Key Points */}
      <motion.div variants={fadeUp}>
        <SectionCard
          label="Key Points Summary"
          Icon={CheckCircle}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/15"
        >
          <ul className="space-y-1.5 pl-1">
            {sections.key_points.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                {pt}
              </li>
            ))}
          </ul>
        </SectionCard>
      </motion.div>

      {/* 5. Practice Questions */}
      <motion.div variants={fadeUp}>
        <SectionCard
          label="5 Practice Questions"
          Icon={HelpCircle}
          iconColor="text-pink-400"
          iconBg="bg-pink-500/15"
        >
          <div className="space-y-2">
            {sections.practice_questions.map((q, i) => (
              <PracticeQuestionItem key={i} q={q} index={i} />
            ))}
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
