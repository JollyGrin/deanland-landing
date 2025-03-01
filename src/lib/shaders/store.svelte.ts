import { writable, type Writable } from 'svelte/store';
import { warpGridConfig } from './warpGrid';

type Shader = typeof warpGridConfig;

export const shaderStore: Writable<Shader> = writable(warpGridConfig);
export function setShader(shader: Shader) {
	shaderStore.set(shader);
}
