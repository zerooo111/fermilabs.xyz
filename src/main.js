import "./styles.css";

// Set current year
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const reducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
).matches;

// Run work once the browser is idle so it never competes with first paint
const whenIdle = (fn) =>
	"requestIdleCallback" in window
		? requestIdleCallback(fn, { timeout: 2000 })
		: setTimeout(fn, 200);

// Load a module only when its element is near the viewport
const whenNear = (el, fn) => {
	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;
			observer.disconnect();
			fn();
		},
		{ rootMargin: "200px" },
	);
	observer.observe(el);
};

// Each animation loads independently so a slow chunk never holds up another.
// The hero intro is pure CSS (see [data-intro] in styles.css) and needs no JS.
const loadAnimations = () => {
	const canvas = document.getElementById("sequencer");
	if (canvas) {
		whenNear(canvas, () =>
			import("./animations/sequencer.js")
				.then(({ initSequencer }) =>
					initSequencer(canvas, {
						svg: document.getElementById("sequencer-items"),
						reducedMotion,
						lowPower: window.matchMedia("(pointer: coarse)").matches,
					}),
				)
				.catch((error) => console.error("Failed to load sequencer:", error)),
		);
	}

	const logoField = document.getElementById("logo-field");
	if (logoField) {
		whenIdle(() =>
			import("./animations/logo-field.js")
				.then(({ initLogoField }) =>
					initLogoField(logoField, { reducedMotion }),
				)
				.catch((error) => console.error("Failed to load logo field:", error)),
		);
	}

	const cards = document.querySelectorAll(".dither-corner");
	if (
		cards.length &&
		!reducedMotion &&
		window.matchMedia("(hover: hover)").matches
	) {
		whenIdle(() =>
			import("./animations/dither-hover.js")
				.then(({ initDitherHover }) => initDitherHover(".dither-corner"))
				.catch((error) => console.error("Failed to load dither hover:", error)),
		);
	}
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", loadAnimations);
} else {
	loadAnimations();
}

// Analytics loads after the page is interactive; it's ~57KB gzipped
if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
	const initPosthog = () =>
		whenIdle(() =>
			import("posthog-js")
				.then(({ default: posthog }) =>
					posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
						api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
						person_profiles: "identified_only",
						capture_pageview: true,
						capture_pageleave: true,
					}),
				)
				.catch((error) => console.error("Failed to load PostHog:", error)),
		);
	if (document.readyState === "complete") initPosthog();
	else window.addEventListener("load", initPosthog, { once: true });
}

// Web Vitals (dev only)
if (import.meta.env.DEV) {
	import("web-vitals")
		.then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
			onCLS(console.log);
			onINP(console.log);
			onFCP(console.log);
			onLCP(console.log);
			onTTFB(console.log);
		})
		.catch((error) => console.error("Failed to load web-vitals:", error));
}
