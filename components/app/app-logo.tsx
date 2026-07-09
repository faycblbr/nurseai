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
          "relative grid shrink-0 place-items-center overflow-hidden rounded-lg border border-white/30 bg-[var(--logo-bg)] shadow-lg shadow-[color:var(--shadow-soft)]",
          sizes[size]
        )}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.72),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.32),transparent_48%)]" />
        <svg viewBox="0 0 64 64" className="relative h-[82%] w-[82%]" role="img">
          <path
            d="M14.8 33.4C11.1 22.2 22 12.3 31.9 23.9C40.8 11.8 55.1 17.4 53.3 31.3C51.8 43.3 40.5 50.7 32 54.8C23.5 50.7 16.9 43.8 14.8 33.4Z"
            fill="none"
            stroke="var(--logo-line)"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M14.7 31.4C13.6 21.2 24.4 15.6 32 27.2C39.8 15.2 52.8 18.2 52.2 30.6C51.6 42.6 39.8 48.8 32 53C24.4 48.9 15.8 41.9 14.7 31.4Z"
            fill="none"
            stroke="var(--logo-violet)"
            strokeWidth="6.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.2 37.1C17.7 39.4 25.1 43.7 31.9 54.4C24.4 52.7 16.2 48.3 11.4 40.6C10.5 39.1 9.9 36.6 11.2 37.1Z"
            fill="var(--logo-teal)"
            stroke="var(--logo-line)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M52.8 37.1C46.3 39.4 38.9 43.7 32.1 54.4C39.6 52.7 47.8 48.3 52.6 40.6C53.5 39.1 54.1 36.6 52.8 37.1Z"
            fill="var(--logo-teal)"
            stroke="var(--logo-line)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M47.4 12.6v15.7M39.6 20.4h15.7"
            fill="none"
            stroke="var(--logo-line)"
            strokeWidth="8.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M47.4 12.6v15.7M39.6 20.4h15.7"
            fill="none"
            stroke="var(--logo-teal)"
            strokeWidth="6.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
