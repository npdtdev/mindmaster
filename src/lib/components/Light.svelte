<script lang="ts">
	import { LightInstance, T, useThrelte } from '@threlte/core';
	import { DirectionalLight } from 'three';

	const generateDirectionalLight = (): DirectionalLight => {
		const dirLight = new DirectionalLight(0xffffff, 0.5);
		dirLight.color.setHSL(0.1, 1, 0.95);
		dirLight.position.set(-0.4, 1.5, -0.4);
		dirLight.position.multiplyScalar(30);

		dirLight.castShadow = true;

		dirLight.shadow.mapSize.width = 10000;
		dirLight.shadow.mapSize.height = 10000;

		dirLight.shadow.camera.left = -60;
		dirLight.shadow.camera.right = 5;
		dirLight.shadow.camera.top = 20;
		dirLight.shadow.camera.bottom = -40;

		dirLight.shadow.camera.far = 3500;
		dirLight.shadow.bias = -0.000001;
		dirLight.shadow.blurSamples = 100;
		return dirLight;
	};
</script>

<LightInstance light={generateDirectionalLight()} />
<T.HemisphereLight color={'#FFFFFF'} groundColor={'#FFFFFF'} intensity={0.1} />
