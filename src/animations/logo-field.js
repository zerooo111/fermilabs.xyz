// Dithered logo in the hero background. The logo is sampled at low
// resolution and ordered-dithered into a handful of forest and amber tones;
// every lit cell is a particle that the pointer pushes away and a spring
// pulls back home.

const BAYER = [
	0, 48, 12, 60, 3, 51, 15, 63, 32, 16, 44, 28, 35, 19, 47, 31, 8, 56, 4, 52,
	11, 59, 7, 55, 40, 24, 36, 20, 43, 27, 39, 23, 2, 50, 14, 62, 1, 49, 13, 61,
	34, 18, 46, 30, 33, 17, 45, 29, 10, 58, 6, 54, 9, 57, 5, 53, 42, 26, 38, 22,
	41, 25, 37, 21,
].map((v) => (v + 0.5) / 64);

// Darkest first; level 0 is left empty so the page shows through.
const BODY = [
	null,
	[32, 104, 72],
	[46, 138, 104],
	[104, 184, 132],
	[180, 220, 120],
];
const CAP = [
	null,
	[96, 112, 58],
	[196, 170, 84],
	[254, 230, 133],
	[248, 247, 231],
];

const SIZE = 112; // logo cells across
const PAD = 16; // empty cells around the logo so pushed pixels have room
const GRID = SIZE + PAD * 2;
const RADIUS = 18; // cells, pointer influence
const PUSH = 1.4;
const SPRING = 0.05;
const DAMPING = 0.16;
const SCATTER = 22; // cells, how far pixels start from home on load

function smoothstep(a, b, x) {
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
}

function lightness(r, g, b) {
	return (Math.max(r, g, b) + Math.min(r, g, b)) / 510;
}

function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

// Turn the source image into dithered particles with a home cell and colour.
function buildParticles(img) {
	const off = document.createElement("canvas");
	off.width = SIZE;
	off.height = SIZE;
	const octx = off.getContext("2d", { willReadFrequently: true });
	octx.drawImage(img, 0, 0, SIZE, SIZE);
	const { data } = octx.getImageData(0, 0, SIZE, SIZE);

	const particles = [];
	for (let y = 0; y < SIZE; y++) {
		for (let x = 0; x < SIZE; x++) {
			const i = (y * SIZE + x) * 4;
			if (data[i + 3] < 128) continue;
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			const cap = r - b > 25;
			const l = lightness(r, g, b);

			// Stretch each region's lightness to the full range for contrast
			let v = cap ? (l - 0.62) / 0.3 : (l - 0.1) / 0.62;
			v = Math.min(1, Math.max(0, v)) ** 1.15;

			// Fade out toward the bottom left, where it meets the headline
			const fx = x / SIZE;
			const fy = y / SIZE;
			v *= smoothstep(1.1, 0.3, Math.hypot(fx - 0.85, fy - 0.15));

			const tones = cap ? CAP : BODY;
			const t = v * (tones.length - 1);
			const lo = Math.floor(t);
			const level = t - lo > BAYER[(y % 8) * 8 + (x % 8)] ? lo + 1 : lo;
			const tone = tones[Math.min(level, tones.length - 1)];
			if (!tone) continue;

			particles.push({
				hx: x + PAD,
				hy: y + PAD,
				x: x + PAD,
				y: y + PAD,
				vx: 0,
				vy: 0,
				c: tone,
			});
		}
	}
	return particles;
}

export async function initLogoField(canvas, { reducedMotion = false } = {}) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return () => {};

	const img = await loadImage("/dither/logo-src.png");
	const particles = buildParticles(img);
	canvas.width = GRID;
	canvas.height = GRID;
	const image = ctx.createImageData(GRID, GRID);
	const px = image.data;

	function render() {
		px.fill(0);
		for (const p of particles) {
			const x = Math.round(p.x);
			const y = Math.round(p.y);
			if (x < 0 || y < 0 || x >= GRID || y >= GRID) continue;
			const i = (y * GRID + x) * 4;
			px[i] = p.c[0];
			px[i + 1] = p.c[1];
			px[i + 2] = p.c[2];
			px[i + 3] = 255;
		}
		ctx.putImageData(image, 0, 0);
	}

	if (reducedMotion) {
		render();
		return () => {};
	}

	// Start scattered and let the springs assemble the logo
	for (const p of particles) {
		const a = Math.random() * Math.PI * 2;
		const d = Math.random() * SCATTER;
		p.x += Math.cos(a) * d;
		p.y += Math.sin(a) * d;
	}

	let pointer = null;
	let frameId = 0;
	let running = false;
	let visible = true;

	function step() {
		let energy = 0;
		for (const p of particles) {
			if (pointer) {
				const dx = p.x - pointer.x;
				const dy = p.y - pointer.y;
				const d = Math.hypot(dx, dy);
				if (d < RADIUS && d > 0.001) {
					const f = (1 - d / RADIUS) ** 2 * PUSH;
					p.vx += (dx / d) * f;
					p.vy += (dy / d) * f;
				}
			}
			p.vx = (p.vx + (p.hx - p.x) * SPRING) * (1 - DAMPING);
			p.vy = (p.vy + (p.hy - p.y) * SPRING) * (1 - DAMPING);
			p.x += p.vx;
			p.y += p.vy;
			energy += Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y);
		}
		return energy;
	}

	function loop() {
		const energy = step();
		render();
		// Sleep once everything is home and the pointer is away
		if (!pointer && energy < particles.length * 0.02) {
			for (const p of particles) {
				p.x = p.hx;
				p.y = p.hy;
				p.vx = 0;
				p.vy = 0;
			}
			render();
			running = false;
			return;
		}
		frameId = requestAnimationFrame(loop);
	}

	function wake() {
		if (running || !visible) return;
		running = true;
		frameId = requestAnimationFrame(loop);
	}

	// The canvas sits behind the hero text, so listen on the whole section
	const area = canvas.closest("section") ?? canvas.parentElement;
	function onPointerMove(e) {
		const rect = canvas.getBoundingClientRect();
		const cell = rect.width / GRID;
		pointer = {
			x: (e.clientX - rect.left) / cell,
			y: (e.clientY - rect.top) / cell,
		};
		wake();
	}
	function onPointerLeave() {
		pointer = null;
	}

	const observer = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		if (visible) wake();
		else {
			cancelAnimationFrame(frameId);
			running = false;
		}
	});
	observer.observe(canvas);
	area.addEventListener("pointermove", onPointerMove);
	area.addEventListener("pointerleave", onPointerLeave);
	render();
	wake();

	return () => {
		cancelAnimationFrame(frameId);
		observer.disconnect();
		area.removeEventListener("pointermove", onPointerMove);
		area.removeEventListener("pointerleave", onPointerLeave);
	};
}
