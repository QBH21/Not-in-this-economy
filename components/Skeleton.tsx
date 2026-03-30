export function CardSkeleton() {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
      <div className="skeleton h-44" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 rounded-full w-3/4" />
        <div className="skeleton h-3 rounded-full w-1/2" />
        <div className="skeleton h-6 rounded-full w-1/3" />
        <div className="flex gap-2 mt-3">
          <div className="skeleton h-9 rounded-xl flex-1" />
          <div className="skeleton h-9 rounded-xl w-16" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="skeleton h-5 rounded-full w-40" />
        <div className="skeleton h-4 rounded-full w-20" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="skeleton h-5 w-5 rounded" />
          <div className="skeleton h-4 rounded-full flex-1" />
          <div className="skeleton h-4 rounded-full w-16" />
        </div>
      ))}
    </div>
  );
}
