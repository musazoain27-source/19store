'use client';

// template.js (unlike layout.js) re-mounts on every navigation, which is
// the officially recommended way to get a smooth per-page transition in
// the Next.js App Router without fighting the router's caching.
export default function Template({ children }) {
  return <div className="animate-pageIn">{children}</div>;
}
