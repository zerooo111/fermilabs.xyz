import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export default defineConfig({
	plugins: [tailwindcss()],
	resolve: {
		alias: {
			"@": resolve(fileURLToPath(new URL(".", import.meta.url)), "src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					three: ["three"],
					gsap: ["gsap"],
					posthog: ["posthog-js"],
				},
			},
		},
		minify: true,
	},
});
