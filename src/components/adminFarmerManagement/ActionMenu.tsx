import { useEffect, useRef, useState } from "react";
import { MdBlock, MdCheckCircle, MdMoreVert } from "react-icons/md";

// ── Action dropdown ───────────────────────────────────────────────────────────
interface ActionMenuProps {
  userId: string;
  currentStatus: Status;
  onAction: (userId: string, action: "activate" | "suspend") => Promise<void>;
}

type Status = "Active" | "Pending" | "Suspended";

export default function ActionMenu({
  userId,
  currentStatus,
  onAction,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function handleAction(action: "activate" | "suspend") {
    setBusy(true);
    setOpen(false);
    await onAction(userId, action);
    setBusy(false);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        disabled={busy}
        className="text-[#5e9a4c] hover:text-[#111b0d] transition-colors p-1 rounded hover:bg-gray-100 disabled:opacity-40"
      >
        <MdMoreVert className="text-xl" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-[#d5e7cf] bg-white shadow-lg py-1">
          <button
            onClick={() => handleAction("activate")}
            disabled={currentStatus === "Active"}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <MdCheckCircle className="text-base shrink-0" />
            Activate Producer
          </button>
          <button
            onClick={() => handleAction("suspend")}
            disabled={currentStatus === "Suspended"}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <MdBlock className="text-base shrink-0" />
            Suspend Producer
          </button>
        </div>
      )}
    </div>
  );
}
