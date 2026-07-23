// Spinner — loading indicator component
export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm:  'w-4 h-4 border-2',
    md:  'w-7 h-7 border-2',
    lg:  'w-12 h-12 border-[3px]',
    xl:  'w-16 h-16 border-4',
  };
  return (
    <div
      className={`${sizes[size]} rounded-full border-primary-200 border-t-primary-600 animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Full-page centered loading overlay */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
