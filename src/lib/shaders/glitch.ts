import { ShaderMaterial, Vector2 } from 'three';

const fragmentShader = `
precision mediump float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying vec2 v_uv;

// Hash function for randomness
float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

// 2D noise function
float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    fp = fp * fp * (3.0 - 2.0 * fp);
    
    float n = ip.x + ip.y * 57.0;
    
    float a = hash(n);
    float b = hash(n + 1.0);
    float c = hash(n + 57.0);
    float d = hash(n + 58.0);
    
    return mix(mix(a, b, fp.x), mix(c, d, fp.x), fp.y);
}

// VHS tracking distortion
float vhsTrackingNoise(vec2 uv, float time) {
    float noise_y = noise(vec2(time * 5.0, uv.y * 0.5));
    float tracking = step(0.98, noise_y);
    float trackingPos = step(uv.y, noise_y) * step(noise_y - 0.1, uv.y);
    return tracking + trackingPos * 0.5;
}

// Diamond pattern
float diamondPattern(vec2 uv, float scale, float offset) {
    vec2 id = floor(uv * scale);
    vec2 gv = fract(uv * scale) - 0.5;
    
    // Diamond distance
    float d = abs(gv.x) + abs(gv.y);
    
    // Add some variation based on position
    float variation = noise(id + offset);
    
    return smoothstep(0.7 + variation * 0.3, 0.6 + variation * 0.3, d);
}

// RGB shift
vec3 rgbShift(vec2 uv, float amount, float time) {
    float angle = time * 0.5;
    vec2 offset = amount * vec2(cos(angle), sin(angle));
    
    float r = diamondPattern(uv - offset * 0.3, 10.0, u_time * 0.1);
    float g = diamondPattern(uv, 10.0, u_time * 0.1 + 1.0);
    float b = diamondPattern(uv + offset * 0.3, 10.0, u_time * 0.1 + 2.0);
    
    return vec3(r, g, b);
}

// Glitch effect
float glitchEffect(vec2 uv, float time) {
    float glitchLine = step(0.98, noise(vec2(floor(time * 10.0), floor(uv.y * 50.0))));
    float glitchShift = noise(vec2(floor(time * 10.0), floor(uv.y * 30.0))) * 0.1;
    
    return glitchLine * glitchShift;
}

// Scanlines
float scanlines(vec2 uv, float time) {
    return 0.9 + 0.1 * sin(uv.y * 600.0 + time * 5.0);
}

void main() {
    // Adjust for aspect ratio
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    // Mouse influence
    float mouseDistance = distance(uv / aspect, u_mouse);
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDistance) * 0.5;
    
    // Apply glitch and VHS effects
    float glitch = glitchEffect(uv, u_time);
    uv.x += glitch;
    
    float tracking = vhsTrackingNoise(uv, u_time);
    
    // Create diamond pattern with RGB shift
    float scale = 8.0 + mouseInfluence * 8.0;
    vec3 diamonds = rgbShift(uv, 0.03 + mouseInfluence * 0.1, u_time);
    
    // Add scanlines
    float scan = scanlines(uv, u_time);
    
    // Create color palette
    vec3 bgColor = vec3(0.05, 0.05, 0.1);
    vec3 diamondColor1 = vec3(0.9, 0.2, 0.3);
    vec3 diamondColor2 = vec3(0.2, 0.8, 0.9);
    
    // Mix colors based on diamond pattern
    vec3 color = mix(bgColor, mix(diamondColor1, diamondColor2, sin(u_time * 0.5) * 0.5 + 0.5), diamonds);
    
    // Apply VHS tracking and scanlines
    color *= mix(1.0, 0.0, tracking);
    color *= scan;
    
    // Add some static noise
    float staticNoise = noise(uv * 500.0 + u_time * 100.0);
    color = mix(color, vec3(staticNoise), 0.05);
    
    // Add occasional horizontal glitch lines
    float horzGlitch = step(0.995, noise(vec2(floor(u_time * 20.0), floor(uv.y * 100.0))));
    color = mix(color, vec3(1.0), horzGlitch * 0.8);
    
    // Add subtle vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length((uv / aspect - 0.5) * 2.0));
    color *= vignette;
    
    // Final color
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

export const glitchConfig = {
	uniforms,
	vertexShader,
	fragmentShader
};
