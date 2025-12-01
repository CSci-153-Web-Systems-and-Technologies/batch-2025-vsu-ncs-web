"use client";

import { useState } from "react";

export function CurrentYear() {
  // We calculate the year immediately in the client component's state.
  const [year] = useState(new Date().getFullYear());
  
  // This will render the correct year in the browser.
  return <>{year}</>;
}