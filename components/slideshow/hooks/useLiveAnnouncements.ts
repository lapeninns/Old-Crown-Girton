"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

type Politeness = "polite" | "assertive" | "off";

interface Options {
  politeness?: Politeness;
  ariaAtomic?: boolean;
  delayMs?: number;
}

/* eslint-disable no-unused-vars */
type AnnouncementOptions = { politeness?: Politeness; delayMs?: number };
type AnnounceFn = (message: string, options?: AnnouncementOptions) => void;
/* eslint-enable no-unused-vars */

export interface LiveAnnouncement {
  announce: AnnounceFn;
  liveRegionProps: {
    id: string;
    role: "status";
    "aria-live": Politeness;
    "aria-atomic": boolean;
    className: string;
  };
  currentMessage: string;
}

/**
 * Lightweight hook for managing a dedicated live region for the slideshow.
 * Avoids double announcements by clearing the region before updating.
 */
export function useLiveAnnouncements(options: Options = {}): LiveAnnouncement {
  const defaultPoliteness = options.politeness ?? "polite";
  const defaultDelay = options.delayMs ?? 30;
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const id = useId();

  const announce = useCallback<AnnounceFn>(
    (nextMessage, announceOptions) => {
      if (!nextMessage) return;
      const delay = announceOptions?.delayMs ?? defaultDelay;
      setMessage("");
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setMessage(nextMessage);
      }, Math.max(0, delay));
    },
    [defaultDelay]
  );

  useEffect(() => () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    announce,
    currentMessage: message,
    liveRegionProps: {
      id: `slideshow-live-region-${id}`,
      role: "status",
      "aria-live": defaultPoliteness,
      "aria-atomic": options.ariaAtomic ?? true,
      className:
        "sr-only absolute w-px h-px -m-px overflow-hidden whitespace-nowrap border-0 p-0"
    }
  };
}

export default useLiveAnnouncements;
