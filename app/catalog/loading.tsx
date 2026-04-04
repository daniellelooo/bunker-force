export default function CatalogLoading() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen animate-pulse">
      {/* Sidebar skeleton */}
      <aside className="w-full md:w-64 shrink-0 bg-surface-container-low border-r border-outline-variant/20 p-6 space-y-6">
        <div className="h-3 w-20 bg-surface-container-high" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-2 w-16 bg-surface-container-high" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-7 w-10 bg-surface-container-high" />
              ))}
            </div>
          </div>
        ))}
      </aside>

      {/* Grid skeleton */}
      <section className="flex-1 p-4 md:p-12">
        {/* Title skeleton */}
        <div className="mb-12 space-y-2">
          <div className="h-10 w-48 bg-surface-container-high" />
          <div className="h-14 w-72 bg-surface-container-high" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface-container-low">
              <div className="aspect-[3/4] w-full bg-surface-container-high" />
              <div className="p-4 space-y-2">
                <div className="h-2 w-1/3 bg-surface-container-high" />
                <div className="h-4 w-3/4 bg-surface-container-high" />
                <div className="h-4 w-1/4 bg-surface-container-high" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
