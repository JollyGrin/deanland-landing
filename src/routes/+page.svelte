<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
</script>

{#snippet hero()}
	<div class="absolute top-0 z-50 grid h-full w-full place-items-center p-3">hello world</div>
{/snippet}

<div class="relative h-screen w-screen">
	{@render hero()}
	<Canvas>
		<Scene />
	</Canvas>
</div>
