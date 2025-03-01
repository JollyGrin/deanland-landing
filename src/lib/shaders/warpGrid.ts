import { ShaderMaterial, Vector2 } from 'three';

const fragmentShader = `
	precision mediump float;
	#define GLSLIFY 1

	uniform float u_time;
	uniform vec2 u_mouse;
	uniform vec2 u_resolution;
	varying vec2 v_uv;

	vec2 rotate2D(vec2 p, float angle) {
		float s = sin(angle), c = cos(angle);
		return mat2(c, -s, s, c) * p;
	}

	float gridPattern(vec2 p) {
		vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p);
		return min(grid.x, grid.y);
	}

	float isoGrid(vec2 p) {
		p = rotate2D(p, 3.14159 / 4.0);
		vec2 grid1 = p;
		vec2 grid2 = rotate2D(p, 3.14159 / 3.0);
		return min(gridPattern(grid1 * 8.0), gridPattern(grid2 * 8.0));
	}

	void main() {
		vec2 uv = v_uv;
		
		// Improved aspect ratio handling
		float aspect = u_resolution.x / u_resolution.y;
		vec2 adjustedUV = uv;
		adjustedUV.x = ((uv.x - 0.5) * aspect) + 0.5;
		
		vec2 mouseInfluence = u_mouse - adjustedUV;
		float mouseDist = length(mouseInfluence);
		float distortionAmount = smoothstep(0.3, 0.0, mouseDist) * 0.2;
		
		vec2 distortedUV = adjustedUV + normalize(mouseInfluence) * distortionAmount;
		
		float grid = isoGrid(distortedUV + u_time * 0.1);
		
		vec3 color1 = vec3(0.2, 0.4, 0.8);
		vec3 color2 = vec3(0.9, 0.3, 0.5);
		vec3 bgColor = vec3(0.1, 0.1, 0.2);
		
		float gridLines = smoothstep(0.8, 0.2, grid);
		vec3 finalColor = mix(bgColor, mix(color1, color2, sin(u_time) * 0.5 + 0.5), gridLines);
		
		gl_FragColor = vec4(finalColor, 1.0);
		#include <colorspace_fragment>
	}`;

const vertexShader = `
	varying vec2 v_uv;
	
	void main() {
		v_uv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}`;

const uniforms = {
	u_time: { value: 0 },
	u_mouse: { value: new Vector2(0.5, 0.5) },
	u_resolution: { value: new Vector2(1, 1) }
};

export const warpGridConfig = {
	uniforms,
	vertexShader,
	fragmentShader
};
