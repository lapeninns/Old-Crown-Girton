"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bookingData from "@/data/restaurant.json"; // contains phone
import { useParsedData } from "@/hooks/useParsedData";
import { MarketingDataSchema, MarketingDataParsed } from "@/lib/schemas";
import config from "@/config";
import { usePathname } from "next/navigation";

// Utility to sanitize phone number for tel: links
const formatTelHref = (raw?: string) =>
	`tel:${(raw || "").replace(/[^+\d]/g, "")}`;

interface StickyCallButtonProps {
	/** Optional override phone */
	phone?: string;
}

/**
 * Floating Action Button (FAB) that expands to quick actions: Call & Book.
 * Mobile-first: large touch targets (min 56px), placed bottom-right (thumb zone),
 * respects safe area insets, accessible via keyboard, reduced-motion friendly.
 */
export default function StickyCallButton({ phone }: StickyCallButtonProps) {
	const [showNudge, setShowNudge] = useState(false);
	const [hideForFooter, setHideForFooter] = useState(false);
	const [hideForModal, setHideForModal] = useState(false);
	const [crispOffset, setCrispOffset] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const restaurantPhone = phone || bookingData?.restaurant?.contact?.phone || "01223 276027";
	const pathname = usePathname();

	// Marketing copy (button labels) externalized
	const { data: marketing } = useParsedData<MarketingDataParsed>("marketing.json", MarketingDataSchema);
	const btnLabelCall = marketing?.buttons?.callUs || `Call ${restaurantPhone.replace(/\s+/g, " ")}`;

	// Routes where FAB should not appear (can't early return before hooks; decide later)
	const excludedRoutes = ["/admin", "/dashboard", "/signin"]; // add more as needed

	// Gentle attention nudge after 6s (once per session)
	useEffect(() => {
		const seen = sessionStorage.getItem("_fab_seen");
		if (!seen) {
			const t = setTimeout(() => {
				setShowNudge(true);
				sessionStorage.setItem("_fab_seen", "1");
				setTimeout(() => setShowNudge(false), 4000);
			}, 6000);
			return () => clearTimeout(t);
		}
	}, []);

	// Track viewport size for responsive behavior (bottom sheet on mobile)
	useEffect(() => {
		const mm = window.matchMedia('(max-width: 640px)');
		const update = () => setIsMobile(mm.matches);
		update();
		mm.addEventListener('change', update);
		return () => mm.removeEventListener('change', update);
	}, []);

	// No menu to close anymore

	// Detect footer intersection to auto-hide (avoid overlap & distraction at conversion zone)
	useEffect(() => {
		const footer = document.querySelector("footer");
		if (!footer || !('IntersectionObserver' in window)) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => setHideForFooter(entry.isIntersecting));
			},
			{ rootMargin: "0px 0px -40% 0px", threshold: [0, 0.01] }
		);
		observer.observe(footer);
		return () => observer.disconnect();
	}, []);

	// Listen for booking modal open/close events
	useEffect(() => {
		const openHandler = () => setHideForModal(true);
		const closeHandler = () => setHideForModal(false);
		window.addEventListener("booking-modal-open", openHandler);
		window.addEventListener("booking-modal-close", closeHandler);
		return () => {
			window.removeEventListener("booking-modal-open", openHandler);
			window.removeEventListener("booking-modal-close", closeHandler);
		};
	}, []);

	// Detect Crisp widget presence to adjust offset (avoid overlap)
	useEffect(() => {
		if (!config?.crisp?.id) return; // Crisp not configured
		const check = () => {
			const el = document.querySelector(".crisp-client");
			if (el) {
				const style = window.getComputedStyle(el as HTMLElement);
				setCrispOffset(style.display !== "none");
			}
		};
		check();
		const mo = new MutationObserver(check);
		mo.observe(document.documentElement, { childList: true, subtree: true });
		return () => mo.disconnect();
	}, []);

	// Helper: generic analytics dispatcher
	const track = (action: string, meta: Record<string, any> = {}) => {
		// dataLayer (GTM) support
		if ((window as any).dataLayer) {
			(window as any).dataLayer.push({ event: "fab_action", action, ...meta });
		}
		// Custom event fallback
		window.dispatchEvent(new CustomEvent("fab-analytics", { detail: { action, ...meta } }));
	};

	const hidden = hideForFooter || hideForModal;

	if (excludedRoutes.some((r) => pathname?.startsWith(r))) return null;
	return (
		<div
			className={`fixed z-[55] pointer-events-none print:hidden transition-opacity duration-300 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
			style={{
				paddingBottom: "env(safe-area-inset-bottom)",
				right: isMobile ? undefined : '1rem',
				bottom: crispOffset ? "7.5rem" : "1rem",
				left: isMobile ? 0 : undefined,
			}}
			aria-live="polite"
			aria-hidden={hidden}
		>
			{/* No expanded actions — single call FAB only */}

			{/* FAB */}
			<div className={`relative pointer-events-auto ${isMobile ? 'mx-4' : ''}`}>
				<AnimatePresence>
					{showNudge && (
						<motion.div
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 6 }}
							className="absolute right-20 bottom-1 hidden sm:block"
						>
							<div className="bg-crown-dark text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg max-w-[140px] leading-snug">
								Tap to call us
								<div className="absolute -right-2 top-3 w-3 h-3 rotate-45 bg-crown-dark" />
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.a
					href={formatTelHref(restaurantPhone)}
					aria-label={btnLabelCall}
					className={`group relative flex items-center justify-center rounded-full h-14 w-14 sm:h-16 sm:w-16 shadow-xl bg-crown-gold text-crown-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-crown-gold/40 hover:brightness-105 active:scale-95 transition`}
					data-analytics-event="fab_call_click"
					onClick={() => track("call_click", { phone: restaurantPhone })}
				>
					<motion.span
						initial={{ scale: 0.4, opacity: 0, rotate: -90 }}
						animate={{ scale: 1, opacity: 1, rotate: 0 }}
						transition={{ type: "spring", stiffness: 400, damping: 30 }}
						className="text-2xl"
						aria-hidden
					>
						📞
					</motion.span>
					<span className="sr-only">{btnLabelCall}</span>
					<span className="absolute inset-0 rounded-full animate-pulse-slow bg-crown-gold/30 pointer-events-none mix-blend-overlay" aria-hidden />
				</motion.a>
			</div>
		</div>
	);
}

// Tailwind plugin not guaranteed to have custom pulse, add utility via global CSS if missing.
