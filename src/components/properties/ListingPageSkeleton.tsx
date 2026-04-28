import { PropertyGridSkeleton } from "./PropertyCardSkeleton";

export default function ListingPageSkeleton() {
  return (
    <div className="bg-[#f9f9f9]">

      {/* Header skeleton — mismo patrón que ListingPageHeader */}
      <div className="px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[32px] xl:pt-[40px] pb-[20px] xl:pb-[28px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[16px]">

          {/* Breadcrumb */}
          <div className="flex items-center gap-[8px]">
            <div className="h-[16px] w-[36px] bg-[#e9e7e2] animate-pulse" />
            <div className="h-[12px] w-[8px] bg-[#e9e7e2] animate-pulse" />
            <div className="h-[16px] w-[160px] bg-[#e9e7e2] animate-pulse" />
          </div>

          {/* H1 + contador */}
          <div className="flex flex-col gap-[8px]">
            <div className="h-[52px] w-[380px] max-w-full bg-[#e9e7e2] animate-pulse" />
            <div className="h-[14px] w-[220px] bg-[#e9e7e2] animate-pulse" />
          </div>

          {/* SEO block */}
          <div className="flex flex-col gap-[6px] max-w-[600px]">
            <div className="h-[14px] w-full bg-[#e9e7e2] animate-pulse" />
            <div className="h-[14px] w-5/6 bg-[#e9e7e2] animate-pulse" />
            <div className="h-[14px] w-4/6 bg-[#e9e7e2] animate-pulse" />
          </div>

        </div>
      </div>

      {/* Sort row */}
      <div className="px-[30px] xl:px-[60px] 2xl:px-[160px] mb-[20px]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-end">
          <div className="h-[36px] w-[160px] bg-[#e9e7e2] animate-pulse" />
        </div>
      </div>

      {/* Sidebar + grid */}
      <div className="px-[30px] xl:px-[60px] 2xl:px-[160px] pb-[60px] xl:pb-[80px]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[309px_1fr] gap-8 items-start">

          {/* Sidebar skeleton */}
          <div className="bg-white border border-[#dfe5ef] p-[21px] flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[15px]">
              <div className="h-[16px] w-[140px] bg-[#e9e7e2] animate-pulse" />
              <div className="flex gap-[10px]">
                <div className="flex-1 h-[40px] bg-[#e9e7e2] animate-pulse" />
                <div className="flex-1 h-[40px] bg-[#e9e7e2] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col gap-[12px]">
              <div className="h-[16px] w-[110px] bg-[#e9e7e2] animate-pulse" />
              <div className="h-[4px] w-full bg-[#e9e7e2] animate-pulse rounded-full" />
              <div className="flex gap-[12px]">
                <div className="h-[38px] flex-1 bg-[#e9e7e2] animate-pulse" />
                <div className="h-[38px] flex-1 bg-[#e9e7e2] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col gap-[12px]">
              <div className="h-[16px] w-[80px] bg-[#e9e7e2] animate-pulse" />
              <div className="h-[4px] w-full bg-[#e9e7e2] animate-pulse rounded-full" />
              <div className="flex gap-[12px]">
                <div className="h-[38px] flex-1 bg-[#e9e7e2] animate-pulse" />
                <div className="h-[38px] flex-1 bg-[#e9e7e2] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col gap-[12px]">
              <div className="h-[16px] w-[120px] bg-[#e9e7e2] animate-pulse" />
              <div className="h-[40px] w-full bg-[#e9e7e2] animate-pulse" />
            </div>
            <div className="h-[36px] w-full bg-[#e9e7e2] animate-pulse" />
          </div>

          {/* Grid */}
          <PropertyGridSkeleton count={9} />
        </div>
      </div>

    </div>
  );
}
