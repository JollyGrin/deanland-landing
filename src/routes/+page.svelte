<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { fade } from 'svelte/transition';

	// Example projects data - replace with your actual data
	const projects = [
		{
			title: 'threejs decals',
			type: 'video',
			src: 'https://jollygrin.github.io/threejs-decal/decal.webm'
		}
		// { title: 'Project 2', type: 'image', src: '/path/to/image1.jpg' },
		// { title: 'Project 3', type: 'video', src: '/path/to/video2.mp4' },
		// { title: 'Project 4', type: 'image', src: '/path/to/image2.jpg' },
		// { title: 'Project 5', type: 'video', src: '/path/to/video3.mp4' },
		// { title: 'Project 6', type: 'image', src: '/path/to/image3.jpg' }
	];
</script>

<div class="font-jersey fixed inset-0 -z-10">
	<Canvas>
		<Scene />
	</Canvas>
</div>

<main class="relative min-h-screen w-full">
	<div class="absolute top-0 flex w-full justify-end p-4">
		<div class="">dsahjk</div>
	</div>
	<header class="z-50 grid h-screen w-full place-items-center transition-all duration-500">
		<div class="flex flex-col items-center text-white transition-all duration-500">
			<h1
				class="text-shadow font-jersey text-8xl font-bold tracking-wide drop-shadow-md transition-all duration-500"
			>
				dean.land
			</h1>
			<p class="font-ovo text-lg">
				<i class="opacity-30">est:</i> november 24, 2020
			</p>
		</div>
	</header>

	<!-- Projects Grid -->
	<section class="relative z-10 mx-auto max-w-7xl px-4 py-16" transition:fade={{ duration: 300 }}>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each projects as project}
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
							onmouseover={(e: any) => {
								console.log('hit');
								console.log(e);
								e?.target?.play();
							}}
							onmouseleave={(e: any) => e?.target?.pause()}
						></video>
					{:else}
						<img class="h-full w-full object-cover" src={project.src} alt={project.title} />
					{/if}
					<div
						class="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					>
						<h3 class="text-lg font-semibold text-white">
							{project.title}
						</h3>
					</div>
				</div>
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
