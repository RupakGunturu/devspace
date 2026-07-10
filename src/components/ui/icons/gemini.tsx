export default function Gemini({ className, ...props }: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C12 2 14 10 14 12C14 14 12 22 12 22C12 22 10 14 10 12C10 10 12 2 12 2Z"
        fill="url(#gemini-grad)"
      />
      <path
        d="M2 12C2 12 10 10 12 10C14 10 22 12 22 12C22 12 14 14 12 14C10 14 2 12 2 12Z"
        fill="url(#gemini-grad)"
      />
    </svg>
  );
}
