type NotificationProps = {
  message: string;
  type: "success" | "error";
};

export default function Notification({ message, type }: NotificationProps) {
  return (
    <div
      className={`fixed top-5 right-5 z-50 min-w-[320px] rounded-2xl border px-5 py-4 shadow-2xl shadow-black/50 ${
        type === "success"
          ? "bg-[#101827] border-green-500/50"
          : "bg-[#101827] border-red-500/50"
      }`}
    >
      <div className="flex items-center justify-center gap-3 text-base font-medium">
        <div
          className={`
      flex
      items-center
      justify-center
      w-8
      h-8
      rounded-full
      ${type === "success" ? "bg-green-500/15" : "bg-red-500/15"}
    `}
        >
          <span
            className={type === "success" ? "text-green-400" : "text-red-400"}
          >
            {type === "success" ? "✓" : "✕"}
          </span>
        </div>

        <span className="text-white font-medium">{message}</span>
      </div>
    </div>
  );
}
