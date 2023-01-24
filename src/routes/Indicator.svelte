<script lang="ts">
	import { T } from '@threlte/core';

	export let color: string = '#ffffff';
	export let radius: number = 0.2;
	export let position: [x: number, y: number, z: number] = [0, 0, 0];
</script>

<T.Mesh bind:position>
	<T.SphereGeometry args={[radius]} />
	<T.MeshToonMaterial {color} />
</T.Mesh>
