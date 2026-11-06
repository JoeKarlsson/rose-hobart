import { COPY, FILM, VERTEX } from './shaders';

export interface FrameUniforms {
	seed: number;
	time: number;
	printColor: number;
	gel: [number, number, number];
	gelDensity: number;
	brightness: number;
	contrast: number;
	soft: number;
	grain: number;
	flickerGain: number;
	weaveOffset: [number, number];
	dust: number;
	vignette: number;
	rgbSplit: number;
	tear: [number, number, number];
	blocks: number;
	trails: number;
	posterize: number;
	invert: number;
}

type Source = HTMLVideoElement | HTMLImageElement;

interface Target {
	texture: WebGLTexture;
	framebuffer: WebGLFramebuffer;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
	const shader = gl.createShader(type);
	if (!shader) throw new Error('Could not create shader');
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(`Shader did not compile: ${gl.getShaderInfoLog(shader)}`);
	}
	return shader;
}

function link(gl: WebGL2RenderingContext, fragment: string): WebGLProgram {
	const program = gl.createProgram();
	gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
	gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
	gl.bindAttribLocation(program, 0, 'aPosition');
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(`Shader program did not link: ${gl.getProgramInfoLog(program)}`);
	}
	return program;
}

function makeTexture(gl: WebGL2RenderingContext): WebGLTexture {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	return texture;
}

/** Draws video frames through the film shader. Throws if WebGL2 isn't available. */
export class FilmRenderer {
	private gl: WebGL2RenderingContext;
	private film: WebGLProgram;
	private copy: WebGLProgram;
	private source: WebGLTexture;
	private targets: [Target, Target];
	private current = 0;
	private uniforms = new Map<string, WebGLUniformLocation | null>();
	private width = 0;
	private height = 0;

	constructor(private canvas: HTMLCanvasElement) {
		const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, preserveDrawingBuffer: false });
		if (!gl) throw new Error('WebGL2 is not available');
		this.gl = gl;
		this.film = link(gl, FILM);
		this.copy = link(gl, COPY);

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		// One triangle that covers the whole viewport
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

		this.source = makeTexture(gl);
		this.targets = [this.makeTarget(), this.makeTarget()];
	}

	private makeTarget(): Target {
		const gl = this.gl;
		const texture = makeTexture(gl);
		const framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		return { texture, framebuffer };
	}

	/** Match the drawing buffer to the canvas's displayed size */
	resize(width: number, height: number): void {
		if (width === this.width && height === this.height) return;
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
		const gl = this.gl;
		for (const target of this.targets) {
			gl.bindTexture(gl.TEXTURE_2D, target.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		}
	}

	private location(program: WebGLProgram, name: string): WebGLUniformLocation | null {
		const key = `${program === this.film ? 'f' : 'c'}:${name}`;
		if (!this.uniforms.has(key)) this.uniforms.set(key, this.gl.getUniformLocation(program, name));
		return this.uniforms.get(key) ?? null;
	}

	/** Returns false when there is nothing to draw into yet (before the first resize) */
	draw(frame: Source, u: FrameUniforms): boolean {
		if (this.width === 0) return false;
		const gl = this.gl;
		const f = this.film;
		const previous = this.targets[this.current];
		const next = this.targets[1 - this.current];

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.source);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, frame);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, previous.texture);

		gl.useProgram(f);
		gl.uniform1i(this.location(f, 'uSource'), 0);
		gl.uniform1i(this.location(f, 'uPrevious'), 1);
		gl.uniform2f(this.location(f, 'uResolution'), this.width, this.height);
		gl.uniform1f(this.location(f, 'uSeed'), u.seed);
		gl.uniform1f(this.location(f, 'uTime'), u.time);
		gl.uniform1f(this.location(f, 'uPrintColor'), u.printColor);
		gl.uniform3fv(this.location(f, 'uGel'), u.gel);
		gl.uniform1f(this.location(f, 'uGelDensity'), u.gelDensity);
		gl.uniform1f(this.location(f, 'uBrightness'), u.brightness);
		gl.uniform1f(this.location(f, 'uContrast'), u.contrast);
		gl.uniform1f(this.location(f, 'uSoft'), u.soft);
		gl.uniform1f(this.location(f, 'uGrain'), u.grain);
		gl.uniform1f(this.location(f, 'uFlickerGain'), u.flickerGain);
		gl.uniform2fv(this.location(f, 'uWeaveOffset'), u.weaveOffset);
		gl.uniform1f(this.location(f, 'uDust'), u.dust);
		gl.uniform1f(this.location(f, 'uVignette'), u.vignette);
		gl.uniform1f(this.location(f, 'uRgbSplit'), u.rgbSplit);
		gl.uniform3fv(this.location(f, 'uTear'), u.tear);
		gl.uniform1f(this.location(f, 'uBlocks'), u.blocks);
		gl.uniform1f(this.location(f, 'uTrails'), u.trails);
		gl.uniform1f(this.location(f, 'uPosterize'), u.posterize);
		gl.uniform1f(this.location(f, 'uInvert'), u.invert);

		gl.bindFramebuffer(gl.FRAMEBUFFER, next.framebuffer);
		gl.viewport(0, 0, this.width, this.height);
		gl.drawArrays(gl.TRIANGLES, 0, 3);

		gl.useProgram(this.copy);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, next.texture);
		gl.uniform1i(this.location(this.copy, 'uImage'), 0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.drawArrays(gl.TRIANGLES, 0, 3);

		this.current = 1 - this.current;
		return true;
	}
}
