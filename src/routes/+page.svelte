<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
</script>

{#snippet hero()}
	<div class="absolute top-0 z-50 grid h-full w-full place-items-center overflow-auto">
		<div class="flex flex-col items-center text-white">
			<p class="text-shadow text-8xl font-bold drop-shadow-md">dean.land</p>
			<p class="font-ovo text-lg"><i class="opacity-30">est:</i> november 24, 2020</p>
		</div>
	</div>
{/snippet}

<div class="font-jersey fixed inset-0 h-screen w-screen overflow-hidden">
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
