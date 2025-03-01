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

	const { renderer, size } = useThrelte();

	// Update resolution on size changes
	$effect(() => {
		if (browser && renderer) {
			const pixelRatio = window.devicePixelRatio || 1;
			shaderMaterial.uniforms.u_resolution.value.set(
				$size.width * pixelRatio,
				$size.height * pixelRatio
			);
		}
	});

	// Update time uniform
	useTask((delta) => {
		shaderMaterial.uniforms.u_time.value += delta;
	});

	// Handle mouse movement using viewport coordinates
	let mouseHandler: (e: MouseEvent) => void = $state(() => {});
	$effect(() => {
		if (browser) {
			mouseHandler = (e: MouseEvent) => {
				// Use viewport coordinates instead of element-relative coordinates
				const x = e.clientX / window.innerWidth;
				const y = 1 - (e.clientY / window.innerHeight); // Flip Y coordinate
				shaderMaterial.uniforms.u_mouse.value.set(x, y);
			};
		}
	});

	// Calculate plane size based on aspect ratio and camera distance
	const cameraDistance = 2;
	let planeWidth = $state(2);
	let planeHeight = $state(2);
	$effect(() => {
		if ($size.width && $size.height) {
			// Calculate the visible height at the camera distance
			const fov = 75;
			const vFov = (fov * Math.PI) / 180;
			const visibleHeight = 2 * Math.tan(vFov / 2) * cameraDistance;
			planeWidth = visibleHeight * ($size.width / $size.height);
			planeHeight = visibleHeight;
		}
	});
</script>

<svelte:window on:mousemove={mouseHandler} />

<T.PerspectiveCamera
	makeDefault
	position={[0, 0, cameraDistance]}
	fov={75}
	oncreate={(ref) => {
		ref.lookAt(0, 0, 0);
	}}
>
	<OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
</T.PerspectiveCamera>

<T.Mesh>
	<T.PlaneGeometry args={[planeWidth, planeHeight]} />
	<T is={shaderMaterial} />
</T.Mesh>
