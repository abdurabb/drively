"use client";

import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

type OtpCodeInputsProps = {
  value: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
};

export function OtpCodeInputs({
  value,
  onChange,
  disabled,
}: OtpCodeInputsProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleDigitChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (!pasted) {
      return;
    }

    const next = [...value];
    for (let i = 0; i < 6; i += 1) {
      next[i] = pasted[i] || "";
    }
    onChange(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  return (
    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
      {value.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoFocus={idx === 0}
          value={digit}
          disabled={disabled}
          onChange={(event) => handleDigitChange(idx, event.target.value)}
          onKeyDown={(event) => handleKeyDown(idx, event)}
          onPaste={idx === 0 ? handlePaste : undefined}
          className="h-12 w-11 rounded-xl border border-gray-200 bg-white text-center text-lg font-bold text-gray-900 shadow-xs outline-none transition focus:border-[#f5b544] focus:ring-4 focus:ring-[#f5b544]/15 sm:h-12 sm:w-12"
        />
      ))}
    </div>
  );
}
