export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />

      <div className="grid grid-cols-3 gap-4">
        <div className="h-20 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
        <div className="h-20 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
        <div className="h-20 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
      </div>

      <div className="h-72 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
    </div>
  );
}
