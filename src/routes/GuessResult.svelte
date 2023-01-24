<script lang="ts">
	import { playResultColor } from '$lib/play-result-color';
	import { T } from '@threlte/core';
	import { PlayResult } from '../types/play-result.enum';
	export let position: [x: number, y: number, z: number] = [0, 0, 0];
	export let scale: [x: number, y: number, z: number] = [1, 1, 1];
	export let result: PlayResult = PlayResult.None;
</script>

<T.Mesh castShadow {position} {scale}>
	<T.BoxGeometry />
	{#if result == PlayResult.Color}
		<T.MeshToonMaterial color={playResultColor.color.color} />
	{:else if result == PlayResult.Position}
		<T.MeshToonMaterial color={playResultColor.position.color} />
	{/if}
</T.Mesh>
