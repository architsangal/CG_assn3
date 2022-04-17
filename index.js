import * as THREE from 'three'
import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';
// import TrackballControls from 'https://cdn.jsdelivr.net/npm/three-trackballcontrols@0.0.8/index.min.js';


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

function loadMeshObj(file, objName){

	loader.load(
		// resource URL
		file,
		// called when resource is loaded
		function ( object ) {
			object.traverse( function ( obj ) {
				if ( obj.isMesh ) {
				  //  obj.material.ambient.set(0xFF0000);
					obj.material.color.setHex( 0x00ff00 );
					// obj.material.needsUpdate = true;
					console.log(obj)
				}
			});
			object.name = objName;
			object.position['x']+=2;
			// console.log();
			// object.translateOnAxis(THREE.Vector3(1,0,0),10);
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

}

loadMeshObj('./cube.obj','cube');

// console.log(scene.getObjectByName("sphere").isObject3D());

scene.add(new THREE.AmbientLight(0xffffff))

// const controls = new TrackballControls(scene.getObjectByName("cube"), renderer.domElement);


// let color = new THREE.Color( 0xFFB6C1 );

// obj.traverse( function (obj) {
// 	if (obj.isMesh){
// 	  obj.material.color.set(0xFFB6C1);
// 	}
//   } );

camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();