type NotificationProps = {
  message: string;
  type: "success" | "error";
};

export default function Notification({ message, type }: NotificationProps) {
  return (
    <div
      className={`fixed top-5 right-5 z-50 min-w-[320px] rounded-xl border px-5 py-4 shadow-xl backdrop-blur-sm ${
        type === "success"
          ? "border-green-500 bg-green-500/10 text-green-400"
          : "border-red-500 bg-red-500/10 text-red-400"
      }`}
    >
      <p className="flex items-center justify-center gap-2 text-base font-medium">
        <span>{type === "success" ? "✓" : "⚠"}</span>

        <span>{message}</span>
      </p>
    </div>
  );
}
