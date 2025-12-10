import { Skeleton } from "@/components/ui/skeleton";

export default function LandingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="hidden md:block h-6 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-md" />
            <Skeleton className="w-24 h-10 rounded-md" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
                <Skeleton className="h-8 w-64 rounded-full" />

                <div className="space-y-4 w-full flex flex-col items-center lg:items-start">
                  <Skeleton className="h-16 w-3/4" />
                  <Skeleton className="h-16 w-1/2" />
                </div>

                <div className="space-y-2 w-full max-w-2xl">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6 mx-auto lg:mx-0" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start">
                  <Skeleton className="h-12 w-full sm:w-40" />
                  <Skeleton className="h-12 w-full sm:w-40" />
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
                <div className="rounded-2xl border bg-card/50 p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border flex items-center gap-4"
                      >
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 border-y bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center mb-16 space-y-4">
              <Skeleton className="h-10 w-3/4 md:w-1/2" />
              <Skeleton className="h-6 w-2/3 md:w-1/3" />
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              <Skeleton className="h-48 w-full rounded-xl" />{" "}
              <div className="flex justify-center">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-48 w-full rounded-xl" />{" "}
            </div>
          </div>
        </section>

        <section className="py-24 container mx-auto px-6">
          <div className="mb-16">
            <Skeleton className="h-10 w-64 mb-6" />
            <Skeleton className="h-1 w-20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl border h-full">
                <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
