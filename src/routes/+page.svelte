<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { fade } from 'svelte/transition';
	import { rainbowConfig, setShader, warpGridConfig, glitchConfig } from '$lib/shaders';
	import { onMount } from 'svelte';
	import IconInsta from '$lib/icons/IconInsta.svelte';
	import IconTwitter from '$lib/icons/IconTwitter.svelte';
	import { PROJECTS } from '$lib/constants-projects';

	const shaderOptions = {
		'Warp Grid': warpGridConfig,
		Rainbow: rainbowConfig,
		Glitch: glitchConfig
	};
	type ShaderKey = keyof typeof shaderOptions;
	let shader = $state('Warp Grid');

	onMount(() => {
		const cacheShaderKey = localStorage.getItem('shader-key');
		if (cacheShaderKey) {
			shader = cacheShaderKey;
			setShader(shaderOptions[cacheShaderKey as ShaderKey]);
		}
	});
</script>

<div class="font-jersey fixed inset-0 -z-10">
	<Canvas>
		<Scene />
	</Canvas>
</div>

<main class="relative min-h-screen w-full">
	<div class="absolute top-0 flex w-full items-center justify-between p-4">
		<p class="font-ovo text-xs text-white opacity-40">
			<i class="opacity-70">est:</i> november 24, 2020
		</p>
		<select
			tabindex="0"
			class="font-jersey sm:text-md mx-2 rounded bg-white/20 px-4 py-1 text-xl"
			bind:value={shader}
			onchangecapture={(e: any) => {
				if (!e?.target?.value) return;
				const key = e.target.value as ShaderKey;
				localStorage.setItem('shader-key', key);
				setShader(shaderOptions[key]);
			}}
		>
			{#each Object.entries(shaderOptions) as [label, option]}
				<option class="text-4xl">
					{label}
				</option>
			{/each}
		</select>
	</div>
	<header class="z-50 grid h-screen w-full place-items-center transition-all duration-500">
		<div class="flex flex-col items-center gap-2 text-white transition-all duration-500">
			<h1
				class="text-shadow font-jersey text-7xl tracking-wide drop-shadow-md transition-all duration-500 md:text-8xl"
			>
				dean.land
			</h1>

			<div class="flex gap-2">
				<a
					href="https://www.instagram.com/deandotland/"
					class="w-10 opacity-30 transition-all hover:scale-110 hover:text-orange-200 hover:opacity-100 md:w-8"
				>
					<IconInsta />
				</a>

				<a
					href="https://x.com/deandotland"
					class="w-10 opacity-30 transition-all hover:scale-110 hover:text-orange-200 hover:opacity-100 md:w-8"
				>
					<IconTwitter />
				</a>
			</div>
		</div>
	</header>

	<section class="relative z-10 mx-auto max-w-7xl px-4 py-16" transition:fade={{ duration: 300 }}>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each PROJECTS as project}
				<a href={project.url} target="_blank">
					<div
						class="group relative aspect-video overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
					>
						{#if project.type === 'video'}
							<video
								class="h-full w-full object-cover"
								src={project.src}
								muted
								loop
								playsinline
								autoplay
								preload="auto"
							></video>
						{:else}
							<img class="h-full w-full object-cover" src={project.src} alt={project.title} />
						{/if}
						<div
							class="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4 opacity-100 transition-opacity duration-300 group-hover:opacity-100 md:opacity-20"
						>
							<h3 class="text-lg font-semibold text-white">
								{project.title}
							</h3>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		background: black;
	}

	.text-shadow {
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
