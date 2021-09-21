import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertex from '../shader/vertex.glsl.js';
import fragment from '../shader/fragment.glsl.js';
import lofi from '../imgs/lofi-bw.jpg';
import disp from '../imgs/disp.png';


const height = window.innerHeight;
const width = window.innerWidth;

const canvas = document.querySelector('#landing-canvas')!;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(height, width);
renderer.setClearColor(0xeeeeee, 1);

const camera = new THREE.PerspectiveCamera(75, height / width, 1, 1000);
camera.position.z = 3;

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(1, 1);
const shader_material = new THREE.ShaderMaterial({
	side: THREE.DoubleSide,
	uniforms: {
		time: { value: 1.0 },
		resolution: { value: new THREE.Vector4() },
		image: { value: new THREE.TextureLoader().load(lofi)},
		progress: { value: 0.0 },
		disp: { value: new THREE.TextureLoader().load(disp)}
	},
	vertexShader: vertex,
	fragmentShader: fragment,
});
const plane = new THREE.Mesh(geometry, shader_material);
scene.add(plane);

const controls = new OrbitControls(camera, renderer.domElement);

controls.update();

renderer.render(scene, camera);

let reversing = false;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove( event: any ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.offsetX / width ) * 2 - 1;
	mouse.y = - ( event.offsetY / height ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );

	const intersects = raycaster.intersectObjects( scene.children );
	console.log(intersects)
}

const render = (time: number) => {
	time *= 0.001; //convert to seconds

	if(reversing){
		plane.material.uniforms.progress.value -= 0.01;
		if(plane.material.uniforms.progress.value <= 0.0) {
			reversing = false;
		}
	} else {
		plane.material.uniforms.progress.value += 0.01;
		if(	plane.material.uniforms.progress.value > 0.1) {
			reversing = true;
		} 
	}

	plane.material.uniforms.time.value = time;

	renderer.render(scene, camera);

	requestAnimationFrame(render);
};

window.addEventListener( 'mousemove', onMouseMove, false );

requestAnimationFrame(render);
