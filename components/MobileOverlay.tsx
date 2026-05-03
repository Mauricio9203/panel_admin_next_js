"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileOverlay({ open, onClose }: Props) {
  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 bg-black/40 z-40 md:hidden
        transition-opacity duration-300
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    />
  );
}
