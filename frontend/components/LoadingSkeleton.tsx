export default function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-white/5 bg-white/[0.03] p-4"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-white/10" />
            <div className="h-4 w-40 rounded bg-white/10" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-white/5" />
            <div className="h-3 w-4/5 rounded bg-white/5" />
            <div className="h-3 w-3/5 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
