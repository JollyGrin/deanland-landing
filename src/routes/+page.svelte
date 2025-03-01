<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
</script>

{#snippet hero()}
	<div class="absolute top-0 z-50 grid h-full w-full place-items-center">
		<p class="text-shadow text-4xl font-bold text-white drop-shadow-md">dean.land</p>
	</div>
{/snippet}

<div class="fixed inset-0 h-screen w-screen overflow-hidden">
	{@render hero()}
	<Canvas>
		<Scene />
	</Canvas>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
