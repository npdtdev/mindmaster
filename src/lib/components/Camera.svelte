<script lang="ts">
	import { OrbitControls, PerspectiveCamera } from '@threlte/core';
	export let position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	export let lookAt: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	const enableZoom = false;
	const enableRotate = false;
	const enablePan = false;
</script>

<PerspectiveCamera far={100} fov={30} bind:position bind:lookAt>
	<OrbitControls {enableZoom} {enableRotate} {enablePan} />
</PerspectiveCamera>
