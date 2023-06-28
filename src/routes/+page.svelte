<script lang="ts">
	import { Canvas, T } from '@threlte/core';

	import { createGame } from '$lib/game';
	import { Play, PlayResult, GameResult } from '$types';
	import { Vector3 } from 'three';
	import { playColor } from '$lib/play-color';
	import Light from '$components/Light.svelte';
	import Indicator from '$components/Indicator.svelte';
	import Floor from '$components/Floor.svelte';
	import GuessResult from '$components/GuessResult.svelte';
	import Instructions from '$components/Instructions.svelte';
	import { setContext } from 'svelte';
	import Guess from '$components/Guess.svelte';
	import Camera from '$components/Camera.svelte';
	import { writable } from 'svelte/store';

	const scaleVector = new Vector3(1, 1, 1);
	const max_scroll = 1.1;
	const min_scroll = 0;

	const selectedIdx = writable<number>(0);
	setContext('selected', selectedIdx);
	$: ($selectedIdx = 0) && $currentTurnStore;
	const handleSetMove = (play: Play) => {
		setMove($selectedIdx, play);
		$selectedIdx = (($selectedIdx + 1) % 4) as 0 | 1 | 2 | 3;
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

	const v1 = new Vector3(24, 32, 20).multiply(scaleVector);
	const v2 = new Vector3(24, 32, -30).multiply(scaleVector);
	const vt1 = new Vector3(5, 0, 0).multiply(scaleVector);
	const vt2 = new Vector3(5, 0, -50).multiply(scaleVector);
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
		id,
		reset
	} = createGame(12));
	$: setContext('turn', currentTurnStore);
	$: (camera = getNextCamera(viewTurn / turns)) && id;
	$: viewTurn = $currentTurnStore;
	let modalInput = false;
	$: modalInput = $gameResultStore != GameResult.Playing;

	let previousTouch: Touch | null;
</script>

<svelte:window
	on:wheel={({ deltaY }) => {
		const change = camera.frac + deltaY * 0.0001;
		if (change < max_scroll && change > min_scroll) {
			camera = getNextCamera(change);
		}
	}}
	on:touchmove={(event) => {
		const touch = event.touches[0];
		if (previousTouch) {
			const y = touch.pageY - previousTouch.pageY;
			const change = camera.frac + y * 0.0005;
			if (change < max_scroll && change > min_scroll) {
				camera = getNextCamera(change);
			}
		}
		previousTouch = touch;
	}}
	on:touchend={() => {
		previousTouch = null;
	}}
/>

<div class="h-screen w-full relative">
	<Canvas>
		<Light />
		<T.Group scale={[scaleVector.x, scaleVector.y, scaleVector.z]}>
			<Camera bind:position={camera.position} bind:lookAt={camera.lookAt} />
			<!-- Spheres and Boxes -->
			{#each [...$boardStore, $targetResultStore] as t, i}
				{#if $currentTurnStore >= i}
					{#each t as play, j}
						{#if $currentTurnStore == i && $selectedIdx == j && $gameResultStore == GameResult.Playing}
							<Indicator position={[j * 2.5, 3, -i * 4.5]} color={'red'} />
						{/if}
						<Guess position={[j * 2.5, 1, -i * 4.5]} {i} {j} {play} />
					{/each}
				{/if}
				{#if $currentTurnStore > i}
					<T.Group position.z={-i * 4.5} position.x={9.0} position.y={0.2}>
						{#each Object.values($playResultStore.at(i) ?? []).filter((el) => el != PlayResult.None) as res, d}
							<GuessResult result={res} position={[d * 0.5, 0, 0]} scale={[0.4, 0.4, 0.4]} />
						{/each}
					</T.Group>
				{/if}
			{/each}
			<Floor position={[4.5, -1, -27]} scale={[13, 2, 60]} />
		</T.Group>
	</Canvas>

	<div class="absolute top-5 left-0 flex flex-col items-center p-2 select-none">
		{#if $currentTurnStore < turns}
			<h1>Turn</h1>
			<h1>{`${$currentTurnStore + 1}/${turns}`}</h1>
		{/if}

		<button
			on:click={() => {
				camera = getNextCamera(viewTurn / turns);
			}}
			class="btn btn-circle mx-auto my-2"
			>&#10687;
		</button>
		<Instructions />
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
		<div class="absolute bottom-20">
			<div
				class="flex flex-row gap-2 justify-center p-4 bg-base-200 mx-auto rounded-r-xl drop-shadow-xl"
			>
				<button
					on:click={() => {
						handleSetMove(Play.One);
					}}
					aria-label="Set to one"
					class=" bg-base-100 shadow-xl p-4 mask mask-circle"
					style="background-color: {playColor.one.color};"
				/>
				<button
					on:click={() => {
						handleSetMove(Play.Two);
					}}
					aria-label="Set to two"
					class=" bg-base-100 shadow-xl p-4 mask mask-circle"
					style="background-color: {playColor.two.color};"
				/>
				<button
					on:click={() => {
						handleSetMove(Play.Three);
					}}
					aria-label="Set to three"
					class=" bg-base-100 shadow-xl p-4 mask mask-circle"
					style="background-color: {playColor.three.color};"
				/>
				<button
					on:click={() => {
						handleSetMove(Play.Four);
					}}
					aria-label="Set to four"
					class=" bg-base-100 shadow-xl p-4 mask mask-circle"
					style="background-color: {playColor.four.color};"
				/>
				<button
					on:click={() => {
						handleSetMove(Play.Five);
					}}
					aria-label="Set to five"
					class=" bg-base-100 shadow-xl p-4 mask mask-circle"
					style="background-color: {playColor.five.color};"
				/>
				<button
					on:click={() => {
						handleSetMove(Play.Six);
					}}
					aria-label="Set to six"
					class=" bg-base-100 shadow-xl p-4 mask mask-circle"
					style="background-color: {playColor.six.color};"
				/>
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
