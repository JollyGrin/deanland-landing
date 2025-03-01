<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { ShaderMaterial, Vector2, DoubleSide } from 'three';
	import { browser } from '$app/environment';
	import { warpGridConfig } from '$lib/shaders/warpGrid';

	const shaderMaterial = new ShaderMaterial({
		...warpGridConfig,
		side: DoubleSide
	});

	// Get canvas size for resolution
	const { renderer } = useThrelte();
	$effect(() => {
		if (browser && renderer) {
			const size = renderer.getSize(new Vector2());
			shaderMaterial.uniforms.u_resolution.value.set(size.x, size.y);
		}
	});

	$effect(() => {
		if (browser) {
			mouseHandler = (e: MouseEvent) => {
				const rect = (e.target as HTMLElement).getBoundingClientRect();
				const x = (e.clientX - rect.left) / rect.width;
				const y = 1 - (e.clientY - rect.top) / rect.height; // Flip Y coordinate
				shaderMaterial.uniforms.u_mouse.value.set(x, y);
			};
		}
	});

	// Update time uniform
	useTask((delta) => {
		shaderMaterial.uniforms.u_time.value += delta;
	});

	// Handle mouse movement
	let mouseHandler: (e: MouseEvent) => void = $state(() => {});
</script>

<svelte:window on:mousemove={mouseHandler} />

<T.PerspectiveCamera
	makeDefault
	position={[0, 0, 2]}
	oncreate={(ref) => {
		ref.lookAt(0, 0, 0);
	}}
>
	<OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
</T.PerspectiveCamera>

<T.Mesh>
	<T.PlaneGeometry args={[2, 2]} />
	<T is={shaderMaterial} />
</T.Mesh>
