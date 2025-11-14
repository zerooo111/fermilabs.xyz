import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function createShuffle(text, options = {}) {
	const {
		className = "",
		style = {},
		shuffleDirection = "right",
		duration = 0.35,
		maxDelay = 0,
		ease = "power3.out",
		threshold = 0.1,
		rootMargin = "-100px",
		tag = "p",
		textAlign = "center",
		onShuffleComplete,
		shuffleTimes = 1,
		animationMode = "evenodd",
		loop = false,
		loopDelay = 0,
		stagger = 0.03,
		scrambleCharset = "",
		colorFrom,
		colorTo,
		triggerOnce = true,
		respectReducedMotion = true,
		triggerOnHover = true,
	} = options;

	let splitRef = null;
	let wrappersRef = [];
	let tlRef = null;
	let playing = false;
	let hoverHandler = null;
	let hoverTarget = null;

	const el = document.createElement(tag);
	el.textContent = text;
	el.className = `inline-block whitespace-normal break-words will-change-transform text-[4rem] leading-none invisible ${className}`;

	Object.assign(el.style, {
		textAlign,
		fontFamily: `'Press Start 2P', sans-serif`,
		...style,
	});

	const removeHover = () => {
		if (hoverHandler && hoverTarget) {
			hoverTarget.removeEventListener("mouseenter", hoverHandler);
			hoverTarget.removeEventListener("mousemove", hoverHandler);
			hoverHandler = null;
			hoverTarget = null;
		}
	};

	const teardown = () => {
		if (tlRef) {
			tlRef.kill();
			tlRef = null;
		}

		if (wrappersRef.length) {
			for (const wrap of wrappersRef) {
				const inner = wrap.firstElementChild;
				const orig = inner?.querySelector('[data-orig="1"]');
				if (orig && wrap.parentNode) wrap.parentNode.replaceChild(orig, wrap);
			}
			wrappersRef = [];
		}

		try {
			splitRef?.revert();
		} catch {}

		splitRef = null;
		playing = false;
	};

	const build = () => {
		teardown();

		splitRef = new SplitText(el, {
			type: "chars",
			charsClass: "shuffle-char",
			wordsClass: "shuffle-word",
			linesClass: "shuffle-line",
			smartWrap: true,
			reduceWhiteSpace: false,
		});

		const chars = splitRef.chars || [];

		wrappersRef = [];

		const rolls = Math.max(1, Math.floor(shuffleTimes));

		const rand = (set) =>
			set.charAt(Math.floor(Math.random() * set.length)) || "";

		for (const ch of chars) {
			const parent = ch.parentElement;
			if (!parent) continue;

			const w = ch.getBoundingClientRect().width;
			if (!w) continue;

			const wrap = document.createElement("span");
			wrap.className = "inline-block overflow-hidden align-baseline text-left";
			Object.assign(wrap.style, { width: `${w}px` });

			const inner = document.createElement("span");
			inner.className =
				"inline-block whitespace-nowrap will-change-transform origin-left transform-gpu";

			parent.insertBefore(wrap, ch);
			wrap.appendChild(inner);

			const firstOrig = ch.cloneNode(true);
			firstOrig.className = "inline-block text-left";
			Object.assign(firstOrig.style, { width: `${w}px` });

			ch.setAttribute("data-orig", "1");
			ch.className = "inline-block text-left";
			Object.assign(ch.style, { width: `${w}px` });

			inner.appendChild(firstOrig);

			for (let k = 0; k < rolls; k++) {
				const c = ch.cloneNode(true);
				if (scrambleCharset) c.textContent = rand(scrambleCharset);
				c.className = "inline-block text-left";
				Object.assign(c.style, { width: `${w}px` });
				inner.appendChild(c);
			}

			inner.appendChild(ch);

			const steps = rolls + 1;
			let startX = 0;
			let finalX = -steps * w;

			if (shuffleDirection === "right") {
				const firstCopy = inner.firstElementChild;
				const real = inner.lastElementChild;
				if (real) inner.insertBefore(real, inner.firstChild);
				if (firstCopy) inner.appendChild(firstCopy);
				startX = -steps * w;
				finalX = 0;
			}

			gsap.set(inner, { x: startX, force3D: true });

			if (colorFrom) inner.style.color = colorFrom;

			inner.setAttribute("data-final-x", String(finalX));
			inner.setAttribute("data-start-x", String(startX));

			wrappersRef.push(wrap);
		}
	};

	const inners = () => wrappersRef.map((w) => w.firstElementChild);

	const randomizeScrambles = () => {
		if (!scrambleCharset) return;

		for (const w of wrappersRef) {
			const strip = w.firstElementChild;
			if (!strip) continue;

			const kids = Array.from(strip.children);
			for (let i = 1; i < kids.length - 1; i++) {
				kids[i].textContent = scrambleCharset.charAt(
					Math.floor(Math.random() * scrambleCharset.length),
				);
			}
		}
	};

	const cleanupToStill = () => {
		for (const w of wrappersRef) {
			const strip = w.firstElementChild;
			if (!strip) continue;

			const real = strip.querySelector('[data-orig="1"]');
			if (!real) continue;

			strip.replaceChildren(real);
			strip.style.transform = "none";
			strip.style.willChange = "auto";
		}
	};

	const play = () => {
		const strips = inners();
		if (!strips.length) return;

		playing = true;

		const tl = gsap.timeline({
			smoothChildTiming: true,
			repeat: loop ? -1 : 0,
			repeatDelay: loop ? loopDelay : 0,
			onRepeat: () => {
				if (scrambleCharset) randomizeScrambles();
				gsap.set(strips, {
					x: (_i, t) => parseFloat(t.getAttribute("data-start-x") || "0"),
				});
				onShuffleComplete?.();
			},
			onComplete: () => {
				playing = false;
				if (!loop) {
					cleanupToStill();
					if (colorTo) gsap.set(strips, { color: colorTo });
					onShuffleComplete?.();
					armHover();
				}
			},
		});

		const addTween = (targets, at) => {
			tl.to(
				targets,
				{
					x: (_i, t) => parseFloat(t.getAttribute("data-final-x") || "0"),
					duration,
					ease,
					force3D: true,
					stagger: animationMode === "evenodd" ? stagger : 0,
				},
				at,
			);

			if (colorFrom && colorTo)
				tl.to(targets, { color: colorTo, duration, ease }, at);
		};

		if (animationMode === "evenodd") {
			const odd = strips.filter((_, i) => i % 2 === 1);
			const even = strips.filter((_, i) => i % 2 === 0);
			const oddTotal = duration + Math.max(0, odd.length - 1) * stagger;
			const evenStart = odd.length ? oddTotal * 0.7 : 0;

			if (odd.length) addTween(odd, 0);
			if (even.length) addTween(even, evenStart);
		} else {
			for (const strip of strips) {
				const d = Math.random() * maxDelay;
				tl.to(
					strip,
					{
						x: parseFloat(strip.getAttribute("data-final-x") || "0"),
						duration,
						ease,
						force3D: true,
					},
					d,
				);

				if (colorFrom && colorTo)
					tl.fromTo(
						strip,
						{ color: colorFrom },
						{ color: colorTo, duration, ease },
						d,
					);
			}
		}

		tlRef = tl;
	};

	const armHover = (parentElement) => {
		if (!triggerOnHover) return;

		removeHover();

		// Get the hero text container to check bounds
		const heroTextContainer = document.getElementById("hero-text-container");

		let isInsideTextArea = false;

		const checkBounds = (e) => {
			if (!heroTextContainer) return false;
			const rect = heroTextContainer.getBoundingClientRect();
			return (
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom
			);
		};

		const mouseMoveHandler = (e) => {
			const wasInside = isInsideTextArea;
			isInsideTextArea = checkBounds(e);

			// Trigger on mouse enter to text area
			if (!wasInside && isInsideTextArea) {
				console.log("Shuffle: Mouse entered text area");
				if (playing) return;
				build();
				if (scrambleCharset) randomizeScrambles();
				play();
			}
		};

		hoverHandler = mouseMoveHandler;

		// Listen on parent if provided, otherwise on el
		const target = parentElement || el;
		if (target) {
			hoverTarget = target;
			target.addEventListener("mousemove", mouseMoveHandler);
		}
	};

	const create = (parentElement) => {
		build();
		if (scrambleCharset) randomizeScrambles();
		play();
		armHover(parentElement);
		el.classList.remove("invisible");
		el.classList.add("visible");
	};

	// Wait for fonts to load
	const init = (parentElement) => {
		if (
			respectReducedMotion &&
			window.matchMedia &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			el.classList.remove("invisible");
			el.classList.add("visible");
			onShuffleComplete?.();
			return;
		}

		const startPct = (1 - threshold) * 100;
		const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || "");
		const mv = mm ? parseFloat(mm[1]) : 0;
		const mu = mm ? mm[2] || "px" : "px";
		const sign =
			mv === 0 ? "" : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
		const start = `top ${startPct}%${sign}`;

		const st = ScrollTrigger.create({
			trigger: el,
			start,
			once: triggerOnce,
			onEnter: () => create(parentElement),
		});

		// Store cleanup function
		el._cleanup = () => {
			st.kill();
			removeHover();
			teardown();
		};
	};

	// Store init function for later use
	el._init = init;

	return el;
}

