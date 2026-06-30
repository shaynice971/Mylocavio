export default function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M14 3L2 12h3v13h7v-8h4v8h7V12h3L14 3z"
          fill="#2A9FD6"
        />
      </svg>
      <span className="text-xl font-bold text-[#1a1a1a]">mylocavio</span>
    </span>
  );
}
