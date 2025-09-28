import React from 'react';
import PropTypes from 'prop-types';
import { Shaders, Node, GLSL } from 'gl-react';

const shaders = Shaders.create({
	colorify: {
		frag: GLSL`
			precision highp float;
			varying vec2 uv;
			uniform sampler2D children, colorScale;
			uniform bool hasColorScale;
			
			float greyscale(vec3 c) { 
				return 0.2125 * c.r + 0.7154 * c.g + 0.0721 * c.b; 
			}
			
			void main() {
				vec4 original = texture2D(children, uv);
				
				if (hasColorScale) {
					vec4 newcolor = texture2D(colorScale, vec2(greyscale(original.rgb), 0.5));
					gl_FragColor = vec4(newcolor.rgb, original.a * newcolor.a);
				} else {
					gl_FragColor = original;
				}
			}
		`,
	},
});

const ColorifyShader = ({ children, colorScale }) => {
	const hasColorScale = colorScale !== null;
	
	return (
		<Node
			shader={shaders.colorify}
			uniforms={{
				colorScale: hasColorScale ? colorScale : null,
				hasColorScale,
				children,
			}}
		/>
	);
};

ColorifyShader.propTypes = {
	colorScale: PropTypes.any,
	children: PropTypes.any.isRequired,
};

ColorifyShader.defaultProps = {
	colorScale: null,
};

export default ColorifyShader;
