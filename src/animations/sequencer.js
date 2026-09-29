// Dithered "sequencer" field: unordered transactions drift in from the left,
// queue at a gate, and leave on the right in evenly spaced FIFO lanes.
// The background is rendered at low resolution with an 8x8 Bayer ordered
// dither; the transactions themselves are crisp SVG squares on top.

const BAYER = [
	0, 48, 12, 60, 3, 51, 15, 63, 32, 16, 44, 28, 35, 19, 47, 31, 8, 56, 4, 52,
	11, 59, 7, 55, 40, 24, 36, 20, 43, 27, 39, 23, 2, 50, 14, 62, 1, 49, 13, 61,
	34, 18, 46, 30, 33, 17, 45, 29, 10, 58, 6, 54, 9, 57, 5, 53, 42, 26, 38, 22,
	41, 25, 37, 21,
].map((v) => (v + 0.5) / 64);

// Forest tones, darkest first. The first one matches the page background.
const TONES = [
	[24, 80, 56],
	[34, 98, 66],
	[63, 129, 80],
	[180, 220, 120],
];

const CELL = 3; // CSS pixels per field cell
const MAX_LANES = 5;
const LANE_GAP = 26; // minimum cells between lanes
const GATE = 0.46; // gate position as a fraction of width
const SPACING = 16; // cells between ordered transactions in a lane
const LANE_SPEED = 0.65; // cells per frame
const PERIOD = SPACING / LANE_SPEED; // frames between releases per lane
const COLLAPSE = 30; // frames spent springing onto the lane at the gate
const DRIFT = 0.75; // average drift speed on the unordered side, cells per frame
const ITEM = 10; // CSS pixels, size of a sequenced transaction
const PIN = 5; // cells, length of the chip's pins
// Springs: stiffness and damping per frame. Under-damped so things overshoot
// a little and settle, which reads as soft and springy rather than linear.
const SETTLE_K = 0.09;
const SETTLE_C = 0.24;
const POP_K = 0.2;
const POP_C = 0.26;
const SVG_NS = "http://www.w3.org/2000/svg";

function rand(min, max) {
	return min + Math.random() * (max - min);
}

