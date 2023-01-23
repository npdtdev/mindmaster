<script lang="ts">
	import {
		Canvas,
		InteractiveObject,
		PerspectiveCamera,
		OrbitControls,
		T,
		Object3DInstance
	} from '@threlte/core';

	import { useId } from '@svelteuidev/composables';
	import { degToRad } from 'three/src/math/MathUtils';
	import { createGame } from '$lib/game';
	import { Play } from '../types/play.enum';
	import { PlaneGeometry, Vector3, Line as L } from 'three';
	import { playColor } from '$lib/play-color';
	import { PlayResult } from '../types/play-result.enum';
	import { playResultColor } from '$lib/play-result-color';
	import { GameResult } from '../types/game-result.enum';

	const v1 = new Vector3(24, 32, 20);
	const v2 = new Vector3(24, 32, -30);
	const cameraLineGeometry = new PlaneGeometry().setFromPoints([v1, v2]);

	let selectedIdx: 0 | 1 | 2 | 3 = 0;
	$: (selectedIdx = 0) && $currentTurnStore;

	const handleSetMove = (play: Play) => {
		setMove(selectedIdx, play);
		selectedIdx = ((selectedIdx + 1) % 4) as 0 | 1 | 2 | 3;
	};
	let camera = {
		position: {
			x: 11,
			y: 16.5,
			z: 14
		},
		lookAt: {
			x: 8,
			y: 12,
			z: 10
		},
		frac: 0
	};

	let menuOpen = true;

	const line = new L(cameraLineGeometry);
	const vt1 = new Vector3(5, 0, 0);
	const vt2 = new Vector3(5, 0, -50);
	const targetLine = new L(new PlaneGeometry().setFromPoints([vt1, vt2]));

	const getNextCamera = (
		frac: number
	): {
		position: { x: number; y: number; z: number };
		lookAt: {
			x: number;
			y: number;
			z: number;
		};
		frac: number;
	} => {
		const valPos = new Vector3().lerpVectors(v1, v2, frac);
		const valLook = new Vector3().lerpVectors(vt1, vt2, frac);

		return {
			position: {
				x: valPos.x,
				y: valPos.y,
				z: valPos.z
			},
			lookAt: {
				x: valLook.x,
				y: valLook.y,
				z: valLook.z
			},
			frac: frac
		};
	};
	let uuid = useId();
	$: ({
		nextTurn,
		setMove,
		boardStore,
		gameResultStore,
		playResultStore,
		currentMoveStore,
		currentTurnStore,
		targetResultStore,
		turns,
		id
	} = createGame(12, uuid));

	// has to be after creating game
	$: camera = getNextCamera(viewTurn / turns);

	const reset = () => {
		uuid = useId();
	};

	$: viewTurn = $currentTurnStore;
	let modalInput = false;
	$: modalInput = $gameResultStore != GameResult.Playing;
</script>

<svelte:window
	on:wheel={({ deltaY }) => {
		const change = camera.frac + deltaY * 0.0001;
		if (change < 1 && change > 0) {
			camera = getNextCamera(camera.frac + deltaY * 0.0001);
		}
	}}
/>

