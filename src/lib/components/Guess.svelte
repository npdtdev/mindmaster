<script lang="ts">
	import { playColor } from '$lib/play-color';
	import { InteractiveObject, T } from '@threlte/core';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Play } from '$types';

	export let position: [x: number, y: number, z: number] = [0, 0, 0];
	export let scale: [x: number, y: number, z: number] = [1, 1, 1];
	export let play: Play = Play.None;

	let turn = getContext<Writable<number>>('turn');
	let selectedIdx = getContext<Writable<number>>('selected');

	export let i = 0;
	export let j = 0;
</script>

<T.Group {position} {scale}>
	<T.Mesh let:ref castShadow>
		<InteractiveObject
			object={ref}
			interactive
			on:click={() => {
				if (i == $turn) {
					$selectedIdx = j;
				}
			}}
		/>
		<T.SphereGeometry />
		{#if play == Play.One}
			<T.MeshToonMaterial
				color={$turn == i && $selectedIdx == j ? playColor.one.selected_color : playColor.one.color}
			/>
		{:else if play == Play.Two}
			<T.MeshToonMaterial
				color={$turn == i && $selectedIdx == j ? playColor.two.selected_color : playColor.two.color}
			/>
		{:else if play == Play.Three}
			<T.MeshToonMaterial
				color={$turn == i && $selectedIdx == j
					? playColor.three.selected_color
					: playColor.three.color}
			/>
		{:else if play == Play.Four}
			<T.MeshToonMaterial
				color={$turn == i && $selectedIdx == j
					? playColor.four.selected_color
					: playColor.four.color}
			/>
		{:else if play == Play.Five}
			<T.MeshToonMaterial
				color={$turn == i && $selectedIdx == j
					? playColor.five.selected_color
					: playColor.five.color}
			/>
		{:else if play == Play.Six}
			<T.MeshToonMaterial
				color={$turn == i && $selectedIdx == j ? playColor.six.selected_color : playColor.six.color}
			/>
		{:else}
			<T.MeshToonMaterial
				color={$turn == i && $selectedIdx == j
					? playColor.none.selected_color
					: playColor.none.color}
			/>
		{/if}
	</T.Mesh>
</T.Group>
