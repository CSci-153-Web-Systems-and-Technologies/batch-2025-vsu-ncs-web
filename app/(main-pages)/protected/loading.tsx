import Image from "next/image";
import { Loader2 } from "lucide-react";
import logo from "@/app/assets/logo.png";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background z-50">
      <div className="relative flex flex-col items-center gap-6 animate-in fade-in duration-500">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 bg-background/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
          <Image
            src={logo}
            alt="VSU NCS Loading"
            width={64}
            height={64}
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-3 z-10">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />

          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-lg tracking-tight text-foreground">
              VSU NCS
            </h3>
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading resources...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
