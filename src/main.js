import "./styles.css";
import posthog from "posthog-js";

// Initialize PostHog
if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
	posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
		api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
		person_profiles: "identified_only",
		capture_pageview: true,
		capture_pageleave: true,
	});
}

// Set current year
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const reducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
).matches;

// Lazy load animations
const loadAnimations = async () => {
	const canvas = document.getElementById("sequencer");
	if (canvas) {
		try {
			const { initSequencer } = await import("./animations/sequencer.js");
			initSequencer(canvas, {
				svg: document.getElementById("sequencer-items"),
				reducedMotion,
			});
		} catch (error) {
			console.error("Failed to load sequencer:", error);
		}
	}

	const logoField = document.getElementById("logo-field");
	if (logoField) {
		// Not awaited: the source image shouldn't hold up the hero intro
		import("./animations/logo-field.js")
			.then(({ initLogoField }) => initLogoField(logoField, { reducedMotion }))
			.catch((error) => console.error("Failed to load logo field:", error));
	}

	const cards = document.querySelectorAll(".dither-corner");
	if (
		cards.length &&
		!reducedMotion &&
		window.matchMedia("(hover: hover)").matches
	) {
		try {
			const { initDitherHover } = await import("./animations/dither-hover.js");
			initDitherHover(".dither-corner");
		} catch (error) {
			console.error("Failed to load dither hover:", error);
		}
	}

	const intro = document.querySelectorAll("[data-intro]");
	if (intro.length && !reducedMotion) {
		try {
			const { animate } = await import("motion/mini");
			intro.forEach((el, i) => {
				animate(
					el,
					{ opacity: [0, 1], transform: ["translateY(16px)", "none"] },
					{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
				);
			});
		} catch (error) {
			// Never leave the hero hidden if Motion fails to load
			for (const el of intro) el.style.opacity = "1";
			console.error("Failed to load motion:", error);
		}
	}
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", loadAnimations);
} else {
	loadAnimations();
}

// Web Vitals
async function reportWebVitals() {
	try {
		const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import("web-vitals");

		onCLS(console.log);
		onINP(console.log);
		onFCP(console.log);
		onLCP(console.log);
		onTTFB(console.log);
	} catch (error) {
		console.error("Failed to load web-vitals:", error);
	}
}

reportWebVitals();
