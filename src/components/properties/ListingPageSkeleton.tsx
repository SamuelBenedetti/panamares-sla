import { PropertyGridSkeleton } from "./PropertyCardSkeleton";

export default function ListingPageSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="bg-[#0c1834] px-[30px] xl:px-[20px] 2xl:px-[120px] pt-[120px] xl:pt-[160px] pb-[60px] xl:pb-[80px]">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-[20px]">
          <div className="h-[12px] w-[200px] bg-white/10 animate-pulse" />
          <div className="flex flex-col gap-[10px]">
            <div className="h-[52px] w-[420px] max-w-full bg-white/10 animate-pulse" />
          </div>
          <div className="h-[18px] w-[340px] max-w-full bg-white/10 animate-pulse" />
          <div className="h-[14px] w-[80px] bg-white/10 animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="bg-[#f9f9f9] py-[40px] xl:py-[60px]">
        {/* Count + sort row */}
        <div className="px-[30px] xl:px-[20px] 2xl:px-[120px] mb-[20px]">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="h-[16px] w-[180px] bg-[#e9e7e2] animate-pulse" />
            <div className="h-[36px] w-[160px] bg-[#e9e7e2] animate-pulse" />
          </div>
        </div>

        {/* Sidebar + grid */}
        <div className="px-[30px] xl:px-[20px] 2xl:px-[120px]">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[309px_1fr] gap-8 items-start">
            {/* Sidebar skeleton */}
            <div className="bg-white border border-[#dfe5ef] p-[21px] flex flex-col gap-[20px]">
              {/* Toggle buttons */}
              <div className="flex flex-col gap-[15px]">
                <div className="h-[20px] w-[160px] bg-[#e9e7e2] animate-pulse" />
                <div className="flex gap-[10px]">
                  <div className="flex-1 h-[40px] bg-[#e9e7e2] animate-pulse" />
                  <div className="flex-1 h-[40px] bg-[#e9e7e2] animate-pulse" />
                </div>
              </div>
              {/* Price range */}
              <div className="flex flex-col gap-[15px]">
                <div className="h-[20px] w-[130px] bg-[#e9e7e2] animate-pulse" />
                <div className="h-[20px] w-full bg-[#e9e7e2] animate-pulse" />
                <div className="flex gap-[15px]">
                  <div className="h-[38px] w-[126px] bg-[#e9e7e2] animate-pulse" />
                  <div className="h-[38px] w-[126px] bg-[#e9e7e2] animate-pulse" />
                </div>
              </div>
              {/* Area range */}
              <div className="flex flex-col gap-[15px]">
                <div className="h-[20px] w-[80px] bg-[#e9e7e2] animate-pulse" />
                <div className="h-[20px] w-full bg-[#e9e7e2] animate-pulse" />
                <div className="flex gap-[15px]">
                  <div className="h-[38px] w-[126px] bg-[#e9e7e2] animate-pulse" />
                  <div className="h-[38px] w-[126px] bg-[#e9e7e2] animate-pulse" />
                </div>
              </div>
              {/* Dropdown */}
              <div className="flex flex-col gap-[15px]">
                <div className="h-[20px] w-[140px] bg-[#e9e7e2] animate-pulse" />
                <div className="h-[40px] w-full bg-[#e9e7e2] animate-pulse" />
              </div>
              {/* Ver más */}
              <div className="h-[36px] w-full bg-[#e9e7e2] animate-pulse" />
            </div>

            {/* Grid */}
            <PropertyGridSkeleton count={9} />
          </div>
        </div>
      </div>
    </div>
  );
}