export function initSequencer(canvas, { svg, reducedMotion = false } = {}) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return () => {};

	let w = 0;
	let h = 0;
	let field;
	let image;
	let particles = [];
	let lanes = MAX_LANES;
	let laneY = [];
	let laneQueue = []; // transactions holding a reserved slot, in slot order
	let laneNext = []; // time of each lane's next release
	let laneReserved = []; // time of each lane's last reserved slot
	let transit = 0; // frames from entering on the left to release
	let chipEls = null;
	let pointer = null;
	let frameId = 0;
	let time = 0;

	const gateX = () => w * GATE;

	// The sequencer is drawn as a chip centred on the gate. Transactions
	// wait at its input pins, cross under its body and exit its output pins.
	function chip() {
		const cw = Math.min(40, Math.max(20, w * 0.09));
		return {
			left: gateX() - cw / 2,
			right: gateX() + cw / 2,
			// Full height of the field
			top: 0,
			bottom: h,
		};
	}
	const laneStart = () => chip().left - PIN;
	const waitX = () => laneStart() - 3;

	// Every transaction entering on the left reserves the next free slot in a
	// lane and is scheduled to reach the gate exactly when that slot opens, so
	// nothing piles up and no slot leaves empty.
	function enter(p, lane, t0) {
		p.state = "free";
		p.lane = lane;
		p.slot = laneReserved[lane] + PERIOD;
		laneReserved[lane] = p.slot;
		laneQueue[lane].push(p);
		p.t0 = t0;
		p.x0 = rand(-20, -4);
		p.x = p.x0;
		p.y = rand(h * 0.1, h * 0.9);
		p.vx = 0;
		p.vy = rand(-0.3, 0.3);
		p.sv = 0;
		// Different easing per transaction makes them overtake one another
		p.ease = rand(0.55, 1.8);
		p.phase = rand(0, Math.PI * 2);
		p.ox = 0;
		p.oy = 0;
		p.r = rand(2.5, 4.5);
		p.size = rand(9, 14);
		p.angle = rand(0, 90);
		p.spin = rand(-0.8, 0.8);
		return p;
	}

	function order(p, lane, x) {
		p.state = "ordered";
		p.lane = lane;
		p.x = x;
		p.y = laneY[lane];
		p.r = 2.6;
		p.size = ITEM;
		p.sv = 0;
		p.angle = 0;
		// Squares still under the chip pop out when they reach its output pin
		p.popped = x > chip().right;
		return p;
	}

	function resize() {
		const rect = canvas.getBoundingClientRect();
		w = Math.max(1, Math.ceil(rect.width / CELL));
		h = Math.max(1, Math.ceil(rect.height / CELL));
		canvas.width = w;
		canvas.height = h;
		field = new Float32Array(w * h);
		image = ctx.createImageData(w, h);

		// Fewer lanes in short fields
		lanes = Math.max(
			2,
			Math.min(MAX_LANES, Math.floor((h * 0.7) / LANE_GAP) + 1),
		);
		const spread = 0.6;
		laneY = Array.from(
			{ length: lanes },
			(_, i) => h * ((1 - spread) / 2 + (spread * i) / (lanes - 1)),
		);
		laneQueue = Array.from({ length: lanes }, () => []);
		// Alternate lanes release half a period apart
		laneNext = Array.from(
			{ length: lanes },
			(_, i) => time + (i % 2 ? PERIOD / 2 : PERIOD),
		);
		laneReserved = laneNext.map((t) => t - PERIOD);
		transit = (gateX() + 20) / DRIFT + COLLAPSE;

		// Fill every slot on the ordered side so the lanes start evenly spaced
		particles = [];
		const slots = Math.ceil((w + 6 - laneStart()) / SPACING);
		for (let lane = 0; lane < lanes; lane++) {
			const newest =
				laneStart() + (time - (laneNext[lane] - PERIOD)) * LANE_SPEED;
			for (let k = 0; k < slots; k++) {
				particles.push(order({}, lane, newest + k * SPACING));
			}
		}

		// Put transactions already in flight for every slot opening within one
		// transit time, as if they had entered earlier
		for (let lane = 0; lane < lanes; lane++) {
			while (laneReserved[lane] + PERIOD <= time + transit) {
				const p = enter({}, lane, 0);
				p.t0 = p.slot - transit;
				p.y = rand(h * 0.1, h * 0.9);
				particles.push(p);
			}
		}

		if (svg) {
			svg.replaceChildren(
				...particles.map((p) => {
					p.el = document.createElementNS(SVG_NS, "rect");
					p.el.setAttribute("class", "seq-item");
					p.drawnState = null;
					p.drawnSize = null;
					return p.el;
				}),
			);
			buildChip();
		}
	}

	function el(tag, attrs, parent) {
		const node = document.createElementNS(SVG_NS, tag);
		for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
		parent?.appendChild(node);
		return node;
	}

	// Chip body spanning the field, pins, label and clock, drawn above the transactions so
	// its body hides them while they cross
	function buildChip() {
		const c = chip();
		const px = (v) => (v * CELL).toFixed(1);
		// Snap 1px lines to half pixels so they render as crisp as CSS borders
		const line = (v) => Math.round(v * CELL) + 0.5;
		const g = el("g", { class: "seq-chip" }, svg);
		const [x0, x1, y0, y1] = [c.left, c.right, c.top, c.bottom];

		const inPins = [];
		const outPins = [];
		for (let lane = 0; lane < lanes; lane++) {
			const y = line(laneY[lane]);
			inPins.push(
				el(
					"line",
					{ x1: px(x0 - PIN), y1: y, x2: px(x0), y2: y, class: "seq-pin" },
					g,
				),
			);
			outPins.push(
				el(
					"line",
					{ x1: px(x1), y1: y, x2: px(x1 + PIN), y2: y, class: "seq-pin" },
					g,
				),
			);
		}

		// Body fill hides transactions crossing the chip. Its top and bottom
		// sit on the section's own borders, so only the sides are drawn.
		el(
			"rect",
			{
				x: px(x0),
				y: px(y0),
				width: px(x1 - x0),
				height: px(y1 - y0),
				class: "seq-body",
			},
			g,
		);
		for (const x of [line(x0), line(x1)]) {
			el(
				"line",
				{ x1: x, y1: px(y0), x2: x, y2: px(y1), class: "seq-edge" },
				g,
			);
		}

		const cx = (x0 + x1) / 2;
		const tall = y1 - y0 > 40 && x1 - x0 >= 30;
		if (tall) {
			el(
				"text",
				{
					x: px(cx),
					y: px(y0 + 12),
					"text-anchor": "middle",
					class: "seq-label",
				},
				g,
			).textContent = "SEQUENCER";
		}
		const clockY = tall ? y1 - 14 : (y0 + y1) / 2;
		const clockR = Math.min(5, (y1 - y0) / 4);
		el(
			"circle",
			{ cx: px(cx), cy: px(clockY), r: px(clockR), class: "seq-clock" },
			g,
		);
		const hand = el(
			"line",
			{ x1: 0, y1: 0, x2: 0, y2: px(-clockR * 0.75), class: "seq-clock" },
			g,
		);

		chipEls = { inPins, outPins, hand, cx: px(cx), cy: px(clockY) };
	}

	function drawChip() {
		const c = chip();
		const waiting = new Array(lanes).fill(false);
		const leaving = new Array(lanes).fill(false);
		for (const p of particles) {
			if (p.state === "queued" && p.lane >= 0) waiting[p.lane] = true;
			else if (
				p.state === "ordered" &&
				p.x >= c.right - 2 &&
				p.x <= c.right + PIN + 3
			) {
				leaving[p.lane] = true;
			}
		}
		for (let lane = 0; lane < lanes; lane++) {
			chipEls.inPins[lane].classList.toggle("is-waiting", waiting[lane]);
			chipEls.outPins[lane].classList.toggle("is-leaving", leaving[lane]);
		}
		// One full turn every four releases
		const angle = ((time / (PERIOD * 4)) * 360) % 360;
		chipEls.hand.setAttribute(
			"transform",
			`translate(${chipEls.cx} ${chipEls.cy}) rotate(${angle.toFixed(1)})`,
		);
	}

	function splat(cx, cy, r, strength) {
		const r2 = r * r * 2.2;
		const x0 = Math.max(0, Math.floor(cx - r * 2));
		const x1 = Math.min(w - 1, Math.ceil(cx + r * 2));
		const y0 = Math.max(0, Math.floor(cy - r * 2));
		const y1 = Math.min(h - 1, Math.ceil(cy + r * 2));
		for (let y = y0; y <= y1; y++) {
			const dy = y - cy;
			for (let x = x0; x <= x1; x++) {
				const dx = x - cx;
				field[y * w + x] += strength * Math.exp(-(dx * dx + dy * dy) / r2);
			}
		}
	}

	function step() {
		time += 1;
		const chipRight = chip().right;

		// Each lane is a conveyor: one release per period, always the same gap
		for (let lane = 0; lane < lanes; lane++) {
			if (time >= laneNext[lane]) {
				const next = laneQueue[lane].shift();
				if (next) {
					order(next, lane, laneStart() + (time - laneNext[lane]) * LANE_SPEED);
				}
				laneNext[lane] += PERIOD;
			}
		}

		for (const p of particles) {
			if (p.state === "free") {
				const settleAt = p.slot - COLLAPSE;
				if (time >= settleAt) {
					p.state = "queued";
				} else {
					// Scheduled progress toward the gate, with a wobble that fades
					// out on approach so the arrival time is exact
					const prog = Math.min(
						1,
						Math.max(0, (time - p.t0) / (settleAt - p.t0)),
					);
					const base = p.x0 + (waitX() - 8 - p.x0) * prog ** p.ease;
					const wobble = Math.sin(time * 0.05 + p.phase) * 4 * (1 - prog);

					if (pointer) {
						const dx = p.x - pointer.x;
						const dy = p.y - pointer.y;
						const d2 = dx * dx + dy * dy;
						if (d2 < 900) {
							const f = (1 - d2 / 900) * 2;
							p.ox += (dx / Math.sqrt(d2 + 1)) * f;
							p.oy += (dy / Math.sqrt(d2 + 1)) * f;
						}
					}
					p.ox *= 0.92;
					p.oy *= 0.92;

					p.vy += rand(-0.08, 0.08);
					p.vy *= 0.96;
					p.y += p.vy + p.oy * 0.1;
					// Drift toward the assigned lane late in the approach
					p.y += (laneY[p.lane] - p.y) * 0.03 * prog * prog;
					if (p.y < h * 0.05 || p.y > h * 0.95) p.vy *= -1;

					const prevX = p.x;
					p.x = base + wobble + p.ox;
					p.vx = p.x - prevX;
					p.angle += p.spin;
				}
			}

			if (p.state === "queued") {
				// Spring onto the lane at the chip's input pin, carrying the
				// approach velocity so it overshoots slightly and settles
				p.vx += (waitX() - p.x) * SETTLE_K - p.vx * SETTLE_C;
				p.vy += (laneY[p.lane] - p.y) * SETTLE_K - p.vy * SETTLE_C;
				p.x += p.vx;
				p.y += p.vy;
				p.r += (2.6 - p.r) * 0.1;
				p.sv =
					(p.sv || 0) + (ITEM - p.size) * SETTLE_K - (p.sv || 0) * SETTLE_C;
				p.size += p.sv;
				// Snap straight to the nearest right angle with the same spring
				const square = Math.round(p.angle / 90) * 90;
				p.spin += (square - p.angle) * SETTLE_K - p.spin * SETTLE_C;
				p.angle += p.spin;
			} else if (p.state === "ordered") {
				p.x += LANE_SPEED;
				if (!p.popped && p.x >= chipRight) {
					// Pop out of the output pin small and spring up to full size
					p.popped = true;
					p.size = 3;
					p.sv = 0;
				}
				if (p.popped && (p.size !== ITEM || p.sv !== 0)) {
					p.sv += (ITEM - p.size) * POP_K - p.sv * POP_C;
					p.size += p.sv;
					if (Math.abs(p.sv) < 0.01 && Math.abs(ITEM - p.size) < 0.01) {
						p.size = ITEM;
						p.sv = 0;
					}
				}
				// Leaving on the right re-enters on the left in the same lane
				if (p.x > w + 6) enter(p, p.lane, time);
			}
		}
	}

	function render() {
		field.fill(0);
		const edge = Math.max(1, laneStart());

		// Slow fog on the unordered side, fading out toward the chip
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < edge; x++) {
				const fade = 1 - x / edge;
				const n =
					Math.sin(x * 0.05 + time * 0.01) * Math.cos(y * 0.07 - time * 0.008) +
					Math.sin((x + y) * 0.03 + time * 0.006);
				field[y * w + x] = (0.12 + n * 0.06) * fade;
			}
		}

		for (const p of particles) {
			// Soft dithered halo behind each square
			splat(p.x, p.y, p.r + 1.5, p.state === "ordered" ? 0.3 : 0.22);
		}
		if (pointer) splat(pointer.x, pointer.y, 7, 0.35);

		const data = image.data;
		const levels = TONES.length - 1;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const i = y * w + x;
				const v = Math.min(1, field[i]) * levels;
				const base = Math.floor(v);
				const tone = Math.min(
					levels,
					base + (v - base > BAYER[(y & 7) * 8 + (x & 7)] ? 1 : 0),
				);
				const c = TONES[tone];
				const o = i * 4;
				data[o] = c[0];
				data[o + 1] = c[1];
				data[o + 2] = c[2];
				data[o + 3] = 255;
			}
		}
		ctx.putImageData(image, 0, 0);

		if (svg) {
			drawItems();
			drawChip();
		}
	}

	function drawItems() {
		for (const p of particles) {
			const el = p.el;
			// Still amber until it comes out of the chip's output pin
			const look = p.state === "ordered" && !p.popped ? "queued" : p.state;
			if (p.drawnState !== look) {
				el.dataset.state = look;
				p.drawnState = look;
			}
			if (p.drawnSize !== p.size) {
				const half = p.size / 2;
				el.setAttribute("x", -half);
				el.setAttribute("y", -half);
				el.setAttribute("width", p.size);
				el.setAttribute("height", p.size);
				p.drawnSize = p.size;
			}
			el.setAttribute(
				"transform",
				`translate(${(p.x * CELL).toFixed(1)} ${(p.y * CELL).toFixed(1)}) rotate(${p.angle.toFixed(1)})`,
			);
		}
	}

	function loop() {
		step();
		render();
		frameId = requestAnimationFrame(loop);
	}

	function onPointerMove(e) {
		const rect = canvas.getBoundingClientRect();
		pointer = {
			x: (e.clientX - rect.left) / CELL,
			y: (e.clientY - rect.top) / CELL,
		};
	}

	function onPointerLeave() {
		pointer = null;
	}

	resize();

	if (reducedMotion) {
		// Settle the simulation, then draw a single still frame
		for (let i = 0; i < 240; i++) step();
		render();
		const onResize = () => {
			resize();
			for (let i = 0; i < 240; i++) step();
			render();
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}

	// Only animate while visible
	const observer = new IntersectionObserver(([entry]) => {
		cancelAnimationFrame(frameId);
		if (entry.isIntersecting) frameId = requestAnimationFrame(loop);
	});
	observer.observe(canvas);

	const resizeObserver = new ResizeObserver(() => resize());
	resizeObserver.observe(canvas);
	canvas.addEventListener("pointermove", onPointerMove);
	canvas.addEventListener("pointerleave", onPointerLeave);

	return () => {
		cancelAnimationFrame(frameId);
		observer.disconnect();
		resizeObserver.disconnect();
		canvas.removeEventListener("pointermove", onPointerMove);
		canvas.removeEventListener("pointerleave", onPointerLeave);
	};
}
