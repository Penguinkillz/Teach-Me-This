"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Upload, Youtube } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResultsPanel from "@/components/ResultsPanel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { explainTopic, type ExplainResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

const LEVELS = [
  "Explain Like I'm 10",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Exam Revision Mode",
];

const STYLES = [
  "Simple Explanation",
  "Step-by-step Breakdown",
  "Real-life Analogies",
  "Exam-oriented Answer",
  "Bullet Summary",
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [sourcesText, setSourcesText] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [style, setStyle] = useState("Simple Explanation");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExplainResponse | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() && (!files || files.length === 0) && !sourcesText.trim()) {
      setError("Enter a topic, paste some notes, or upload a file.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await explainTopic({ topic, level, style, sourcesText, files });
      setResult(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-700/8 blur-[100px]" />
      </div>

      <main className="relative flex-1">
        {/* Hero */}
        <section className="px-6 pb-12 pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mx-auto max-w-3xl bg-gradient-to-br from-white via-gray-100 to-violet-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              Understand anything,{" "}
              <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text">
                instantly.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
              Your AI personal explainer. Enter a topic, upload your notes — get a
              structured explanation, examples, key points, and practice questions.
            </p>
          </motion.div>
        </section>

        {/* Two-column layout */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* LEFT — Input form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Topic */}
                <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 transition-colors focus-within:border-violet-500/50 focus-within:shadow-[0_0_0_1px_rgba(139,92,246,0.2)]">
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    Topic or question{" "}
                    <span className="text-gray-600">· Required unless you upload/paste</span>
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={3}
                    placeholder="e.g. How does photosynthesis work? or Newton's second law"
                    className="w-full resize-none bg-transparent text-sm text-gray-100 placeholder-gray-600 outline-none"
                  />
                </div>

                {/* File upload + paste */}
                <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 transition-colors focus-within:border-violet-500/50">
                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Source material{" "}
                    <span className="text-gray-600">· PDF / DOCX or paste text</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200"
                  >
                    <Upload size={12} />
                    {files && files.length > 0
                      ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                      : "Upload PDF / DOCX"}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.docx"
                    multiple
                    className="hidden"
                    onChange={(e) => setFiles(e.target.files)}
                  />
                  <textarea
                    value={sourcesText}
                    onChange={(e) => setSourcesText(e.target.value)}
                    rows={4}
                    placeholder="Or paste your notes / article text here."
                    className="w-full resize-none bg-transparent text-sm text-gray-100 placeholder-gray-600 outline-none"
                  />
                </div>

                {/* Level + Style */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                    <label className="mb-1.5 block text-xs text-gray-400">Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full bg-transparent text-sm text-gray-100 outline-none [&>option]:bg-[#1a1a2e]"
                    >
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                    <label className="mb-1.5 block text-xs text-gray-400">Style</label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-transparent text-sm text-gray-100 outline-none [&>option]:bg-[#1a1a2e]"
                    >
                      {STYLES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* YouTube - Coming soon */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 opacity-50">
                  <div className="mb-1.5 flex items-center gap-2">
                    <label className="text-xs text-gray-500">YouTube link</label>
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-400">
                      Coming soon
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Youtube size={13} className="text-gray-600" />
                    <input
                      type="url"
                      disabled
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-transparent text-sm text-gray-500 placeholder-gray-700 outline-none"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200",
                    "bg-gradient-to-r from-violet-600 to-purple-700 text-white",
                    "shadow-lg shadow-purple-900/40",
                    "hover:from-violet-500 hover:to-purple-600 hover:shadow-purple-800/50 hover:scale-[1.01]",
                    "active:scale-[0.99]",
                    "disabled:cursor-wait disabled:opacity-60 disabled:hover:scale-100"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Thinking…
                    </>
                  ) : (
                    "Teach me this ✦"
                  )}
                </button>
              </form>
            </motion.div>

            {/* RIGHT — Results */}
            <div ref={resultsRef}>
              {loading && <LoadingSkeleton />}

              {!loading && !result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                    <span className="text-2xl">✦</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Enter a topic on the left and hit{" "}
                    <span className="text-violet-400">Teach me this</span>. You can
                    also paste notes or upload a PDF/DOCX.
                  </p>
                </motion.div>
              )}

              {!loading && result && <ResultsPanel data={result} />}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
