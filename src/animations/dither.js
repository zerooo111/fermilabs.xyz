import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec3 darkColor;
uniform vec3 midColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;
vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}
const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}
float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2));
}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;

  float layer1 = pattern(uv);
  float layer2 = pattern(uv * 1.3 + vec2(time * waveSpeed * 0.7, 0.0));
  float layer3 = pattern(uv * 0.7 - vec2(time * waveSpeed * 0.5, 0.0));

  float f = (layer1 * 0.5 + layer2 * 0.3 + layer3 * 0.2);

  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }

  vec3 col;
  if (f < 0.33) {
    col = mix(darkColor, midColor, f * 3.0);
  } else if (f < 0.66) {
    col = mix(midColor, waveColor, (f - 0.33) * 3.0);
  } else {
    col = mix(waveColor, waveColor * 1.1, (f - 0.66) * 3.0);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

const ditherShader = {
	uniforms: {
		tDiffuse: { value: null },
		resolution: { value: new THREE.Vector2() },
		colorNum: { value: 4.0 },
		pixelSize: { value: 2.0 },
	},
	vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	fragmentShader: `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float colorNum;
    uniform float pixelSize;
    varying vec2 vUv;

    const float bayerMatrix8x8[64] = float[64](
      0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
      32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
      8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
      40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
      2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
      34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
      10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
      42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
    );

    vec3 dither(vec2 uv, vec3 color) {
      vec2 scaledCoord = floor(uv * resolution / pixelSize);
      int x = int(mod(scaledCoord.x, 8.0));
      int y = int(mod(scaledCoord.y, 8.0));
      float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
      float step = 1.0 / (colorNum - 1.0);
      color += threshold * step;
      float bias = 0.2;
      color = clamp(color - bias, 0.0, 1.0);
      return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
    }

    void main() {
      vec2 normalizedPixelSize = pixelSize / resolution;
      vec2 uvPixel = normalizedPixelSize * floor(vUv / normalizedPixelSize);
      vec4 color = texture2D(tDiffuse, uvPixel);
      color.rgb = dither(vUv, color.rgb);
      gl_FragColor = color;
    }
  `,
};

export function createDither(options = {}) {
	const {
		waveSpeed = 0.05,
		waveFrequency = 3,
		waveAmplitude = 0.3,
		waveColor = [0.5, 0.5, 0.5],
		darkColor = [0.0, 0.0, 0.0],
		midColor = [0.2, 0.4, 0.3],
		colorNum = 4,
		pixelSize = 2,
		disableAnimation = false,
		enableMouseInteraction = true,
		mouseRadius = 1,
	} = options;

	const container = document.createElement("div");
	container.className = "w-full h-full relative";

	const canvas = document.createElement("canvas");
	canvas.className = "w-full h-full";
	container.appendChild(canvas);

	// Scene setup
	const scene = new THREE.Scene();
	const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
		preserveDrawingBuffer: true,
	});
	renderer.setPixelRatio(1);

	// Wave material
	const waveUniforms = {
		time: { value: 0 },
		resolution: { value: new THREE.Vector2() },
		waveSpeed: { value: waveSpeed },
		waveFrequency: { value: waveFrequency },
		waveAmplitude: { value: waveAmplitude },
		waveColor: { value: new THREE.Color(...waveColor) },
		darkColor: { value: new THREE.Color(...darkColor) },
		midColor: { value: new THREE.Color(...midColor) },
		mousePos: { value: new THREE.Vector2(0, 0) },
		enableMouseInteraction: { value: enableMouseInteraction ? 1 : 0 },
		mouseRadius: { value: mouseRadius },
	};

	const waveMaterial = new THREE.ShaderMaterial({
		vertexShader: waveVertexShader,
		fragmentShader: waveFragmentShader,
		uniforms: waveUniforms,
	});

	const geometry = new THREE.PlaneGeometry(2, 2);
	const mesh = new THREE.Mesh(geometry, waveMaterial);
	scene.add(mesh);

	// Post-processing
	const composer = new EffectComposer(renderer);
	const renderPass = new RenderPass(scene, camera);
	composer.addPass(renderPass);

	const ditherPass = new ShaderPass(ditherShader);
	ditherPass.uniforms.colorNum.value = colorNum;
	ditherPass.uniforms.pixelSize.value = pixelSize;
	composer.addPass(ditherPass);

	// Mouse tracking
	const mouseRef = new THREE.Vector2();
	const handlePointerMove = (e) => {
		if (!enableMouseInteraction) return;
		const rect = canvas.getBoundingClientRect();
		const dpr = renderer.getPixelRatio();
		mouseRef.set(
			(e.clientX - rect.left) * dpr,
			(e.clientY - rect.top) * dpr,
		);
	};

	container.addEventListener("pointermove", handlePointerMove);

	// Resize handler
	const onResize = () => {
		const width = container.clientWidth;
		const height = container.clientHeight;
		const dpr = renderer.getPixelRatio();

		renderer.setSize(width, height);
		composer.setSize(width, height);

		const pixelWidth = Math.floor(width * dpr);
		const pixelHeight = Math.floor(height * dpr);

		waveUniforms.resolution.value.set(pixelWidth, pixelHeight);
		ditherPass.uniforms.resolution.value.set(pixelWidth, pixelHeight);
	};

	// Animation loop
	const clock = new THREE.Clock();
	let animationId;

	const animate = () => {
		animationId = requestAnimationFrame(animate);

		if (!disableAnimation) {
			waveUniforms.time.value = clock.getElapsedTime();
		}

		waveUniforms.mousePos.value.copy(mouseRef);
		composer.render();
	};

	// Initialize
	onResize();
	const resizeObserver = new ResizeObserver(onResize);
	resizeObserver.observe(container);

	// Start animation
	animate();

	// Cleanup function
	container._cleanup = () => {
		cancelAnimationFrame(animationId);
		resizeObserver.disconnect();
		container.removeEventListener("pointermove", handlePointerMove);
		geometry.dispose();
		waveMaterial.dispose();
		renderer.dispose();
		composer.dispose();
	};

	return container;
}

export function initDither(elementId) {
	const element = document.getElementById(elementId);
	if (!element) return;

	const ditherCanvas = createDither({
		waveColor: [0.706, 0.863, 0.471],
		darkColor: [0.031, 0.078, 0.047],
		midColor: [0.094, 0.314, 0.22],
		disableAnimation: false,
		enableMouseInteraction: true,
		mouseRadius: 0.3,
		colorNum: 4,
		waveAmplitude: 0.3,
		waveFrequency: 3,
		waveSpeed: 0.05,
	});

	element.appendChild(ditherCanvas);
}
