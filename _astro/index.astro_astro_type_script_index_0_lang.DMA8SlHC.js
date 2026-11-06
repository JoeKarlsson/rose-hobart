import{t as e}from"./analytics.ClseCUGk.js";var t=[{key:`printColor`,label:`Print color`,group:`print`,min:0,max:1,step:.01,initial:1,motion:!1},{key:`gelDensity`,label:`Gel density`,group:`gel`,min:0,max:1,step:.01,initial:.6,motion:!1},{key:`brightness`,label:`Brightness`,group:`print`,min:.4,max:1.8,step:.01,initial:1,motion:!1},{key:`contrast`,label:`Contrast`,group:`print`,min:.5,max:1.8,step:.01,initial:1,motion:!1},{key:`soft`,label:`Soft focus`,group:`film`,min:0,max:1,step:.01,initial:0,motion:!1},{key:`grain`,label:`Grain`,group:`film`,min:0,max:1,step:.01,initial:0,motion:!0},{key:`flicker`,label:`Flicker`,group:`film`,min:0,max:1,step:.01,initial:0,motion:!0},{key:`weave`,label:`Gate weave`,group:`film`,min:0,max:1,step:.01,initial:0,motion:!0},{key:`dust`,label:`Dust and scratches`,group:`film`,min:0,max:1,step:.01,initial:0,motion:!0},{key:`vignette`,label:`Vignette`,group:`film`,min:0,max:1,step:.01,initial:0,motion:!1},{key:`rgbSplit`,label:`Color split`,group:`glitch`,min:0,max:1,step:.01,initial:0,motion:!1},{key:`tear`,label:`Signal tear`,group:`glitch`,min:0,max:1,step:.01,initial:0,motion:!0},{key:`blocks`,label:`Block corruption`,group:`glitch`,min:0,max:1,step:.01,initial:0,motion:!0},{key:`trails`,label:`Trails`,group:`glitch`,min:0,max:.95,step:.01,initial:0,motion:!1},{key:`posterize`,label:`Posterize`,group:`glitch`,min:0,max:1,step:.01,initial:0,motion:!1},{key:`invert`,label:`Negative`,group:`glitch`,min:0,max:1,step:.01,initial:0,motion:!1}],n=[{id:`age`,label:`Age`,mix:[[`soft`,.25],[`grain`,.6],[`flicker`,.5],[`weave`,.4],[`dust`,.85],[`vignette`,.6]],stops:[`Fresh print`,`Second run`,`Worn reel`,`Nitrate rot`]},{id:`glitch`,label:`Glitch`,mix:[[`rgbSplit`,.6],[`tear`,.5],[`blocks`,.7],[`trails`,.6]],stops:[`Clean`,`Dropouts`,`Corrupt`,`Datamoshed`]}];function r(e,t,n){let r={...e};for(let[e,i]of t.mix)r[e]=Math.round(n*i*100)/100;return r}function i(e,t){let n=t.mix.reduce((t,[n,r])=>t+Math.min(1,e[n]/r),0);return Math.round(n/t.mix.length*100)/100}function a(e,t){if(t<=0)return e.stops[0];let n=e.stops.length-1;return e.stops[1+Math.min(n-1,Math.floor(t*n))]}var ee=[{id:`none`,label:`No gel`,color:`#ffffff`},{id:`blue`,label:`Cornell blue`,color:`#3048d8`},{id:`pink`,label:`Pink`,color:`#ff6fae`},{id:`amber`,label:`Amber`,color:`#ffb347`},{id:`green`,label:`Green`,color:`#4fb36a`},{id:`red`,label:`Red`,color:`#d0213a`}],te={min:.25,max:2,step:.01},ne=[{value:1,label:`Silent speed, 16 fps`},{value:1.5,label:`Sound speed, 24 fps`}],re=.04;function ie(e){let t=Math.min(te.max,Math.max(te.min,e));for(let e of ne)if(Math.abs(t-e.value)<=re)return e.value;return Math.round(t*100)/100}function ae(e){return`${e.toFixed(2)}×`}function o(){let e={gel:`none`,speed:1};for(let n of t)e[n.key]=n.initial;return e}var oe=[{id:`circulated`,label:`As circulated`,settings:{}},{id:`cornell`,label:`Cornell 1936`,settings:{printColor:0,gel:`blue`,gelDensity:.75,grain:.25,flicker:.2,weave:.2,dust:.15,vignette:.45}},{id:`pink`,label:`Pink filter`,settings:{printColor:0,gel:`pink`,gelDensity:.6,grain:.2,vignette:.35,soft:.15}},{id:`nitrate`,label:`Nitrate decay`,settings:{printColor:.2,gel:`amber`,gelDensity:.55,contrast:1.25,grain:.6,flicker:.45,weave:.35,dust:.85,vignette:.6,soft:.2}},{id:`broken`,label:`Broken projector`,settings:{grain:.45,flicker:.9,weave:.9,dust:1,vignette:.5,tear:.5}},{id:`digital`,label:`Digital decay`,settings:{soft:.35,rgbSplit:.5,blocks:.6,trails:.55,posterize:.4,tear:.3}}];function se(e,t){let n={...o(),...e.settings};return t?ce(n):n}function ce(e){let n={...e};for(let e of t)e.motion&&(n[e.key]=0);return n}function le(e){return`${Math.round(e*100)}%`}function ue(e){let t=/^#([0-9a-f]{6})$/i.exec(e);if(!t)throw Error(`Not a #rrggbb color: ${e}`);let n=parseInt(t[1],16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}function de(e){if(e.startsWith(`#`))return e;let t=ee.find(t=>t.id===e);if(!t)throw Error(`Unknown gel: ${e}`);return t.color}var fe=.15;function pe(e,t){return 1+Math.max(-1,Math.min(1,e))*t*fe}var s=.5;function me(e,t){return e<=0?1/0:s+t*(4-e*3-s)}var he=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
	vUv = aPosition * 0.5 + 0.5;
	gl_Position = vec4(aPosition, 0.0, 1.0);
}`,ge=`#version 300 es
precision mediump float;
in vec2 vUv;
uniform sampler2D uImage;
out vec4 outColor;
void main() {
	outColor = texture(uImage, vUv);
}`,_e=`#version 300 es
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
}`;function c(e,t,n){let r=e.createShader(t);if(!r)throw Error(`Could not create shader`);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(`Shader did not compile: ${e.getShaderInfoLog(r)}`);return r}function l(e,t){let n=e.createProgram();if(e.attachShader(n,c(e,e.VERTEX_SHADER,he)),e.attachShader(n,c(e,e.FRAGMENT_SHADER,t)),e.bindAttribLocation(n,0,`aPosition`),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw Error(`Shader program did not link: ${e.getProgramInfoLog(n)}`);return n}function ve(e){let t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),t}var ye=class{canvas;gl;film;copy;source;targets;current=0;uniforms=new Map;width=0;height=0;constructor(e){this.canvas=e;let t=e.getContext(`webgl2`,{alpha:!1,antialias:!1,preserveDrawingBuffer:!1});if(!t)throw Error(`WebGL2 is not available`);this.gl=t,this.film=l(t,_e),this.copy=l(t,ge);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),this.source=ve(t),this.targets=[this.makeTarget(),this.makeTarget()]}makeTarget(){let e=this.gl,t=ve(e),n=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0),e.bindFramebuffer(e.FRAMEBUFFER,null),{texture:t,framebuffer:n}}resize(e,t){if(e===this.width&&t===this.height)return;this.width=e,this.height=t,this.canvas.width=e,this.canvas.height=t;let n=this.gl;for(let r of this.targets)n.bindTexture(n.TEXTURE_2D,r.texture),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,e,t,0,n.RGBA,n.UNSIGNED_BYTE,null)}location(e,t){let n=`${e===this.film?`f`:`c`}:${t}`;return this.uniforms.has(n)||this.uniforms.set(n,this.gl.getUniformLocation(e,t)),this.uniforms.get(n)??null}draw(e,t){if(this.width===0)return!1;let n=this.gl,r=this.film,i=this.targets[this.current],a=this.targets[1-this.current];return n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.source),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,e),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,i.texture),n.useProgram(r),n.uniform1i(this.location(r,`uSource`),0),n.uniform1i(this.location(r,`uPrevious`),1),n.uniform2f(this.location(r,`uResolution`),this.width,this.height),n.uniform1f(this.location(r,`uSeed`),t.seed),n.uniform1f(this.location(r,`uTime`),t.time),n.uniform1f(this.location(r,`uPrintColor`),t.printColor),n.uniform3fv(this.location(r,`uGel`),t.gel),n.uniform1f(this.location(r,`uGelDensity`),t.gelDensity),n.uniform1f(this.location(r,`uBrightness`),t.brightness),n.uniform1f(this.location(r,`uContrast`),t.contrast),n.uniform1f(this.location(r,`uSoft`),t.soft),n.uniform1f(this.location(r,`uGrain`),t.grain),n.uniform1f(this.location(r,`uFlickerGain`),t.flickerGain),n.uniform2fv(this.location(r,`uWeaveOffset`),t.weaveOffset),n.uniform1f(this.location(r,`uDust`),t.dust),n.uniform1f(this.location(r,`uVignette`),t.vignette),n.uniform1f(this.location(r,`uRgbSplit`),t.rgbSplit),n.uniform3fv(this.location(r,`uTear`),t.tear),n.uniform1f(this.location(r,`uBlocks`),t.blocks),n.uniform1f(this.location(r,`uTrails`),t.trails),n.uniform1f(this.location(r,`uPosterize`),t.posterize),n.uniform1f(this.location(r,`uInvert`),t.invert),n.bindFramebuffer(n.FRAMEBUFFER,a.framebuffer),n.viewport(0,0,this.width,this.height),n.drawArrays(n.TRIANGLES,0,3),n.useProgram(this.copy),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,a.texture),n.uniform1i(this.location(this.copy,`uImage`),0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.drawArrays(n.TRIANGLES,0,3),this.current=1-this.current,!0}},be=`film`,u=[{id:be,title:`Holiday in Brazil (film soundtrack)`,artist:`Nestor Amaral and His Continentals`,year:1957,src:null},{id:`song-of-india`,title:`Song of India`,artist:`Eugene Ormandy, Capitol Theatre Orchestra`,year:1923,src:`/media/music/song-of-india.mp3`,source:`https://archive.org/details/78_song-of-india_eugene-ormandy-capitol-theatre-orchestra-william-axt-rimsky-korsako_gbia3003767b`},{id:`la-paloma`,title:`La Paloma`,artist:`Marimba La Centro Americana`,year:1924,src:`/media/music/la-paloma-marimba.mp3`,source:`https://archive.org/details/78_la-paloma_marimba-la-centro-americana-yradier_gbia3020063b`},{id:`drowsy-waters`,title:`Wailana (Drowsy Waters)`,artist:`Ferera and Franchini`,year:1919,src:`/media/music/drowsy-waters.mp3`,source:`https://archive.org/details/78_wailana-drowsy-waters_ferera-franchini_gbia0054607a`},{id:`la-copa`,title:`La Copa del Olvido`,artist:`Max Dolin's Orchestra`,year:1922,src:`/media/music/la-copa-del-olvido.mp3`,source:`https://archive.org/details/78_the-cup-of-forgiveness-la-copa-del-olvido_max-dolins-orchestra-enrique-delfino_gbia0304802a`},{id:`havana`,title:`Havana`,artist:`San Jose Orchestra`,year:1923,src:`/media/music/havana-tango.mp3`,source:`https://archive.org/details/78_havana_san-jose-orchestra-schonberger-and-lyman_gbia0466659a`},{id:`la-golondrina`,title:`La Golondrina`,artist:`The Castillians`,year:1923,src:`/media/music/la-golondrina.mp3`,source:`https://archive.org/details/78_la-golondrina-the-swallow_the-castillians-serradell_gbia0448420a`},{id:`over-the-waves`,title:`Over the Waves`,artist:`Peerless Orchestra`,year:1920,src:`/media/music/over-the-waves.mp3`,source:`https://archive.org/details/78_over-the-waves-waltz_peerless-orchestra-juventino-rosas_gbia0178673a`},{id:`hawaiian-lullaby`,title:`Hawaiian Lullaby`,artist:`Honolulu Hawaiian Orchestra`,year:1924,src:`/media/music/hawaiian-lullaby.mp3`,source:`https://archive.org/details/78_hawaiian-lullaby_honolulu-hawaiian-orchestra-ferriss-bridges_gbia0476666a`},{id:`soon`,title:`Soon`,artist:`My Bloody Valentine`,year:1990,src:`/media/music/mbv-soon.mp3`},{id:`silence`,title:`Silence`,artist:`No accompaniment`,src:null}];function xe(e){let t=u.filter(e=>e.src!==null),n=t.findIndex(t=>t.id===e);if(n===-1)throw Error(`Not a record: ${e}`);return t[(n+1)%t.length]}function Se(e){let t=u.find(t=>t.id===e);if(!t)throw Error(`Unknown track: ${e}`);return t}function Ce(e,t){let n=u.findIndex(t=>t.id===e);if(n===-1)throw Error(`Unknown track: ${e}`);return u[(n+t+u.length)%u.length]}var we=class{video;onChange;onError;record=new Audio;muted=!1;current=Se(be);constructor(e,t,n){this.video=e,this.onChange=t,this.onError=n,this.record.preload=`none`,this.record.addEventListener(`ended`,()=>this.select(xe(this.current.id).id)),this.record.addEventListener(`error`,()=>this.onError(`${this.current.title} could not be loaded`)),e.addEventListener(`play`,()=>this.playRecord()),e.addEventListener(`pause`,()=>this.record.pause())}select(e){let t=Se(e);this.current=t,this.video.muted=this.muted||t.id!==`film`,t.src===null?(this.record.pause(),this.record.removeAttribute(`src`)):(this.record.src=t.src,this.playRecord()),this.onChange(t)}setVolume(e){this.video.volume=e,this.record.volume=e}toggleMute(){return this.muted=!this.muted,this.record.muted=this.muted,this.video.muted=this.muted||this.current.id!==`film`,this.muted}playRecord(){this.current.src===null||this.video.paused||this.record.play().catch(e=>this.onError(`${this.current.title} did not play: ${e.message}`))}},Te=16,Ee=3e3,De=10,Oe=2;function d(e){let t=document.getElementById(e);if(!t)throw Error(`Missing #${e}`);return t}var f=document.documentElement,p=d(`stage`),m=d(`film`),h=d(`projection`),g=d(`play`),_=d(`scrub`),ke=d(`time`),v=d(`theater`),y=d(`fullscreen`),b=d(`controls-toggle`),x=d(`speed`),Ae=d(`speed-value`),S=d(`gel-custom`),C=d(`volume`),je=d(`volume-value`),Me=d(`now-title`),Ne=d(`now-artist`),w=d(`track`),T=d(`effects-note`),E=d(`help`);for(let e of document.querySelectorAll(`[data-gel]`))e.dataset.gel!==`none`&&e.dataset.color&&(e.style.backgroundColor=e.dataset.color);function D(e){T.hidden=!1,T.textContent=e}var O=[...document.querySelectorAll(`[role="tab"]`)];function k(e,t){for(let t of O){let n=t===e;t.setAttribute(`aria-selected`,String(n)),t.tabIndex=n?0:-1,d(t.getAttribute(`aria-controls`)).hidden=!n}t&&e.focus()}O.forEach((e,t)=>{e.addEventListener(`click`,()=>k(e,!1)),e.addEventListener(`keydown`,e=>{let n={ArrowRight:t+1,ArrowLeft:t-1,Home:0,End:O.length-1};e.key in n&&(e.preventDefault(),e.stopPropagation(),k(O[(n[e.key]+O.length)%O.length],!0))})});var A=matchMedia(`(prefers-reduced-motion: reduce)`),j=o(),M=new Image;M.src=m.poster;var N=null,P=!1,F=[0,0];function Pe(){if(!P){P=!0;try{N=new ye(h),N.resize(...F),z()}catch(e){Fe(e)}}}for(let e of[`pointerdown`,`keydown`,`focusin`])document.addEventListener(e,Pe,{once:!0,capture:!0});function Fe(e){p.classList.add(`no-webgl`),m.controls=!0,D(`This browser can't run the projector effects (${e.message}), so the film plays as circulated. Speed and music still work.`);for(let e of document.querySelectorAll(`[data-effect], #gel-custom`))e.disabled=!0;for(let e of document.querySelectorAll(`[data-gel], [data-preset]`))e.disabled=!0}new ResizeObserver(([e])=>{let t=e.devicePixelContentBoxSize?.[0],n=Math.min(devicePixelRatio,Oe),r=t?t.inlineSize:e.contentRect.width*devicePixelRatio,i=t?t.blockSize:e.contentRect.height*devicePixelRatio,a=n/devicePixelRatio;F=[Math.max(1,Math.round(r*a)),Math.max(1,Math.round(i*a))],N?.resize(...F),z()}).observe(h);var Ie=0,Le=0,I=[0,0,0],L=0;function Re(e){let t=j,n=e/1e3,r=Math.floor(m.currentTime*Te)%997+(m.paused?0:Math.floor(n*Te)%7*.1);L=L*.6+(Math.random()*2-1)*.4;let i=[t.weave*(.0025*Math.sin(n*2.3)+.0012*(Math.random()-.5)),t.weave*(.004*Math.sin(n*1.7+1)+.002*(Math.random()-.5))];return t.tear>0&&n>=Ie&&(I=[Math.random(),.03+Math.random()*.06,t.tear],Le=n+.12,Ie=n+me(t.tear,Math.random())),n>Le&&(I=[0,.01,0]),{seed:r,time:n,printColor:t.printColor,gel:ue(de(t.gel)),gelDensity:t.gel===`none`?0:t.gelDensity,brightness:t.brightness,contrast:t.contrast,soft:t.soft,grain:t.grain,flickerGain:pe(L,t.flicker),weaveOffset:i,dust:t.dust,vignette:t.vignette,rgbSplit:t.rgbSplit,tear:I,blocks:t.blocks,trails:t.trails,posterize:t.posterize,invert:t.invert}}var R=!1,ze=!1;function Be(e){if(R=!1,!N)return;let t=m.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA;t&&(ze=!0);let n=t?m:ze?null:M.complete?M:null;n&&N.draw(n,Re(e))&&p.classList.add(`is-projecting`),m.paused||z()}function z(){!R&&N&&(R=!0,requestAnimationFrame(Be))}M.addEventListener(`load`,z),M.addEventListener(`error`,()=>{D(`The poster frame did not load. Press play to start the film.`)}),m.addEventListener(`loadeddata`,z),m.addEventListener(`seeked`,z);function Ve(e){let t=Math.floor(e);return`${Math.floor(t/60)}:${String(t%60).padStart(2,`0`)}`}function B(){let e=Number.isFinite(m.duration)?m.duration:Number(_.max);_.max=String(Math.floor(e)),_.value=String(Math.floor(m.currentTime)),ke.textContent=`${Ve(m.currentTime)} / ${Ve(e)}`}function V(){m.paused?m.play().catch(e=>{D(`The film did not start: ${e.message}`)}):m.pause()}m.addEventListener(`play`,()=>{g.textContent=`Pause`,p.classList.add(`is-playing`),e(`Play`,{program:He()}),z()}),m.addEventListener(`pause`,()=>{g.textContent=`Play`,p.classList.remove(`is-playing`)}),m.addEventListener(`timeupdate`,B),m.addEventListener(`loadedmetadata`,B),m.addEventListener(`error`,()=>{D(`The film could not be loaded. Check your connection and reload the page.`)}),g.addEventListener(`click`,V),h.addEventListener(`click`,V),_.addEventListener(`input`,()=>{m.currentTime=Number(_.value),B()});function H(e){m.currentTime=Math.max(0,Math.min(m.duration||1/0,m.currentTime+e))}function U(e){let t=ie(e);j.speed=t,m.playbackRate=t,m.preservesPitch=!1,x.value=String(t),Ae.textContent=ae(t);for(let e of document.querySelectorAll(`[data-speed]`))e.setAttribute(`aria-pressed`,String(Number(e.dataset.speed)===t))}function W(){for(let e of t){let t=d(`fx-${e.key}`);t.value=String(j[e.key]),d(`fx-${e.key}-value`).textContent=le(j[e.key])}for(let e of document.querySelectorAll(`[data-gel]`))e.setAttribute(`aria-pressed`,String(e.dataset.gel===j.gel));S.classList.toggle(`is-active`,j.gel.startsWith(`#`));for(let e of n){let t=i(j,e);d(`master-${e.id}`).value=String(t),d(`master-${e.id}-value`).textContent=a(e,t)}U(j.speed),z()}function He(){return document.querySelector(`[data-preset][aria-pressed="true"]`)?.dataset.preset??`custom`}function G(e){for(let t of document.querySelectorAll(`[data-preset]`))t.setAttribute(`aria-pressed`,String(t.dataset.preset===e))}for(let e of document.querySelectorAll(`[data-effect]`))e.addEventListener(`input`,()=>{let t=e.dataset.effect;j[t]=Number(e.value),G(null),W()});for(let e of n){let t=d(`master-${e.id}`);t.addEventListener(`input`,()=>{j=r(j,e,Number(t.value)),G(null),W()})}function Ue(e){let t=o();j.gel=e,e!==`none`&&(j.printColor===t.printColor&&(j.printColor=0),j.gelDensity===0&&(j.gelDensity=t.gelDensity)),G(null),W()}for(let e of document.querySelectorAll(`[data-gel]`))e.addEventListener(`click`,()=>Ue(e.dataset.gel??`none`));S.addEventListener(`input`,()=>Ue(S.value));for(let n of document.querySelectorAll(`[data-preset]`))n.addEventListener(`click`,()=>{let r=oe.find(e=>e.id===n.dataset.preset);if(!r)throw Error(`Unknown program: ${n.dataset.preset}`);j=se(r,A.matches),G(r.id),W();let i=t.some(e=>e.motion&&(r.settings[e.key]??0)>0);A.matches&&i&&D(`Your system asks for reduced motion, so grain, flicker, weave and tears start switched off. Turn them up with the sliders if you want them.`),e(`Program`,{program:r.id})});x.addEventListener(`input`,()=>{U(Number(x.value)),G(null)});for(let e of document.querySelectorAll(`[data-speed]`))e.addEventListener(`click`,()=>U(Number(e.dataset.speed)));function We(){j=o(),G(`circulated`),W()}d(`reset`).addEventListener(`click`,We);function Ge(e){Me.textContent=e.title,Ne.textContent=[e.artist,e.year].filter(Boolean).join(`, `),w.value=e.id}var K=new we(m,Ge,D);function q(t){K.select(t),e(`Music`,{track:t})}w.addEventListener(`change`,()=>q(w.value)),d(`track-prev`).addEventListener(`click`,()=>q(Ce(K.current.id,-1).id)),d(`track-next`).addEventListener(`click`,()=>q(Ce(K.current.id,1).id)),C.addEventListener(`input`,()=>{let e=Number(C.value);K.setVolume(e),je.textContent=`${Math.round(e*100)}%`}),K.setVolume(Number(C.value));var Ke=0;function J(){return f.classList.contains(`immersive`)}function Y(){p.classList.remove(`is-idle`),clearTimeout(Ke),J()&&(Ke=window.setTimeout(()=>{let e=document.activeElement?.matches(`:focus-visible`)??!1;!m.paused&&!e&&p.classList.add(`is-idle`)},Ee))}function X(e){f.classList.toggle(`theater`,e),v.setAttribute(`aria-pressed`,String(e))}function Z(e){f.classList.toggle(`immersive`,e),y.textContent=e?`Exit full screen`:`Full screen`,e||Q(!1),Y()}function Q(e){p.classList.toggle(`controls-open`,e),b.setAttribute(`aria-expanded`,String(e))}var qe=typeof p.requestFullscreen==`function`&&document.fullscreenEnabled;function $(){qe?document.fullscreenElement?document.exitFullscreen():(p.requestFullscreen().catch(e=>{D(`Full screen was refused: ${e.message}. The film fills the window instead.`),Z(!0)}),e(`Full screen`)):Z(!J())}document.addEventListener(`fullscreenchange`,()=>Z(document.fullscreenElement===p)),v.addEventListener(`click`,()=>{X(!f.classList.contains(`theater`)),f.classList.contains(`theater`)&&e(`Theater mode`)}),y.addEventListener(`click`,$),b.addEventListener(`click`,()=>{Q(!p.classList.contains(`controls-open`)),p.classList.contains(`controls-open`)&&d(`controls-close`).focus()}),d(`controls-close`).addEventListener(`click`,()=>{Q(!1),b.focus()});for(let e of[`pointermove`,`pointerdown`,`keydown`,`focusin`])p.addEventListener(e,Y);d(`help-open`).addEventListener(`click`,()=>E.showModal()),d(`help-close`).addEventListener(`click`,()=>E.close()),document.addEventListener(`keydown`,e=>{if(e.metaKey||e.ctrlKey||e.altKey||E.open)return;let t=e.target;if(t.matches(`input:not([type="range"]):not([type="radio"]), textarea, select`))return;let n=t.matches(`button, input, summary, a`);switch(e.key){case` `:if(n)return;e.preventDefault(),V();break;case`f`:case`F`:$();break;case`t`:case`T`:X(!f.classList.contains(`theater`));break;case`[`:U(j.speed-.05);break;case`]`:U(j.speed+.05);break;case`ArrowLeft`:if(n)return;H(-10);break;case`ArrowRight`:if(n)return;H(De);break;case`m`:case`M`:K.toggleMute()?D(`Sound is off. Press M to turn it back on.`):T.hidden=!0;break;case`r`:case`R`:We();break;case`?`:E.showModal();break;case`Escape`:p.classList.contains(`controls-open`)?(Q(!1),b.focus()):J()&&!document.fullscreenElement?Z(!1):f.classList.contains(`theater`)&&X(!1);break;default:return}Y()}),W(),B();