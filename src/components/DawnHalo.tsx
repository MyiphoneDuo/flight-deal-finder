import { cn } from "@/lib/utils";

// Fixed sparkle positions (percent of the halo box) so renders are deterministic.
const SPARKLES: Array<[number, number, number, number]> = [
  // [left, top, size px, delay s]
  [8, 30, 3, 0], [14, 18, 2, 1.2], [22, 8, 3, 2.4], [35, 2, 2, 0.6], [50, -2, 3, 1.8],
  [64, 3, 2, 3], [77, 9, 3, 0.9], [87, 20, 2, 2.1], [93, 34, 3, 3.3], [96, 52, 2, 1.5],
  [91, 70, 3, 0.3], [83, 84, 2, 2.7], [4, 50, 2, 3.6], [6, 68, 3, 1.1], [14, 83, 2, 2.2],
  [26, 12, 2, 3.9], [72, 14, 2, 0.4], [98, 44, 2, 2.9], [2, 40, 2, 1.7], [58, 6, 2, 3.4],
  [42, 4, 2, 2.6], [30, 92, 2, 1.4], [68, 94, 2, 3.1], [88, 60, 2, 0.8],
];

/**
 * Decorative glowing ring with drifting sparkles, echoing the halo around
 * the rising sun in the dawn reference image. Purely presentational.
 */
export function DawnHalo({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute", className)} aria-hidden="true">
      <div className="halo-ring size-full" />
      {SPARKLES.map(([left, top, size, delay]) => (
        <span
          key={`${left}-${top}`}
          className="sparkle"
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
