export function PropertyCardSkeleton() {
  return (
    <div className="bg-white border border-[rgba(233,231,226,0.5)] shadow-sm overflow-hidden flex flex-col">
      {/* Image */}
      <div className="h-[130px] md:h-[260px] bg-[#e9e7e2] animate-pulse shrink-0" />

      {/* Content */}
      <div className="flex flex-col gap-[8px] p-[10px] md:p-[20px] flex-1">
        {/* Title */}
        <div className="flex flex-col gap-[6px]">
          <div className="h-[18px] w-full bg-[#e9e7e2] animate-pulse" />
          <div className="h-[18px] w-3/4 bg-[#e9e7e2] animate-pulse" />
          {/* Zone */}
          <div className="h-[14px] w-[100px] bg-[#e9e7e2] animate-pulse mt-[2px]" />
        </div>

        {/* Stats */}
        <div className="flex gap-3 pt-1">
          <div className="h-[16px] w-[50px] bg-[#e9e7e2] animate-pulse" />
          <div className="h-[16px] w-[50px] bg-[#e9e7e2] animate-pulse" />
          <div className="h-[16px] w-[55px] bg-[#e9e7e2] animate-pulse" />
        </div>

        {/* Price */}
        <div className="pt-[8px] flex flex-col gap-[5px]">
          <div className="h-[24px] w-[130px] bg-[#e9e7e2] animate-pulse" />
          <div className="h-[14px] w-[80px] bg-[#e9e7e2] animate-pulse" />
        </div>

        <div className="flex-1" />

        {/* Buttons */}
        <div className="flex flex-col gap-[8px] md:flex-row md:gap-2 pt-[8px]">
          <div className="w-full h-[42px] bg-[#e9e7e2] animate-pulse" />
          <div className="w-full h-[42px] bg-[#e9e7e2] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
