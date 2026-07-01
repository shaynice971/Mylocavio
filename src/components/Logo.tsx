export default function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="#2A9FD6" strokeWidth="2.5" fill="none" />
        <line x1="16.5" y1="16.5" x2="26" y2="26" stroke="#2A9FD6" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="22" x2="24.5" y2="19.5" stroke="#2A9FD6" strokeWidth="2" strokeLinecap="round" />
        <line x1="19.5" y1="24.5" x2="22" y2="22" stroke="#2A9FD6" strokeWidth="2" strokeLinecap="round" />
        <line x1="24.5" y1="24.5" x2="26" y2="23" stroke="#2A9FD6" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className={`text-xl font-bold ${dark ? "text-gray-900" : "text-[#1a1a1a]"}`}>
        myloca<span className="text-[#FF6B35]">vio</span>
      </span>
    </span>
  );
}
