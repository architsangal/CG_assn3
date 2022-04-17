// import {OrbitControls} from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
// import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
// import { GLTFLoader } from './GLTFLoader.js';
import * as THREE from 'three';

// import { OBJLoader } from "https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xe5e5e5 );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const loader = new GLTFLoader();
loader.load(
	// resource URL
	'./CG_assn3.glb',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


camera.position.z = 5;

function animate() {
    // renderer.clearRect();
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();