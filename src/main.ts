import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertex from '../shader/vertex.glsl.js';
import fragment from '../shader/fragment.glsl.js';

const height = window.innerHeight;
const width = window.innerWidth;

const canvas = document.querySelector('#landing-canvas')!;
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(height, width);
renderer.setClearColor(0xeeeeee, 1)

const camera = new THREE.PerspectiveCamera(75, height / width, 0.1, 1000);
camera.position.z = 3;

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry( 1, 1 );
const material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide} );
const shader_material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,

  vertexShader: vertex,
  fragmentShader: fragment
})
const plane = new THREE.Mesh( geometry, shader_material );
scene.add( plane );

const controls = new OrbitControls( camera, renderer.domElement );

controls.update()

renderer.render(scene, camera);

const render = (time: number) => {
  time *= 0.001 //convert to seconds

  renderer.render(scene, camera);
 
  requestAnimationFrame(render);
}

requestAnimationFrame(render);