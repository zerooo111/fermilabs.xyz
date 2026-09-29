// Dithered mesh gradient for cards on hover: a few soft blobs drift across the
// card and blend into each other, breathing gently, with the first blob drawn
// toward the pointer. Rendered at low resolution behind the card's content
// and only animated while hovered.

const BAYER = [
	0, 48, 12, 60, 3, 51, 15, 63, 32, 16, 44, 28, 35, 19, 47, 31, 8, 56, 4, 52,
	11, 59, 7, 55, 40, 24, 36, 20, 43, 27, 39, 23, 2, 50, 14, 62, 1, 49, 13, 61,
	34, 18, 46, 30, 33, 17, 45, 29, 10, 58, 6, 54, 9, 57, 5, 53, 42, 26, 38, 22,
	41, 25, 37, 21,
].map((v) => (v + 0.5) / 64);

// Transparent, then two tones only a shade above the card background
// (#185038) so the hover stays subtle behind text
const TONES = [null, [31, 93, 65], [39, 106, 74]];

const CELL = 3; // CSS pixels per dither cell

// Each blob wanders on its own slow Lissajous path (positions are 0..1 of the
// card); weights and radii vary so the mesh never looks symmetric
const BLOBS = [
	{ fx: 0.011, fy: 0.008, phase: 0.0, radius: 0.24, weight: 1 },
	{ fx: 0.007, fy: 0.012, phase: 2.1, radius: 0.2, weight: 0.85 },
	{ fx: 0.013, fy: 0.006, phase: 4.2, radius: 0.16, weight: 0.8 },
	{ fx: 0.005, fy: 0.01, phase: 5.3, radius: 0.26, weight: 0.7 },
];

function attach(card) {
	// Created on first hover so cards that are never hovered cost nothing
	let canvas;
	let ctx;
	let w = 0;
	let h = 0;
	let image;
	let frameId = 0;
	let time = 0;
	let amp = 0; // eased 0..1 intensity
	let hovered = false;
	let px = 0;
	let py = 0;
	let client = null; // latest pointer position, resolved once per frame
	// Where the pointer-led blob currently sits, eased toward the pointer
	let lead = { x: 0.5, y: 0.5 };

	function size(rect) {
		if (!canvas) {
			canvas = document.createElement("canvas");
			canvas.className = "dither-hover-canvas";
			canvas.setAttribute("aria-hidden", "true");
			card.prepend(canvas);
			card.classList.add("has-dither-canvas");
			ctx = canvas.getContext("2d");
		}
		const nw = Math.max(1, Math.ceil(rect.width / CELL));
		const nh = Math.max(1, Math.ceil(rect.height / CELL));
		if (nw === w && nh === h) return;
		w = nw;
		h = nh;
		canvas.width = w;
		canvas.height = h;
		image = ctx.createImageData(w, h);
	}

	// Layout is read here, at the start of the frame, never in event handlers
	function track() {
		const rect = card.getBoundingClientRect();
		size(rect);
		if (client) {
			px = (client.x - rect.left) / CELL;
			py = (client.y - rect.top) / CELL;
		}
	}

	function render() {
		const data = image.data;
		const levels = TONES.length - 1;
		const breathe = 0.78 + 0.22 * Math.sin(time * 0.045);
		const span = Math.max(w, h);

		// Blob centres and falloffs for this frame, in cells
		lead.x += (px / w - lead.x) * 0.04;
		lead.y += (py / h - lead.y) * 0.04;
		const blobs = BLOBS.map((b, i) => {
			const bx = i === 0 ? lead.x : 0.5 + 0.4 * Math.sin(time * b.fx + b.phase);
			const by =
				i === 0 ? lead.y : 0.5 + 0.4 * Math.cos(time * b.fy + b.phase * 1.3);
			const r = b.radius * span;
			return { x: bx * w, y: by * h, inv: 1 / (r * r), weight: b.weight };
		});

		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				let mesh = 0;
				for (const b of blobs) {
					const dx = x - b.x;
					const dy = y - b.y;
					mesh += b.weight * Math.exp(-(dx * dx + dy * dy) * b.inv);
				}
				// A light base so the whole card glows between the blobs
				const v = Math.min(1, amp * breathe * (0.1 + mesh * 0.7)) * levels;
				const base = Math.floor(v);
				const tone = Math.min(
					levels,
					base + (v - base > BAYER[(y & 7) * 8 + (x & 7)] ? 1 : 0),
				);
				const o = (y * w + x) * 4;
				const c = TONES[tone];
				if (c) {
					data[o] = c[0];
					data[o + 1] = c[1];
					data[o + 2] = c[2];
					data[o + 3] = 255;
				} else {
					data[o + 3] = 0;
				}
			}
		}
		ctx.putImageData(image, 0, 0);
	}

	function loop() {
		track();
		time += 1;
		amp += ((hovered ? 1 : 0) - amp) * 0.12;
		render();
		if (!hovered && amp < 0.01) {
			amp = 0;
			ctx.clearRect(0, 0, w, h);
			frameId = 0;
			return;
		}
		frameId = requestAnimationFrame(loop);
	}

	card.addEventListener("pointerenter", (e) => {
		if (e.pointerType === "touch") return;
		client = { x: e.clientX, y: e.clientY };
		hovered = true;
		if (frameId) return;
		frameId = requestAnimationFrame(() => {
			// Start the lead blob under the pointer rather than easing in from centre
			track();
			lead = { x: px / w, y: py / h };
			loop();
		});
	});
	card.addEventListener("pointermove", (e) => {
		client = { x: e.clientX, y: e.clientY };
	});
	card.addEventListener("pointerleave", () => {
		hovered = false;
	});
}

export function initDitherHover(selector) {
	for (const card of document.querySelectorAll(selector)) attach(card);
}
