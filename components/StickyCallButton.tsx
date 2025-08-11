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
	const [open, setOpen] = useState(false);
	const [showNudge, setShowNudge] = useState(false);
	const [hideForFooter, setHideForFooter] = useState(false);
	const [hideForModal, setHideForModal] = useState(false);
	const [crispOffset, setCrispOffset] = useState(false);
	const restaurantPhone = phone || bookingData?.restaurant?.contact?.phone || "01223 276027";
	const pathname = usePathname();

	// Marketing copy (button labels) externalized
	const { data: marketing } = useParsedData<MarketingDataParsed>("marketing.json", MarketingDataSchema);
	const btnLabelCall = marketing?.buttons?.callUs || `Call ${restaurantPhone.replace(/\s+/g, " ")}`;
	const btnLabelBook = marketing?.buttons?.bookTable || "Book a Table";
	const btnLabelMenu = marketing?.buttons?.viewMenu || "Takeaway Menu";

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

	// Close menu on window blur
	useEffect(() => {
		const close = () => setOpen(false);
		window.addEventListener("blur", close);
		return () => window.removeEventListener("blur", close);
	}, []);

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
			className={`fixed z-[55] right-4 sm:right-6 pointer-events-none print:hidden transition-opacity duration-300 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
			style={{
				paddingBottom: "env(safe-area-inset-bottom)",
				bottom: crispOffset ? "7.5rem" : "1rem",
			}}
			aria-live="polite"
			aria-hidden={hidden}
		>
			{/* Expanded actions */}
			<AnimatePresence>
				{open && (
					<motion.ul
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 12 }}
						transition={{ type: "spring", stiffness: 300, damping: 24 }}
						className="mb-3 flex flex-col gap-2 pointer-events-auto"
					>
						<li>
							<a
								href={formatTelHref(restaurantPhone)}
								className="group flex items-center gap-3 rounded-full pl-4 pr-5 py-3 shadow-md bg-crown-gold text-crown-dark text-sm font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-crown-gold/40 hover:brightness-105 active:scale-[0.97] transition touch-target"
								onClick={() => {
									track("call_click", { phone: restaurantPhone });
									setOpen(false);
								}}
								data-analytics-event="fab_call_click"
								data-analytics-phone={restaurantPhone}
							>
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-crown-dark/10 text-lg">📞</span>
								<span>{btnLabelCall}</span>
							</a>
						</li>
						<li>
							<button
								type="button"
								onClick={() => {
									track("book_click");
									window.dispatchEvent(new CustomEvent("open-booking-modal"));
									setOpen(false);
								}}
								className="group flex items-center gap-3 rounded-full pl-4 pr-5 py-3 shadow-md bg-white text-crown-slate text-sm font-semibold border border-crown-gold/50 hover:bg-crown-cream focus:outline-none focus-visible:ring-4 focus-visible:ring-crown-gold/40 active:scale-[0.97] transition touch-target"
								data-analytics-event="fab_book_click"
							>
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-crown-gold/15 text-lg">🗓️</span>
								<span>{btnLabelBook}</span>
							</button>
						</li>
						<li>
							<a
								href="/menu"
								className="group flex items-center gap-3 rounded-full pl-4 pr-5 py-3 shadow-md bg-crown-red text-white text-sm font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-crown-red/40 hover:brightness-110 active:scale-[0.97] transition touch-target"
								onClick={() => {
									track("takeaway_click");
									setOpen(false);
								}}
								data-analytics-event="fab_takeaway_click"
							>
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg">🥡</span>
								<span>{btnLabelMenu}</span>
							</a>
						</li>
					</motion.ul>
				)}
			</AnimatePresence>

			{/* FAB */}
			<div className="relative pointer-events-auto">
				<AnimatePresence>
					{showNudge && !open && (
						<motion.div
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 6 }}
							className="absolute right-20 bottom-1 hidden sm:block"
						>
							<div className="bg-crown-dark text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg max-w-[140px] leading-snug">
								Tap here to book or call
								<div className="absolute -right-2 top-3 w-3 h-3 rotate-45 bg-crown-dark" />
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.button
					type="button"
					onClick={() => setOpen((o) => !o)}
					aria-label={open ? "Close quick actions" : "Open booking and call actions"}
							className={`group relative flex items-center justify-center rounded-full h-16 w-16 shadow-xl bg-crown-gold text-crown-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-crown-gold/40 hover:brightness-105 active:scale-95 transition ${open ? "ring-2 ring-crown-gold/50" : ""}`}
							data-analytics-event={open ? "fab_close" : "fab_open"}
							onMouseEnter={() => !open && track("fab_hover")}
				>
					<motion.span
						key={open ? "close" : "phone"}
						initial={{ scale: 0.4, opacity: 0, rotate: -90 }}
						animate={{ scale: 1, opacity: 1, rotate: 0 }}
						exit={{ scale: 0.4, opacity: 0, rotate: 90 }}
						transition={{ type: "spring", stiffness: 400, damping: 30 }}
						className="text-2xl"
						aria-hidden
					>
						{open ? "✕" : "📞"}
					</motion.span>
					<span className="sr-only">{open ? "Close actions" : "Open actions"}</span>
					{/* Subtle pulse */}
					{!open && (
						<span className="absolute inset-0 rounded-full animate-pulse-slow bg-crown-gold/30 pointer-events-none mix-blend-overlay" aria-hidden />
					)}
				</motion.button>
			</div>
		</div>
	);
}

// Tailwind plugin not guaranteed to have custom pulse, add utility via global CSS if missing.
