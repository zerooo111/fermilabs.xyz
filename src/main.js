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
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const menuLines = document.querySelectorAll(".menu-line-1, .menu-line-2, .menu-line-3");

let isMobileMenuOpen = false;

mobileMenuBtn?.addEventListener("click", () => {
	isMobileMenuOpen = !isMobileMenuOpen;

	if (isMobileMenuOpen) {
		mobileMenu.classList.remove("hidden");
		menuLines[0].classList.add("rotate-45", "translate-y-1.5");
		menuLines[1].classList.add("opacity-0");
		menuLines[2].classList.add("-rotate-45", "-translate-y-1.5");
	} else {
		mobileMenu.classList.add("hidden");
		menuLines[0].classList.remove("rotate-45", "translate-y-1.5");
		menuLines[1].classList.remove("opacity-0");
		menuLines[2].classList.remove("-rotate-45", "-translate-y-1.5");
	}
});

// Close mobile menu when clicking a link
mobileMenu?.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", () => {
		isMobileMenuOpen = false;
		mobileMenu.classList.add("hidden");
		menuLines[0].classList.remove("rotate-45", "translate-y-1.5");
		menuLines[1].classList.remove("opacity-0");
		menuLines[2].classList.remove("-rotate-45", "-translate-y-1.5");
	});
});

// Lazy load animations
const loadAnimations = async () => {
	try {
		const { initDither } = await import("./animations/dither.js");
		const { initDecrypt } = await import("./animations/decrypt.js");

		// Initialize dither background
		initDither("dither-bg");

		// Initialize decrypt animation on hero text
		// Animation triggers on first render and repeats every 5 seconds
		initDecrypt(".hero-decrypt", {
			speed: 100, // Time between character updates in ms
			sequential: true, // Reveal one character at a time
			revealDirection: "start", // Reveal from start to end
			useOriginalCharsOnly: false, // Use random characters
			characters:
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
			encryptedClass: "text-rock/50", // Encrypted character styling
			revealedClass: "", // Revealed character styling (uses default)
			repeatInterval: 5000, // Repeat every 5 seconds
		});
	} catch (error) {
		console.error("Failed to load animations:", error);
	}
};

// Load animations when page is loaded
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
