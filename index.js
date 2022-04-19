import * as THREE from 'three'
import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';
// import TrackballControls from 'https://cdn.jsdelivr.net/npm/three-trackballcontrols@0.0.8/index.min.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe5e5e5);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

let canvas = renderer.domElement;

document.body.appendChild(canvas);


const loader = new OBJLoader();

let primitives = 0;
// let OBJECT;
let bbox;

function loadMeshObj(file, objID, objColor) {

	loader.load(
		// resource URL
		file,
		// called when resource is loaded
		function (object) {
			// const material = new THREE.MeshLambertMaterial()
			// console.log(material.needsUpdate)
			object.traverse(function (obj) {
				if (obj.isMesh) {
					// obj.material = new THREE.MeshLambertMaterial()
					// console.log(obj.geometry)
					// let geo = Object.assign({},obj.geometry)
					// obj.material = material
					obj.material.color.setHex(objColor);
					console.log(obj)
				}
			});
			console.log("isObject3D = ", object.isObject3D);
			object.name = objID;
			
			scene.add(object);
			bbox = new THREE.Box3().setFromObject(scene.getObjectByName(objID))
			console.log(bbox)
			primitives += 1;
			// OBJECT = object;

		},
		// called when loading is in progresses
		// function (xhr) {

		// 	console.log((xhr.loaded / xhr.total * 100) + '% loaded');

		// },
		// // called when loading has errors
		// function (error) {

		// 	console.log('An error happened');

		// }
	);

}

function computeLimits(bbox) {
	let min, max, mid, l;
	let char = 'x';
	let limits = [];
	while(char != '{') {
		let lim = [];
		l = (bbox.max[char] - bbox.min[char]) * 1.25;
		mid = (bbox.max[char] + bbox.min[char]) * 0.5;
		min = mid - (l/2);
		max = mid + (l/2);

		lim.push(min); lim.push(max)
		limits.push(lim)
		char = String.fromCharCode(char.charCodeAt(0) + 1)
	}
	return limits;
}

loadMeshObj('./cube.obj', (primitives + 3).toString(), 0x00ff00);

let light = new THREE.AmbientLight(0xffffff)
light.name = "light"
scene.add(light)
scene.getObjectByName("light").visible = false;


// let bbox = new THREE.Box3().setFromObject(scene.getObjectByName("3"));
// scene.add(new THREE.AmbientLight(0xffffff))

const l3 = new THREE.PointLight( 0xffffff, 1, 100 );
l3.position.set( 0, 0, 0 );
l3.name = "l3";
scene.add( l3 );
console.log(l3.isLight)

camera.position.z = 5;

let mode = "none";
let selectedShape = null;
let moveBy = 0.05;
let offset = 3;

