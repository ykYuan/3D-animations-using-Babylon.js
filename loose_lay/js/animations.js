//This helper function deals with the animations when the user hovers the mouse over to the tiles in state 1 and all the tiles should expand
//This function takes in the scene and input as the argument and returns an array of animations to append to the meshes

//Animations in Babylon.js relies on keys; keys are what value the targeted field should be at certain frames of the animation. learn more here: https://doc.babylonjs.com/tutorials/animations
function create_hover_animation(scene, input) {
	var output = [];
	//Note: the indices of a mesh in the scene.meshes array match the indices of the mesh in the returned array
	for (var i = 1; i < scene.meshes.length; i++) {
		var box_hover_animation = new BABYLON.Animation("hover_animation", "position.y", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		var keys = []; 
		keys.push({
			frame: 0,
			value: scene.meshes[i].position.y
		});
		//The following offsets each tile
		keys.push({
			frame: input.speed / 2,
			value: (scene.meshes.length / 2 - i) * input.eDistance
		});
		box_hover_animation.setKeys(keys);
		output.push(box_hover_animation);
	}
	return output;
}

//This helper function deals with the compression animation when the user hovers their mouse out of the tiles
//This function takes in the scene and input as the argument and returns an array of animations to append to the meshes
function create_compress_animation(scene, input) {
	var output = [];
	for (var i = 1; i < scene.meshes.length; i++) {
		var box_hover_animation = new BABYLON.Animation("compress_animation", "position.y", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		var keys = []; 
		keys.push({
			frame: 0,
			value: scene.meshes[i].position.y
		});
		keys.push({
			frame: input.speed / 2,
			value: 0 - input.cDistance * i
		});
		box_hover_animation.setKeys(keys);
		output.push(box_hover_animation);
	}
	return output;
}


//This helper function deals with the rotation animation between state 1 and 2. Note that state 2 requires 3 animations: camera, mesh rotate and mesh translate.
//This function takes in the scene and input as the argument and returns an array of animations to append to the meshes
function create_rotate_animation(scene, input) {
	var output = [];

	for (var i = 1; i < scene.meshes.length; i++) {
		var box_rotate_animation = new BABYLON.Animation("rotate_animation", "rotation.x", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		var keys = []; 
		keys.push({
			frame: 0,
			value: 0
		});

		keys.push({
			frame: input.speed,
			value: Math.PI / 2
		});
		box_rotate_animation.setKeys(keys);
		output.push(box_rotate_animation);
	}
	return output;
}





//This function deals with the reverse animation when the user clicks on the back button during state 2. Note that the reverse animation requires 3 animations in total: camera, mesh rotate and 
//mesh tranlsate.
//This function takes in the scene and input as the argument and returns an array of animations to append to the meshes
function create_reverse_rotate_animation(scene, input) {
	var output = [];
	for (var i = 1; i < scene.meshes.length; i++) {
		var box_rotate_animation = new BABYLON.Animation("reverse_rotate_animation", "rotation.x", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		var keys = []; 
		keys.push({
			frame: 0,
			value: scene.meshes[i].rotation.x
		});

		keys.push({
			frame: input.speed,
			value: 0
		});
		box_rotate_animation.setKeys(keys);
		output.push(box_rotate_animation);
	}
	return output;
}


//This helper function deals with the translate animation between state 1 and 2. Note that state 2 requires 3 animations: camera, mesh rotate and mesh translate.
//This function takes in the scene, the clicked mesh and input as the argument and returns an array of animations to append to the meshes.
//Note that the clicked mesh is taken in as an argument because the clicked mesh must be centered at the origin point, while other meshes are positioned nexxt to it.
function create_translate_animation(mesh, scene, input) {
	//index stores the index of the clicked mesh in the scene.meshes array; this index will be used as an offset when positioning the other meshes surrounding the clicked mesh
	var index;
	var animate_boxes = [];
	for (var i = 1; i < scene.meshes.length; i++) {
		//Check if the id is equal, if it is then update index
		if (mesh.id == scene.meshes[i].id) {
			index = i;
			break;
		}
	}


	for (var i = 1; i < scene.meshes.length; i++) {
		var box_translate_animation = new BABYLON.Animation("translate_y", "position.y", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		var keys = [];
		var curr = scene.meshes[i];

		keys.push({
			frame: 0,
			value: curr.position.y
		});

		keys.push({
			frame: input.speed,
			value: (index - i) * 4.5
		});
		box_translate_animation.setKeys(keys);
		animate_boxes.push(box_translate_animation);
	}

	return animate_boxes;	   
}




//This helper function deals with the reverse mesh translation when the user clicks on the go back button. Note that the reverse animation requires 3 animations: camera, mesh rotate and mesh translate.
//This function takes in the scene, the clicked mesh and input as the argument and returns an array of animations to append to the meshes
function create_reverse_translate_animation(mesh, scene, input) {
	var index;
	var animate_boxes = [];
	for (var i = 1; i < scene.meshes.length; i++) {
		if (mesh.id == scene.meshes[i].id) {
			index = i;
			break;
		}
	}

	for (var i = 1; i < scene.meshes.length; i++) {
		var box_translate_animation = new BABYLON.Animation("reverse_translate_y", "position.y", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		var keys = [];
		var curr = scene.meshes[i];

		keys.push({
			frame: 0,
			value: curr.position.y 
		});

		keys.push({
			frame: input.speed,
			value: curr.position.y + 4
		});

		keys.push({
			frame: input.speed * 2,
			value: 0 - input.cDistance * i
		});
		box_translate_animation.setKeys(keys);
		animate_boxes.push(box_translate_animation);
	}

	return animate_boxes;	   
}



//This function creates animation that deals with the camera animation transitining into step 2 so that it is facing the the front side of the mesh of interest; returns an array of animation boxes of alpha, beta and radius
//which will be used in the main code to append to the camera itself
function create_camera_animation(camera, mesh, input) {
	var camera_animation_alpha = new BABYLON.Animation("camera_animation", "alpha", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var camera_animation_beta = new BABYLON.Animation("camera_animation", "beta", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var camera_animation_radius = new BABYLON.Animation("camera_animation", "radius", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var output = [];

	var keys = [];
	keys.push({
		frame: 0,
		value: camera.alpha
	});

	keys.push({
		frame: input.speed,
		value: 1.57
	});
	camera_animation_alpha.setKeys(keys);
	output.push(camera_animation_alpha);
	
	var keys = [];
	keys.push({
		frame: 0,
		value: camera.beta
	});

	keys.push({
		frame: input.speed,
		value: mesh.rotation.z + (Math.PI / 2) 
	});
	camera_animation_beta.setKeys(keys);
	output.push(camera_animation_beta);

	var keys = [];
	keys.push({
		frame: 0,
		value: camera.radius
	});

	keys.push({
		frame: input.speed,
		value: 6
	});
	camera_animation_radius.setKeys(keys);
	output.push(camera_animation_radius);

	return output;

}


//This helper function deals with the reverse camera animation when the user clicks on the go back button. Note that the reverse animation requires 3 animations: camera, mesh rotate and mesh translate.
//This function takes in the camera and input as the argument and returns an array of animations corresponding to the alpha, beta and radius attributes of the camera
function create_reverse_camera_animation(camera, input) {
	var output = [];

	var camera_animation_radius = new BABYLON.Animation("reverse_camera_animation", "radius", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var keys = [];
	keys.push({
		frame: 0,
		value: camera.radius
	});

	keys.push({
		frame: input.speed,
		value: 30
	});
	camera_animation_radius.setKeys(keys);
	output.push(camera_animation_radius);


	var camera_animation_alpha = new BABYLON.Animation("reverse_camera_animation", "alpha", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var keys = [];
	keys.push({
		frame: 0,
		value: camera.alpha
	});

	keys.push({
		frame: input.speed,
		value: 1
	});
	camera_animation_alpha.setKeys(keys);
	output.push(camera_animation_alpha);


	var camera_animation_beta = new BABYLON.Animation("reverse_camera_animation", "beta", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var keys = [];
	keys.push({
		frame: 0,
		value: camera.beta
	});

	keys.push({
		frame: input.speed,
		value: 0.8
	});
	camera_animation_beta.setKeys(keys);
	output.push(camera_animation_beta);



	return output;
}


//This function deals with the mouse scroll event after the user zoomed in onto a single tile; change the y coordinate of all the meshes by 4.5
//This function takes in the scene and the up variable as arguments. Up is true if the user is scrolling up and it is false if the user is scrolling down. Returns an array of animations
//for all the meshes
//Note: on caveat is that if the user has scrolled all the way to the top or all the way to the bottom, then it should not scroll anymore. For up scroll, if the top most mesh has y coordinate 0,
//then it is at the top. For scroll down, if the first mesh has y coordinate of 0, then it is at the bottom. The if statements in the code checks this property then proceeds.
function create_scroll_animation(scene, up, input) {
	var output = [];
	if (up) {
		if (scene.meshes[scene.meshes.length - 1].position.y != 0) {
			for (var i = 1; i < scene.meshes.length; i++) {
				var translate_animation = new BABYLON.Animation("translate_y_hover", "position.y", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
				var keys = [];
				var mesh = scene.meshes[i];
				keys.push({
					frame: 0,
					value: mesh.position.y
				});

				keys.push({
					frame: input.speed,
					value: mesh.position.y + 4.5
				});
				translate_animation.setKeys(keys);
				output.push(translate_animation);
			}
		}
	}
	else {
		if (scene.meshes[1].position.y != 0) {
			for (var i = 1; i < scene.meshes.length; i++) {
				var translate_animation = new BABYLON.Animation("translate_y_hover", "position.y", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
				var keys = [];
				var mesh = scene.meshes[i];
				keys.push({
					frame: 0,
					value: mesh.position.y
				});

				keys.push({
					frame: input.speed,
					value: mesh.position.y - 4.5
				});
				translate_animation.setKeys(keys);
				output.push(translate_animation);
			}
		}
	}
	return output;

}

































