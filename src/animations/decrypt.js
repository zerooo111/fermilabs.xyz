/**
 * Decrypted text animation
 * Scrambles text and gradually reveals it character by character
 */

export class DecryptedText {
	constructor(element, options = {}) {
		this.element = element;
		this.originalText = element.textContent;

		// Configuration
		this.config = {
			speed: options.speed || 50, // Time between iterations in ms
			maxIterations: options.maxIterations || 10, // How many times to scramble before revealing
			sequential: options.sequential !== false, // Reveal characters one by one
			revealDirection: options.revealDirection || "start", // 'start', 'end', or 'center'
			useOriginalCharsOnly: options.useOriginalCharsOnly || false,
			characters:
				options.characters ||
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
			encryptedClass: options.encryptedClass || "",
			revealedClass: options.revealedClass || "",
		};

		this.displayText = this.originalText;
		this.isAnimating = false;
		this.revealedIndices = new Set();
		this.interval = null;
		this.currentIteration = 0;

		// Get available characters for scrambling
		this.availableChars = this.config.useOriginalCharsOnly
			? Array.from(new Set(this.originalText.split(""))).filter(
					(char) => char !== " ",
				)
			: this.config.characters.split("");

		this.init();
	}

	init() {
		// Wrap each character in a span for individual styling
		this.wrapCharacters();
	}

	wrapCharacters() {
		const chars = this.originalText.split("");
		const baseClass = "decrypt-char";
		const additionalClass = this.config.revealedClass ? ` ${this.config.revealedClass}` : "";

		this.element.innerHTML = chars
			.map(
				(char, index) =>
					`<span class="${baseClass}${additionalClass}" data-index="${index}">${char}</span>`,
			)
			.join("");

		this.charElements = Array.from(
			this.element.querySelectorAll(".decrypt-char"),
		);
	}

	getNextIndex() {
		const textLength = this.originalText.length;
		const revealedSize = this.revealedIndices.size;

		switch (this.config.revealDirection) {
			case "start":
				return revealedSize;
			case "end":
				return textLength - 1 - revealedSize;
			case "center": {
				const middle = Math.floor(textLength / 2);
				const offset = Math.floor(revealedSize / 2);
				const nextIndex =
					revealedSize % 2 === 0
						? middle + offset
						: middle - offset - 1;

				if (
					nextIndex >= 0 &&
					nextIndex < textLength &&
					!this.revealedIndices.has(nextIndex)
				) {
					return nextIndex;
				}
				for (let i = 0; i < textLength; i++) {
					if (!this.revealedIndices.has(i)) return i;
				}
				return 0;
			}
			default:
				return revealedSize;
		}
	}

	shuffleText() {
		if (this.config.useOriginalCharsOnly) {
			// Use only characters from the original text
			const positions = this.originalText.split("").map((char, i) => ({
				char,
				isSpace: char === " ",
				index: i,
				isRevealed: this.revealedIndices.has(i),
			}));

			const nonSpaceChars = positions
				.filter((p) => !p.isSpace && !p.isRevealed)
				.map((p) => p.char);

			// Shuffle non-space, non-revealed characters
			for (let i = nonSpaceChars.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[nonSpaceChars[i], nonSpaceChars[j]] = [
					nonSpaceChars[j],
					nonSpaceChars[i],
				];
			}

			let charIndex = 0;
			return positions.map((p) => {
				if (p.isSpace) return " ";
				if (p.isRevealed) return this.originalText[p.index];
				return nonSpaceChars[charIndex++];
			});
		}

		// Use random characters from the character set
		return this.originalText.split("").map((char, i) => {
			if (char === " ") return " ";
			if (this.revealedIndices.has(i)) return this.originalText[i];
			return this.availableChars[
				Math.floor(Math.random() * this.availableChars.length)
			];
		});
	}

	updateDisplay(chars) {
		this.charElements.forEach((el, index) => {
			const char = chars[index];
			const isRevealed = this.revealedIndices.has(index);

			el.textContent = char;

			// Update classes - only if they're not empty strings
			if (isRevealed) {
				if (this.config.encryptedClass) {
					el.classList.remove(this.config.encryptedClass);
				}
				if (this.config.revealedClass) {
					el.classList.add(this.config.revealedClass);
				}
			} else {
				if (this.config.revealedClass) {
					el.classList.remove(this.config.revealedClass);
				}
				if (this.config.encryptedClass) {
					el.classList.add(this.config.encryptedClass);
				}
			}
		});
	}

	animate() {
		if (this.isAnimating) return;

		this.isAnimating = true;
		this.revealedIndices.clear();
		this.currentIteration = 0;

		this.interval = setInterval(() => {
			if (this.config.sequential) {
				// Sequential reveal: reveal one character at a time
				if (this.revealedIndices.size < this.originalText.length) {
					const nextIndex = this.getNextIndex();
					this.revealedIndices.add(nextIndex);
					const chars = this.shuffleText();
					this.updateDisplay(chars);
				} else {
					// All characters revealed
					this.stop();
				}
			} else {
				// Non-sequential: scramble all unrevealed characters for N iterations
				const chars = this.shuffleText();
				this.updateDisplay(chars);
				this.currentIteration++;

				if (this.currentIteration >= this.config.maxIterations) {
					// Reveal all characters
					this.revealedIndices.clear();
					for (let i = 0; i < this.originalText.length; i++) {
						this.revealedIndices.add(i);
					}
					this.updateDisplay(this.originalText.split(""));
					this.stop();
				}
			}
		}, this.config.speed);
	}

	stop() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
		this.isAnimating = false;
	}

	reset() {
		this.stop();
		this.revealedIndices.clear();
		this.currentIteration = 0;
		this.updateDisplay(this.originalText.split(""));
	}

	destroy() {
		this.stop();
		this.element.textContent = this.originalText;
	}
}

/**
 * Initialize decrypt animation on an element
 * @param {string} elementSelector - CSS selector for the target element
 * @param {Object} options - Animation configuration options
 * @param {number} options.repeatInterval - Interval in ms to repeat the animation (0 = no repeat)
 * @returns {DecryptedText} The animation instance
 */
export function initDecrypt(elementSelector, options = {}) {
	const element = document.querySelector(elementSelector);
	if (!element) {
		console.warn(`Element not found: ${elementSelector}`);
		return null;
	}

	const repeatInterval = options.repeatInterval || 0;
	const decryptInstance = new DecryptedText(element, options);

	// Initial animation
	decryptInstance.animate();

	// Set up repeat if configured
	if (repeatInterval > 0) {
		setInterval(() => {
			decryptInstance.animate();
		}, repeatInterval);
	}

	return decryptInstance;
}
