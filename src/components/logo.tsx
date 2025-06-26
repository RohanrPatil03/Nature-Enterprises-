import { cn } from "@/lib/utils";

export function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <div className={cn("flex items-center font-headline font-bold text-xl group", { "gap-3": showText })} aria-label="Nature Enterprises">
      <div className="p-2 bg-primary text-primary-foreground rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-110">
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2V4M12 20V22M4.92969 4.92969L6.33969 6.33969M17.6504 17.6504L19.0604 19.0604M2 12H4M20 12H22M4.92969 19.0604L6.33969 17.6504M17.6504 6.33969L19.0604 4.92969"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 15C12 15 14 14 15 12C16 10 12 6 12 6C12 6 8 10 9 12C10 14 12 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showText && <span className="group-data-[state=collapsed]:hidden">Nature Enterprises</span>}
    </div>
  )
}
