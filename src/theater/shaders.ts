// GLSL ES 3.00 for WebGL2. One full-screen triangle; `film` renders a frame into a
// framebuffer (reading the previous frame for trails) and `copy` puts it on screen.

export const VERTEX = /* glsl */ `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
	vUv = aPosition * 0.5 + 0.5;
	gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

export const COPY = /* glsl */ `#version 300 es
precision mediump float;
in vec2 vUv;
uniform sampler2D uImage;
out vec4 outColor;
void main() {
	outColor = texture(uImage, vUv);
}`;

export const FILM = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uSource;   // the video frame (or poster before playback)
uniform sampler2D uPrevious; // last rendered frame, for trails
uniform vec2 uResolution;
uniform float uSeed;         // changes once per projected frame
uniform float uTime;

uniform float uPrintColor;
uniform vec3 uGel;
uniform float uGelDensity;
uniform float uBrightness;
uniform float uContrast;
uniform float uSoft;
uniform float uGrain;
uniform float uFlickerGain;  // computed on the CPU, capped below the flash threshold
uniform vec2 uWeaveOffset;   // computed on the CPU
uniform float uDust;
uniform float uVignette;
uniform float uRgbSplit;
uniform vec3 uTear;          // x: band center, y: band height, z: strength
uniform float uBlocks;
uniform float uTrails;
uniform float uPosterize;
uniform float uInvert;

float hash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

vec3 sampleSoft(vec2 uv) {
	if (uSoft <= 0.0) return texture(uSource, uv).rgb;
	vec2 r = uSoft * 2.5 / uResolution * (uResolution.x / 640.0);
	vec3 sum = texture(uSource, uv).rgb * 0.2;
	sum += texture(uSource, uv + vec2(r.x, 0.0)).rgb * 0.1;
	sum += texture(uSource, uv - vec2(r.x, 0.0)).rgb * 0.1;
	sum += texture(uSource, uv + vec2(0.0, r.y)).rgb * 0.1;
	sum += texture(uSource, uv - vec2(0.0, r.y)).rgb * 0.1;
	sum += texture(uSource, uv + r).rgb * 0.1;
	sum += texture(uSource, uv - r).rgb * 0.1;
	sum += texture(uSource, uv + vec2(r.x, -r.y)).rgb * 0.1;
	sum += texture(uSource, uv + vec2(-r.x, r.y)).rgb * 0.1;
	return sum;
}

vec3 sampleSplit(vec2 uv) {
	if (uRgbSplit <= 0.0) return sampleSoft(uv);
	vec2 shift = vec2(uRgbSplit * 0.012, uRgbSplit * 0.003);
	return vec3(sampleSoft(uv + shift).r, sampleSoft(uv).g, sampleSoft(uv - shift).b);
}

void main() {
	// Film moves in the gate; textures are uploaded top row first, so flip y
	vec2 uv = vec2(vUv.x, 1.0 - vUv.y) + uWeaveOffset;

	// Block corruption: whole macroblocks jump to a neighbour's pixels for a frame
	if (uBlocks > 0.0) {
		vec2 block = floor(uv * vec2(16.0, 12.0));
		float pick = hash(block + uSeed);
		if (pick < uBlocks * 0.18) {
			uv += (vec2(hash(block * 1.7 + uSeed), hash(block * 2.3 - uSeed)) - 0.5) * 0.12 * uBlocks;
		}
	}

	// Signal tear: one horizontal band slides sideways
	float band = 1.0 - smoothstep(0.0, uTear.y, abs(uv.y - uTear.x));
	uv.x += band * uTear.z * 0.08 * sin(uv.y * 80.0 + uTime * 6.0);

	vec3 color = sampleSplit(clamp(uv, 0.0, 1.0));

	// Print color: 0 strips the circulating print's baked-in blue back to monochrome.
	// The tint lives mostly in the blue channel, so the brightest channel carries the image.
	float tone = max(max(color.r, color.g), color.b) * 0.8 + dot(color, vec3(0.299, 0.587, 0.114)) * 0.2;
	color = mix(vec3(tone), color, uPrintColor);

	// Gel over the projector lamp: a filter multiplies the light, then the lamp is opened up a little
	vec3 filtered = color * uGel * (1.0 + 0.5 * uGelDensity);
	color = mix(color, filtered, uGelDensity);

	color = (color - 0.5) * uContrast + 0.5;
	color *= uBrightness * uFlickerGain;

	if (uPosterize > 0.0) {
		float levels = mix(24.0, 3.0, uPosterize);
		color = floor(color * levels + 0.5) / levels;
	}

	color = mix(color, 1.0 - color, uInvert);

	// Grain: fresh per projected frame, strongest in the midtones like silver halide
	if (uGrain > 0.0) {
		float g = hash(vUv * uResolution + uSeed * 97.0) - 0.5;
		float mid = 1.0 - abs(dot(color, vec3(0.333)) - 0.5) * 1.2;
		color += g * uGrain * 0.35 * mid;
	}

	// Dust and scratches
	if (uDust > 0.0) {
		float scratchX = hash(vec2(uSeed, 7.0));
		float scratch = 1.0 - smoothstep(0.0, 0.0015, abs(vUv.x - scratchX));
		if (hash(vec2(uSeed, 3.0)) < uDust * 0.6) color += scratch * 0.35;
		vec2 cell = floor(vUv * uResolution / 3.0);
		float speck = step(1.0 - uDust * 0.0025, hash(cell + uSeed * 13.0));
		color = mix(color, vec3(hash(cell) > 0.5 ? 0.9 : 0.02), speck);
	}

	if (uVignette > 0.0) {
		vec2 d = vUv - 0.5;
		color *= 1.0 - uVignette * smoothstep(0.25, 0.85, length(d * vec2(1.1, 1.0)) * 1.25);
	}

	color = clamp(color, 0.0, 1.0);
	vec3 previous = texture(uPrevious, vUv).rgb;
	outColor = vec4(mix(color, max(color, previous), uTrails), 1.0);
}`;
