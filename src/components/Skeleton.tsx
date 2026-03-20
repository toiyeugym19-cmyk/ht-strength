import { motion } from 'framer-motion';

const shimmer = {
  initial: { opacity: 0.4 },
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      variants={shimmer}
      initial="initial"
      animate="animate"
      className={`rounded-xl bg-white/10 ${className}`}
    />
  );
}

export function SkeletonRing({ size = 84 }: { size?: number }) {
  return (
    <motion.div
      variants={shimmer}
      initial="initial"
      animate="animate"
      className="rounded-full bg-white/10 flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--ios-card-bg)' }}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      {lines > 1 && (
        <div className="space-y-2">
          {Array.from({ length: lines - 1 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      )}
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--ios-card-bg)' }}>
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton cho 1 dòng member (avatar + info + progress bar) — dùng khi loading danh sách hội viên */
export function SkeletonMemberRow() {
  return (
    <div className="rounded-2xl overflow-hidden p-4" style={{ background: 'var(--ios-card-bg)', border: '1px solid var(--ios-separator)' }}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="w-[68px] h-[68px] rounded-2xl flex-shrink-0" />
      </div>
      <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'var(--ios-fill-tertiary)' }}>
        <Skeleton className="h-full w-3/4 rounded-full" />
      </div>
    </div>
  );
}

/** Danh sách skeleton member — dùng khi MembersPage đang load (API/persist) */
export function SkeletonMemberList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMemberRow key={i} />
      ))}
    </div>
  );
}
