import React from 'react';
import PropTypes from 'prop-types';
import { Shaders, Node, GLSL } from 'gl-react';

const shaders = Shaders.create({
	distort: {
		frag: GLSL`
			precision highp float;
			varying vec2 uv;
			uniform sampler2D children;
			uniform float distortion;
			uniform float waveIntensity;
			uniform float timeOffset;
			
			void main() {
				vec2 center = vec2(0.5, 0.5);
				vec2 offset = uv - center;
				float distance = length(offset);
				
				// Barrel distortion
				float distortionFactor = 1.0 + distortion * distance * distance;
				vec2 distortedUV = center + offset / distortionFactor;
				
				// Wave distortion
				if (waveIntensity > 0.0) {
					float wave = sin(distortedUV.x * 10.0 + timeOffset) * waveIntensity;
					distortedUV.y += wave;
					
					float wave2 = cos(distortedUV.y * 8.0 + timeOffset * 1.3) * waveIntensity * 0.5;
					distortedUV.x += wave2;
				}
				
				// Check if UV is within bounds
				if (distortedUV.x >= 0.0 && distortedUV.x <= 1.0 && 
					distortedUV.y >= 0.0 && distortedUV.y <= 1.0) {
					gl_FragColor = texture2D(children, distortedUV);
				} else {
					// Black border for out-of-bounds
					gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
				}
			}
		`,
	},
});

const DistortShader = ({ 
	children, 
	distortion, 
	waveIntensity, 
	timeOffset 
}) => (
	<Node
		shader={shaders.distort}
		uniforms={{
			children,
			distortion,
			waveIntensity,
			timeOffset,
		}}
	/>
);

DistortShader.propTypes = {
	children: PropTypes.any.isRequired,
	distortion: PropTypes.number.isRequired,
	waveIntensity: PropTypes.number.isRequired,
	timeOffset: PropTypes.number.isRequired,
};

export default DistortShader;
