"use client";

import { useEffect } from "react";

let lockCount = 0;
let initialOverflow = "";

function lockBody() {
  if (lockCount === 0) {
    initialOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

function unlockBody() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = initialOverflow;
  }
}

export default function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    lockBody();
    return unlockBody;
  }, [active]);
}