document.addEventListener('keydown', function (event) {
	console.log("Key pressed = ", event.key);
	
	let limits;
	if(mode == "i"){
		if(selectedShape!=null){
			bbox = new THREE.Box3().setFromObject(selectedShape)
			// console.log(bbox)
		}
		limits = computeLimits(bbox)
		// console.log(limits)
	}

	if (event.key == "m") {
		mode = "m";
		selectedShape = null
	}

	else if(event.key == "s"){
		selectedShape.traverse(function (obj) {
			if (obj.isMesh) {
				let col = obj.material.color
				// obj.material.dispose()
				if(obj.isMeshPhongMaterial){
					obj.material.dispose()
					obj.material = new THREE.MeshLambertMaterial()
				} else {
					obj.material.dispose()
					obj.material = new THREE.MeshPhongMaterial()
				}
				obj.material.needsUpdate = true;
				// console.log(obj.material.needsUpdate)
				
				// obj.material = new THREE.MeshLambertMaterial()
				// console.log(obj.geometry)
				// let geo = Object.assign({},obj.geometry)
				
				// obj.material = material
				obj.material.color = col;
				console.log(obj.material)
			}
		});
	}

	else if (event.key == "i") {
		selectedShape = null;
		mode = "i";
	}

	else if (event.key == "x") {
		let lightName = "l" + selectedShape.name
		if(mode == "m"){
			selectedShape.position['x'] -= moveBy;
			scene.getObjectByName(lightName).position['x'] -= moveBy;
		}
		else if(mode == "i") {
			if(scene.getObjectByName(lightName).position['x'] - moveBy >= limits[0][0] - offset) {
				scene.getObjectByName(lightName).position['x'] -= moveBy; 
			}
		}
		
		console.log(scene.getObjectByName(lightName).position)
	}

	else if (event.key == "X") {
		let lightName = "l" + selectedShape.name
		if(mode == "m"){
			selectedShape.position['x'] += moveBy;
			scene.getObjectByName(lightName).position['x'] += moveBy; 
		}
		else if(mode == "i") {
			if(scene.getObjectByName(lightName).position['x'] + moveBy <= limits[0][1] + offset) {
				scene.getObjectByName(lightName).position['x'] += moveBy; 
			}
		}

		console.log(scene.getObjectByName(lightName).position)
	}

	else if (event.key == "y") {
		let lightName = "l" + selectedShape.name
		if(mode == "m") {
			selectedShape.position['y'] -= moveBy;
			scene.getObjectByName(lightName).position['y'] -= moveBy;
		}
		else if(mode == "i") {
			if(scene.getObjectByName(lightName).position['y'] - moveBy >= limits[1][0] - offset) {
				scene.getObjectByName(lightName).position['y'] -= moveBy; 
			}
		}
	}

	else if (event.key == "Y") {
		let lightName = "l" + selectedShape.name
		if(mode == "m") {
			selectedShape.position['y'] += moveBy;
			scene.getObjectByName(lightName).position['y'] += moveBy; 
		}
		else if(mode == "i") {
			if(scene.getObjectByName(lightName).position['y'] + moveBy <= limits[1][1] + offset) {
				scene.getObjectByName(lightName).position['y'] += moveBy; 
			}
		}
	}

	else if (event.key == "z") {
		let lightName = "l" + selectedShape.name
		if(mode == "m") {
			selectedShape.position['z'] -= moveBy;
			scene.getObjectByName(lightName).position['z'] -= moveBy; 
		}
		else if(mode == "i") {
			if(scene.getObjectByName(lightName).position['z'] - moveBy >= limits[2][0] - offset) {
				scene.getObjectByName(lightName).position['z'] -= moveBy; 
			}
		}
	}

	else if (event.key == "Z") {
		let lightName = "l" + selectedShape.name
		if(mode == "m") {
			selectedShape.position['z'] += moveBy;
			scene.getObjectByName(lightName).position['z'] += moveBy; 
		}
		else if(mode == "i") {
			if(scene.getObjectByName(lightName).position['z'] + moveBy <= limits[2][1] + offset) {
				scene.getObjectByName(lightName).position['z'] += moveBy; 
			}
		}
	}

	// if(selectedShape!=null){
	// 	bbox = new THREE.Box3().setFromObject(selectedShape)
	// 	console.log(bbox.max['x'])
	// }

}, false);

let mouseX, mouseY;
let gl = renderer.getContext();
let pixelColor = new Uint8Array(4);

function colorDiff(color1, color2) {
	let dist = 0
	for (let i = 0; i < color1.length; i++) {
		dist += (color1[i] - color2[i]) * (color1[i] - color2[i])
	}
	return Math.sqrt(dist)
}

function selectShape(pixelColor) {
	// scene.getObjectByName("light").visible = true;
	let pixelCol = new Float32Array(pixelColor);
	let color = pixelCol.map(function (x) { return x / 255.0; })

	let shapeID = "2";
	if (colorDiff([0.9, 0.9, 0.9, 1], color) < 0.002) {
		return shapeID;
	}

	for (let i = 0; i < primitives; i++) {
		// if(!primitives[i].selectable)
		// 	continue;
		// if()

		let object = scene.getObjectByName((i + 3).toString());

		object.traverse(function (obj) {
			if (obj.isMesh) {
				let objCol = [obj.material.color['r'], obj.material.color['g'], obj.material.color['b'], 1];
				if (colorDiff(objCol, color) < 0.002) {
					shapeID = object.name;
					// return shapeID;
				}
				console.log(obj)
			}
		});
	}
	console.log("shapeID = ", shapeID);
	// scene.getObjectByName("light").visible = false;
	return shapeID;
}

canvas.addEventListener('mousedown', (event) => {
	if (mode == "m" || mode == "i") {
		scene.getObjectByName("light").visible = true;

		for (let i = 0; i < primitives; i++) {
			let lightName = "l" + (i + 3).toString()
			scene.getObjectByName(lightName).visible = false;
		}

		// scene.getObjectByName("l1").visible = false;
		// const rect = renderer.getDomElement().getBoundingClientRect();
		const rect = canvas.getBoundingClientRect();

		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;

		// console.log(`mouseX = ${mouseX}; mouseY = ${mouseY}}`)

		const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
		const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;

		// console.log(`pixelX = ${pixelX}; pixelY = ${pixelY}}`)

		// renderer.render(scene,shader);
		renderer.render(scene, camera);

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

		scene.getObjectByName("light").visible = false;
		
		for (let i = 0; i < primitives; i++) {
			let lightName = "l" + (i + 3).toString()
			scene.getObjectByName(lightName).visible = true;
		}
		
		console.log(shape_id)

		// if(s != null)
		// 	s.color = s.originalColor;

		if (shape_id == "2") {
			console.log("No shape selected");
		}
		else {
			selectedShape = scene.getObjectByName(shape_id);
			// console.log(selectedShape);
		}
	} 
});


function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();