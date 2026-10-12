import React from "react";

const Tag = ({ children, tone = "default", className = "" }) => {
  const tones = {
    default: "border-[#EAE5D9] bg-[#FDFBF7] text-[#7A1A2E]",
    secondary: "border-[#EAE5D9] bg-[#FDFBF7] text-[#D4A373]",
    inverse: "border-[#7A1A2E] bg-[#7A1A2E] text-[#FDFBF7]"
  };
  return (
    <span className={`inline-flex items-center border px-3 py-1 font-sans text-[10px] uppercase tracking-[0.22em] ${tones[tone] || tones.default} ${className}`}>
      {children}
    </span>
  );
};

export default Tag;