"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Toaster, ToastBar, type Toast } from 'react-hot-toast';
import { motion, useReducedMotion } from 'framer-motion';

export function NotificationToaster() {
  const prefersReduced = useReducedMotion();
  const [liveMsg, setLiveMsg] = useState('');
  const liveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!liveRef.current && typeof document !== 'undefined') {
      const el = document.getElementById('sr-live-region') as HTMLDivElement | null;
      if (el) liveRef.current = el;
    }
  }, []);

  const Announce: React.FC<Toast> = (t: Toast) => {
    const text = String(t.message ?? '');
    if (!text) return null;
    // Update local live region (if we render it) and global one if present
    setLiveMsg(text);
    try {
      const el = liveRef.current;
      if (el) {
        el.textContent = '';
        setTimeout(() => (el.textContent = text), 10);
      }
    } catch {}
    return null;
  };

  return (
    <>
      {/* SR live region for toast content (kept in Layout, but add fallback here) */}
      <div id="sr-live-region" role="status" aria-live="polite" aria-atomic="true" className="sr-only absolute" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>{liveMsg}</div>
      <Toaster position="top-right" reverseOrder={false} gutter={8}
        toastOptions={{ duration: 3000 }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <motion.div
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
                animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: prefersReduced ? 0 : 0.22, ease: 'easeOut' }}
                className="px-4 py-3 rounded-lg shadow-lg bg-white text-stout-700 border border-neutral-200"
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <div>{message}</div>
                </div>
                {/* Announce updates to SR */}
                <Announce {...(t as any)} />
              </motion.div>
            )}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}

export default NotificationToaster;
