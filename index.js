// import {OrbitControls} from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
// import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as THREE from 'three'
// import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

// import { OBJLoader } from "https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xe5e5e5 );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const loader = new GLTFLoader();

// function load_meshObj(file){
//     let obj;
//     loader.load(
//         // resource URL
//         file,
//         // called when the resource is loaded
//         function ( gltf ) {
//             obj = gltf.asset;
//             scene.add( gltf.scene );
//             // gltf.asset;
    
//         },
//         // called while loading is progressing
//         function ( xhr ) {
    
//             console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
//         },
//         // called when loading has errors
//         function ( error ) {
    
//             console.log( 'An error happened' );
    
//         }
//     ); 
    
//     return obj;
// }

// let sphere = load_meshObj('./sphere.glb');

// load_meshObj('./sphere.glb');

// sphere.material.color.setHex(0x00ff00);

const loader = new OBJLoader();
let obj;
// load a resource
loader.load(
	// resource URL
	'./CG_assn3.obj',
	// called when resource is loaded
	function ( object ) {
		// obj = object;
		// object.traverse( function ( child ) {
		// 	if ( child instanceof THREE.Mesh ) {
		// 		 child.material.ambient.setHex(0xFF0000);
		// 		 child.material.color.setHex(0x00FF00);
		// 		}
		// 	} );
		object.name = "sphere";
		object.position.y = 0;
		scene.add( object );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

// let color = new THREE.Color( 0xFFB6C1 );

// obj.traverse( function (obj) {
// 	if (obj.isMesh){
// 	  obj.material.color.set(0xFFB6C1);
// 	}
//   } );

camera.position.z = 5;

function animate() {
    // renderer.clearRect();
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();