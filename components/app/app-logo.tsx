import Image from "next/image";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
};

const sizes = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14"
};

export function AppLogo({ size = "md", showText = true, className }: AppLogoProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <div
        className={cn(
          "relative grid shrink-0 place-items-center overflow-hidden rounded-lg border border-white/30 bg-[#c1f5ff] shadow-lg shadow-[color:var(--shadow-soft)]",
          sizes[size]
        )}
        aria-hidden
      >
        <Image
          src="/brand/nurseai-mark-512.png"
          alt=""
          fill
          sizes="56px"
          className="object-cover"
          draggable={false}
        />
      </div>
      {showText ? (
        <div className="min-w-0">
          <p className="truncate text-base font-black tracking-normal">NurseAI</p>
          <p className="truncate text-xs font-semibold text-[var(--muted)]">Assistant IFSI premium</p>
        </div>
      ) : null}
    </div>
  );
}
