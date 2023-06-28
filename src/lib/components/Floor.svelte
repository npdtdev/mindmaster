<script lang="ts">
	import { T } from '@threlte/core';

	export let color: string = '#e1f7f6';
	export let position: [x: number, y: number, z: number] = [0, 0, 0];
	export let scale: [x: number, y: number, z: number] = [1, 1, 1];
</script>

<T.Mesh receiveShadow {position} {scale}>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial {color} />
</T.Mesh>
