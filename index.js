import * as THREE from 'three'
import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';
// import TrackballControls from 'https://cdn.jsdelivr.net/npm/three-trackballcontrols@0.0.8/index.min.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xe5e5e5 );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

let canvas = renderer.domElement;

document.body.appendChild( canvas );


const loader = new OBJLoader();
// load a resource

// function hex2rgba (hex, alpha = 1) {
// 	const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
// 	return `rgba(${r},${g},${b},${alpha})`;
//   };

// console.log(hex2rgba(0x00ff00));

let primitives = 0;

function loadMeshObj(file, objID, objColor){

	loader.load(
		// resource URL
		file,
		// called when resource is loaded
		function ( object ) {
			object.traverse( function ( obj ) {
				if ( obj.isMesh ) {
				  //  obj.material.ambient.set(0xFF0000);
					obj.material.color.setHex( objColor );

					// console.log(obj.material.color['g']);
					// obj.material.needsUpdate = true;
					// console.log(obj)
				}
			});
			console.log(object);
			object.name = objID;
			// object.position['x']+=2;
			// console.log();
			// object.translateOnAxis(THREE.Vector3(1,0,0),10);
			scene.add( object );
			primitives += 1;
	
		},
		// called when loading is in progresses
		// function ( xhr ) {
	
		// 	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	
		// },
		// // called when loading has errors
		// function ( error ) {
	
		// 	console.log( 'An error happened' );
	
		// }
	);

}

loadMeshObj('./cube.obj',(primitives+3).toString(), 0x00ff00);


scene.add(new THREE.AmbientLight(0xffffff))

camera.position.z = 5;

let mode = "none";
let selectedShape = null;
let moveBy = 0.05;

document.addEventListener('keydown', function (event) {
	console.log("Key pressed = ", event.key);

	if(event.key=="m"){
		mode = "m";	
	}

	else if(event.key=="i") {
		mode = "i";
	}

	else if(event.key == "x" && mode=="m"){
		selectedShape.position['x']-=moveBy;
	}

	else if(event.key == "X" && mode=="m"){
		selectedShape.position['x']+=moveBy;
	}

	else if(event.key == "y" && mode=="m") {
		selectedShape.position['y']-=moveBy;
	}

	else if(event.key=="Y" && mode=="m") {
		selectedShape.position['y']+=moveBy;
	}

	else if(event.key=="z" && mode=="m"){
		selectedShape.position['z']-=moveBy;
	}

	else if(event.key=="Z" && mode=="m"){
		selectedShape.position['z']+=moveBy;
	}

}, false );

let mouseX, mouseY;
let gl = renderer.getContext();
let pixelColor = new Uint8Array(4);

function colorDiff(color1, color2){
	let dist=0
	for(let i=0; i<color1.length; i++){
		dist += (color1[i]-color2[i])*(color1[i]-color2[i])
	}
	return Math.sqrt(dist)
}

function selectShape(pixelColor)
{
	let pixelCol = new Float32Array(pixelColor);
	let color = pixelCol.map(function(x) {return x/255.0;})

	let shapeID = "2";
	if(colorDiff([0.9,0.9,0.9,1],color) < 0.002){
		return shapeID;
	}

	for(let i=0;i<primitives;i++)
	{
		// if(!primitives[i].selectable)
		// 	continue;
		let object = scene.getObjectByName((i+3).toString());

		object.traverse( function ( obj ) {
			if ( obj.isMesh ) {
				let objCol = [obj.material.color['r'],obj.material.color['g'],obj.material.color['b'],1];
				if(colorDiff(objCol,color)<0.002){
					shapeID = object.name;
					// return shapeID;
				}
				console.log(obj)
			}
		});

		// if(colorDiff(primitives[i].color,color) < 0.002){
		// 	shapeID = primitives[i]
		// }
	}
	console.log("shapeID = ",shapeID);
	return shapeID;
}

canvas.addEventListener('mousedown', (event) => {
	if(mode=="m"){
		// const rect = renderer.getDomElement().getBoundingClientRect();
		const rect = canvas.getBoundingClientRect();

		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;

		const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
		const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;

		// renderer.render(scene,shader);
		renderer.render( scene, camera );

		gl.readPixels(
			pixelX,            // x
			pixelY,            // y
			1,                 // width
			1,                 // height
			gl.RGBA,           // format
			gl.UNSIGNED_BYTE,  // type
			pixelColor         // typed array to hold result
		);

		// console.log("pixelColor = ", pixelColor);

		// let s = currentShape;
		let shape_id = selectShape(pixelColor);
		
		console.log(shape_id)

		// if(s != null)
		// 	s.color = s.originalColor;

		if(shape_id == "2"){
			console.log("No shape selected");
		}
		else {
			selectedShape = scene.getObjectByName(shape_id);
			// console.log(selectedShape);
		}
	}
});


function animate() {
    requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();