<div class="h-screen w-full relative">
	<Canvas>
		<T.DirectionalLight position.y={4} intensity={0.8} color="FFFFFF" castShadow />
		<T.AmbientLight intensity={0.5} color="B1E1FF" />
		<!-- Camera -->
		<!-- <T.Group position.x={-4}> -->
		<PerspectiveCamera fov={32} bind:position={camera.position} bind:lookAt={camera.lookAt}>
			<OrbitControls
				maxPolarAngle={degToRad(80)}
				enableZoom={false}
				enableRotate={false}
				enablePan={false}
			/>
		</PerspectiveCamera>

		<!-- Spheres and Boxes -->
		{#each [...$boardStore, $targetResultStore] as t, i}
			{#if $currentTurnStore >= i}
				{#each t as play, j}
					{#if $currentTurnStore == i && selectedIdx == j && $gameResultStore == GameResult.Playing}
						<T.Group position.z={-i * 4.5} position.x={j * 2.5} position.y={3}>
							<T.Mesh>
								<T.SphereGeometry args={[0.2]} />
								<T.MeshToonMaterial color={'red'} />
							</T.Mesh>
						</T.Group>
					{/if}
					<T.Group position.z={-i * 4.5} position.x={j * 2.5} position.y={0.5}>
						<T.Mesh position.y={0.5} let:ref castShadow>
							<!-- Add interaction -->
							<InteractiveObject
								object={ref}
								interactive
								on:click={() => {
									if (i == $currentTurnStore) {
										//@ts-ignore
										selectedIdx = j;
										menuOpen = true;
									}
								}}
							/>
							<T.SphereGeometry />
							{#if play == Play.One}
								<T.MeshToonMaterial
									color={$currentTurnStore == i && selectedIdx == j
										? playColor.one.selected_color
										: playColor.one.color}
								/>
							{:else if play == Play.Two}
								<T.MeshToonMaterial
									color={$currentTurnStore == i && selectedIdx == j
										? playColor.two.selected_color
										: playColor.two.color}
								/>
							{:else if play == Play.Three}
								<T.MeshToonMaterial
									color={$currentTurnStore == i && selectedIdx == j
										? playColor.three.selected_color
										: playColor.three.color}
								/>
							{:else if play == Play.Four}
								<T.MeshToonMaterial
									color={$currentTurnStore == i && selectedIdx == j
										? playColor.four.selected_color
										: playColor.four.color}
								/>
							{:else if play == Play.Five}
								<T.MeshToonMaterial
									color={$currentTurnStore == i && selectedIdx == j
										? playColor.five.selected_color
										: playColor.five.color}
								/>
							{:else if play == Play.Six}
								<T.MeshToonMaterial
									color={$currentTurnStore == i && selectedIdx == j
										? playColor.six.selected_color
										: playColor.six.color}
								/>
							{:else}
								<T.MeshToonMaterial
									color={$currentTurnStore == i && selectedIdx == j
										? playColor.none.selected_color
										: playColor.none.color}
								/>
							{/if}
						</T.Mesh>
					</T.Group>
				{/each}
			{/if}
			{#if $currentTurnStore > i}
				<T.Group position.z={-i * 4.5} position.x={9.0} position.y={0.4}>
					{#each Object.values($playResultStore.at(i) ?? []).filter((el) => el != PlayResult.None) as res, d}
						<T.Mesh castShadow position.x={d * 0.5}>
							<T.BoxGeometry args={[0.4, 0.4, 0.4]} />
							{#if res == PlayResult.Color}
								<T.MeshToonMaterial color={playResultColor.color.color} />
							{:else if res == PlayResult.Position}
								<T.MeshToonMaterial color={playResultColor.position.color} />
							{/if}
						</T.Mesh>
					{/each}
				</T.Group>
			{/if}
		{/each}

		<!-- Floor -->
		<T.Mesh
			receiveShadow
			position.x={4.5}
			position.y={-1}
			position.z={-27}
			scale.x={13}
			scale.y={2}
			scale.z={60}
		>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshStandardMaterial color="white" />
		</T.Mesh>

		<!-- Camera path -->
		<Object3DInstance object={line} />
		<Object3DInstance object={targetLine} />
	</Canvas>

	<div class="absolute top-5 left-0 flex flex-col items-center p-2 select-none">
		{#if $currentTurnStore < turns}
			<h1>Turn</h1>
			<h1>{`${$currentTurnStore + 1}/${turns}`}</h1>
		{/if}

		<button
			on:click={() => {
				// Cant as it doesn't change value
				// viewTurn = $currentTurnStore;
				camera = getNextCamera(viewTurn / turns);
			}}
			class="btn btn-circle mx-auto my-2"
			>&#10687;
		</button>
		<label for="instructions" class="btn btn-circle">?</label>
	</div>
	<div class="absolute top-10 right-0 p-2 flex flex-col gap-4">
		<button
			class="btn btn-secondary"
			on:click={() => {
				reset();
			}}>New game</button
		>

		{#if !$currentMoveStore.some((el) => el == Play.None) && $currentTurnStore < turns && $gameResultStore == GameResult.Playing}
			<button
				class="btn btn-primary"
				on:click={() => {
					nextTurn();
				}}>Proceed</button
			>
		{/if}
	</div>

	{#if !($gameResultStore != GameResult.Playing)}
		<div class="collapse absolute bottom-0">
			<input type="checkbox" bind:checked={menuOpen} />
			<div class="collapse-title text-xl font-bold mx-auto w-full">&#8963;</div>
			<div class="collapse-content">
				<div class="flex flex-row now-wrap gap-2">
					<button
						on:click={() => {
							handleSetMove(Play.One);
						}}
						class=" bg-base-100 shadow-xl p-4 mask mask-circle"
						style="background-color: {playColor.one.color};"
					/>
					<button
						on:click={() => {
							handleSetMove(Play.Two);
						}}
						class=" bg-base-100 shadow-xl p-4 mask mask-circle"
						style="background-color: {playColor.two.color};"
					/>
					<button
						on:click={() => {
							handleSetMove(Play.Three);
						}}
						class=" bg-base-100 shadow-xl p-4 mask mask-circle"
						style="background-color: {playColor.three.color};"
					/>
					<button
						on:click={() => {
							handleSetMove(Play.Four);
						}}
						class=" bg-base-100 shadow-xl p-4 mask mask-circle"
						style="background-color: {playColor.four.color};"
					/>
					<button
						on:click={() => {
							handleSetMove(Play.Five);
						}}
						class=" bg-base-100 shadow-xl p-4 mask mask-circle"
						style="background-color: {playColor.five.color};"
					/>
					<button
						on:click={() => {
							handleSetMove(Play.Six);
						}}
						class=" bg-base-100 shadow-xl p-4 mask mask-circle"
						style="background-color: {playColor.six.color};"
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
<label for="my-modal" class="btn" hidden />
<input type="checkbox" id="my-modal" class="modal-toggle" bind:checked={modalInput} />
<div class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">{$gameResultStore == GameResult.Won ? 'Win' : 'Lose'}</h3>
		<p class="py-4">
			{$gameResultStore == GameResult.Won ? 'You have won' : "Mmm, you couldn't quite guess it."}
		</p>
		<div class="modal-action">
			<label for="my-modal" class="btn">Close</label>
			<button
				class="btn"
				on:click={() => {
					reset();
				}}>New Game</button
			>
		</div>
	</div>
</div>
<input type="checkbox" id="instructions" class="modal-toggle" />
<label for="instructions" class="modal cursor-pointer">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Instructions</h3>
		<p class="py-4">
			Try to guess the pattern in both order and color within <span class="font-bold">12 turns</span
			>. Each guess is made by placing a row of balls on the board.
		</p>
		<p class="py-4">
			Once placed, you'll receive feedback from zero to four pegs besides the guess. A
			<span class="text-red-500 font-bold">red</span>
			peg is placed for each ball from the guess which is correct in both color and position. A
			<span class="text-blue-500 font-bold">blue</span>
			peg indicates the existence of a correct color ball placed in the wrong position.
		</p>
		<div class="modal-action">
			<label for="instructions" class="btn">Close</label>
		</div>
	</div>
</label>

<style>
</style>
