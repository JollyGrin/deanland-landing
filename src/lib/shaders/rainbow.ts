import { ShaderMaterial, Vector2 } from 'three';

const fragmentShader = `
precision mediump float;
#define GLSLIFY 1

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying vec2 v_uv;

vec3 rainbow(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.33, 0.67);

    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = v_uv;
    vec2 mouse = u_mouse - 0.5;
    
    float aspect = u_resolution.x/u_resolution.y;
    uv.x *= aspect;
    
    float dist = length(uv - mouse * vec2(aspect, 1.0));
    float distortionAmount = smoothstep(0.5, 0.0, dist) * 0.2;
    
    float t = uv.x * 0.5 + uv.y * 0.5 + u_time * 0.2;
    t += sin(dist * 5.0 - u_time) * distortionAmount;
    
    vec3 color = rainbow(t);
    color = mix(color, color * 1.2, distortionAmount);
    
    gl_FragColor = vec4(color, 1.0);
    
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

export const rainbowConfig = {
	uniforms,
	vertexShader,
	fragmentShader
};