export function initShuffle(elementId, text) {
	const element = document.getElementById(elementId);
	if (!element) return;

	const shuffleEl = createShuffle(text, {
		tag: "span",
		style: {
			fontFamily: "var(--font-display)",
			textTransform: "none",
			fontSize: "inherit",
			lineHeight: "inherit",
			fontWeight: "inherit",
			letterSpacing: "inherit",
		},
		shuffleDirection: "right",
		duration: 0.35,
		animationMode: "evenodd",
		shuffleTimes: 1,
		ease: "power3.out",
		stagger: 0.03,
		threshold: 0.1,
		triggerOnce: true,
		triggerOnHover: true,
		respectReducedMotion: true,
	});

	element.textContent = "";
	element.appendChild(shuffleEl);

	// Get the hero section directly
	const heroSection = document.getElementById("hero-section");
	console.log("Shuffle init:", elementId, "Hero section:", heroSection);

	// Initialize after fonts are loaded
	const initWithParent = () => {
		if (shuffleEl._init) {
			console.log("Shuffle: Initializing with hero section");
			shuffleEl._init(heroSection);
		}
	};

	if ("fonts" in document) {
		if (document.fonts.status === "loaded") {
			setTimeout(initWithParent, 0);
		} else {
			document.fonts.ready.then(() => setTimeout(initWithParent, 0));
		}
	} else {
		setTimeout(initWithParent, 0);
	}
}
