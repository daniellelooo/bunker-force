export default function ProductLoading() {
  return (
    <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto animate-pulse">
      <div className="h-4 w-48 bg-surface-container-high mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 bg-surface-container-low h-[640px]" />
        <div className="lg:col-span-5 space-y-6">
          <div className="h-3 w-24 bg-surface-container-high" />
          <div className="h-16 w-full bg-surface-container-high" />
          <div className="h-8 w-32 bg-surface-container-high" />
          <div className="h-40 bg-surface-container-low" />
          <div className="h-16 bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}
