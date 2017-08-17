
	   		/****************************************
			

			Start of global variable and object declarations



			There are different states for the animation: state 1 refers to the initial phase in which the tiles are compressed. When user hovers over the tiles the tiles expand and when the user hovers out of the tiles the tiles compress. This is done through an invisible box and the expansion and compression animations are triggered depending on mouse events
			on the invisible box. State 2 refers to the state when the user can scroll between different tiles. The transition between state 1 and state 2 is when the user clicks on a specific tile, and that specific tile is positioned right in the center of the screen. The transition animation requires the animation of the camera as well as the rotation and translation of the tiles.

			Lastly, when user clicks the back button then there will be a series of reverse animations and the scene goes back to state 1 again
			

		    ****************************************/

		    //This is an input object and it stores all the user specficied input(distance between initial meshes, distance between expanded meshes, animation speed). This 
		    //object will be passed into numerous functions to control the scene.
	   		var input;

	   		//This variable is set to true if the user has not clicked on a tile yet so hover in will cause tiles to expand and hover out will cause tiles to compress
	   		//This variable is true in the beginning because the beginning of the scene starts with the hover in and out effect
	   		var hover_enabled = true;


	   		//This variable determines the state when the mouse hovers into the tiles; this only occurs when hover_enabled is set to true
	   		//When hover_in = false, it means that currently the mouse is hovering out of the tiles
	   		var hover_in = true;

	   		//This variable determines the state when the user clicks on a tile, then both the camera and the tiles need to rotate and translate to the correct location
	   		var rotation_animation = true;

	   		//This variable is set to true if a user has already clicked on a tile and the camera zooms in; now the user can scroll up or down to go through the individual tiles
	   		//This variable is false in the beginning.
	   		var scroll_enabled = false;
	   		
	   		// Get the canvas element from our HTML below
      		var canvas = document.querySelector("#renderCanvas");

	      	// Load the BABYLON 3D engine
	      	var engine = new BABYLON.Engine(canvas, true);
	 
	        // Now create a basic Babylon Scene object
	        var scene = new BABYLON.Scene(engine);

	        // Change the scene background color to green.
	        scene.clearColor = new BABYLON.Color3(1, 1, 1);

	        // This creates and positions a free camera
	        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);

	        // This is a temporary variable stored to let the code know which mesh the user clicked on; it is used during the reverse animation
	        var mesh_clicked_on;

	        //In the start the camera is 30 units away from the center
	        camera.radius = 30;

	        //camera.animations is an array that stores animation boxes that will be used later; this is just initiating this field
	        camera.animations = [];
	        //This variable restricts the camera so that you can only zoom in up to distance 6 from the center
	        camera.lowerRadiusLimit = 6;

	        //This variable restricts the camera so that you can only zoom out up to a distance 60 from the center
	        camera.upperRadiusLimit = 60;

	        // This targets the camera to scene origin; All objects created will be around the center so this is fine
	        camera.setTarget(BABYLON.Vector3.Zero());

	        // This attaches the camera to the canvas
	        camera.attachControl(canvas, false);

	   		/****************************************
			

			End of global variable and object declarations
			

		    ****************************************/



		    /****************************************
			

			Start of Helper functions section section
			

		    ****************************************/


		    //This function handles the logic when the mouse hovers into the pile of compressed tiles. What needs to happen is that the tiles need to animate and expand
		    //Note that the animation should only occur when it is in the beginning state before the user clicked on a tile yet; this is done by checking the hover_in and hover_enabled
		    //variables. 
	   		var hover_in_animation_logic = function(mesh) {
	   			if (hover_in && hover_enabled) {
	   				//The hover_in variable need to be set to false immediately, because while the mouse is inside the invisible box, there is a constant firing of the mouse_in event.
	   				hover_in = false;
	   				//This is a helper function in animations.js that returns the animation boxes
	   				var boxes = create_hover_animation(scene, input);
	   				//The following code addes the animation boxes to the correct mesh in the scene and starts the animation. Note that the first mesh in the scene.meshes array is the
	   				//invisible box, so i start at index 1
	   				for (var i = 1; i < scene.meshes.length; i++) {
		   				scene.meshes[i].animations.push(boxes[i - 1]);
		   				scene.beginAnimation(scene.meshes[i], 0, input.speed / 2);
		   			}
		   			//Clear the animations array right after otherwise the existing animations will impact the effect of animations done later
		   			for (var i = 1; i < scene.meshes.length; i++) {
		   				scene.meshes[i].animations = [];
		   			}
	   			}
   				
	   		};

	   		//This function handles the logic when the mouse hovers out of the expanded tiles. What needs to happen is that the tiles need to compress down. 
	   		var hover_out_animation_logic = function(mesh) {
	   			//hover_in is set to true so when user hovers in again the hover_in animation will initiate
	   			hover_in = true;
	   			//The compress animation should only occur in the first state before the using has clicked on a specific tile
	   			if (hover_enabled) {
	   				//The following code retrive the animations and add them to the meshes
   					var boxes = create_compress_animation(scene, input);
	   				for (var i = 1; i < scene.meshes.length; i++) {
	   					var mesh = scene.meshes[i];
		   				mesh.animations.push(boxes[i - 1]);
		   				scene.beginAnimation(scene.meshes[i], 0, input.speed / 2);
		   			}
		   			//Delete the animations afterwards
		   			for (var i = 1; i < scene.meshes.length; i++) {
		   				scene.meshes[i].animations = [];
		   			}
	   				
	   			}

	   		};

	   		//This is a helper function that deals with the logic when a user clicks on a tile; Both the camera and object need to move to the right positions
	   		var click_animation_logic = function(mesh) {
	   			//The mesh should have full transaparancy when zoomed in
	   			mesh.material.alpha = 1;

	   			//The rotation_animation should only occur in the second state when the user has clicked on a specific tile
	   			if (rotation_animation) {
	   				//rotation_animation is set to false so that the animation won't be replayed repeatedly when user clicks on the tile repeatedly
	   				rotation_animation = false;
	   				//This makes sure that no hover animations will occur
	   				hover_enabled = false;
	   				//The animation takes approximately 1 second, so after one second set scroll_enabled to true so that the user can thus start the scrolling animations
	   				setTimeout(function() {
	   					scroll_enabled = true;
	   				}, 1000);

	   				//Retrieve all the animation boxes created for the tiles
	   				var translate_boxes = create_translate_animation(mesh, scene, input);

	   				//Set the mesh_clicked_on variable to the current mesh; this will be used in the reverse animation
	   				mesh_clicked_on = mesh;

	   				//Retrieve animations created for the camera
	   				var camera_boxes = create_camera_animation(camera, mesh, input);

	   				//Retrive animations created for the meshes
	   				var rotate_boxes = create_rotate_animation(scene, input);

	   				//Iterate through all the meshes in scene, attach animation boxes, and start the animation
	   				for (var i = 1; i < scene.meshes.length; i++) {
		   				scene.meshes[i].animations.push(rotate_boxes[i - 1]);
		   				scene.meshes[i].animations.push(translate_boxes[i - 1]);
		   				scene.beginAnimation(scene.meshes[i], 0, input.speed);
		   			}

		   			//Push the three animation boxes (alpha, beta, radius) to the camera and begin the camera animations
		   			camera.animations.push(camera_boxes[0]);
		   			camera.animations.push(camera_boxes[1]);
		   			camera.animations.push(camera_boxes[2]);
		   			scene.beginAnimation(camera, 0, input.speed);

		   			//Clear all the animations
		   			for (var i = 1; i < scene.meshes.length; i++) {
		   				scene.meshes[i].animations = [];
		   			}
		   			camera.animations = [];

		   			//Detach camera controls here because during the scrolling view, the user should not be able to zoom in and out
		   			scene.activeCamera.detachControl(canvas);
	   			}

	   		};



	   		// This function deals with the animation when the user clicks on the go back button: the camera zooms out and the tiles need to compress back to the original state
	   		function reverse_animation() {
	   			//This function is called after the scroll state so need to reattach the camera
	   			camera.attachControl(canvas, false);
	   			//Allow rotation animations because it goes back to state 1 but only after the reverse animation has finished.
	   			setTimeout(function() {
	   				rotation_animation = true;
	   			}, 1000)
	   			//After the animations are finished, set the hover_enabled function to true; do not want the hover animation to set to true immediately as it would mess up the reverse animation
	   			setTimeout(function() {
	   				hover_enabled = true;
	   			}, 1000)
	   			//Set scroll_enabled to false so that scrolling will not affect hover animations
	   			scroll_enabled = false;

	   			//Get all the animations needed for meshes and camera; note that for the meshes both a rotation and a translation animation are needed
	   			var rotate_boxes = create_reverse_rotate_animation(scene, input);
	   			var camera_boxes = create_reverse_camera_animation(camera, input);
	   			var translate_boxes = create_reverse_translate_animation(mesh_clicked_on, scene, input);
	   			camera.animations = [];

	   			//First start the camera animations and then the mesh animations as otherwise the user cannot see the compress animation effect
	   			camera.animations.push(camera_boxes[0]);
	   			camera.animations.push(camera_boxes[1]);
	   			camera.animations.push(camera_boxes[2]);
	   			scene.beginAnimation(camera, 0, input.speed);


	   			//This part deals with compress animation
	   			setTimeout(function() {
	   				for (var i = 1; i < scene.meshes.length; i++) {
		   				scene.meshes[i].animations.push(rotate_boxes[i - 1]);
		   				scene.meshes[i].animations.push(translate_boxes[i - 1]);
		   				scene.beginAnimation(scene.meshes[i], 0, input.speed * 2);
		   			}
		   			for (var i = 1; i < scene.meshes.length; i++) {
		   				scene.meshes[i].animations = [];
		   			}
	   			}, 200);
	   			
	   			//Removes all the animations so as not to affect animations in the future
	   			for (var i = 1; i < scene.meshes.length; i++) {
	   				scene.meshes[i].animations = [];
	   			}
	   			camera.animations = [];
	   		}

	   		//This is the helper function that creates all the actions for the ghost box as well all the listeners; this is a emcompassing function that chains everything together
	   		function create_scene() {
	   			
		        // This creates a light, aiming 0,1,0 - to the sky.
		        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
		        // Dim the light a small amount
		        light.intensity = .5;

		        


		        //This adds a click listener to the window and handles the events when a user clicks on an object. Note that I did not user actions in babylon.js to do it because I
		        //need to create a custom raycast to select meshes within the invisible box, as the default onmouseover action can only select the first mesh that the mouse intersects (//
		        //which is the invisible box and that is not the desired behaviour)
		        window.addEventListener("click", function () {
					//pickResult is mesh that is being clicked upon
				    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
				    //point is the 3d coordiantes of the mesh that is being clicked on
				    var point = pickResult.pickedPoint;
				    //the source is the camera's 3d coordinates
				    var source = camera.position;
				    //If point is not null, then the mouse indeed clicked on a mesh, else do nothing
				    if (point) {
				    	//Use vector subtraction to obtain a directional vector
				   		var direction = point.subtract(source).normalize();
				   		//Creatre a customized ray that takes in source and a direction, the length of the ray should be long so I chose 1000
					    var ray = new BABYLON.Ray(source, direction, 1000);
					    //Now hit is an array of meshes that intersects the beam that shoots from the camera position to the mouse
					    var hit = scene.multiPickWithRay(ray);
					    //Check what the first intersected mesh is; if hit[1] is null then do nothing, else call my click_animation logic on it
					    if (hit[1]) {
					    	var mesh = hit[1].pickedMesh;
					    	click_animation_logic(mesh, input);
					    }
				    }
				});

		        //This adds a mousemove listener to the scene so that when the mosue hovers over tile, it "lightens up", indicating that the mouse is indeed hovering over it
		        //The tricky part with this is also the fact that the invisible box is in the way, so a similar raycasting method is used

		        //The current_mesh variables stores the current mesh that is being "lightened"
		        var current_mesh;
				window.addEventListener("mousemove", function (e) {
					//Should only matter in the first state
					if (hover_enabled) {
						//Same as the part in the click listener
						var pickResult = scene.pick(scene.pointerX, scene.pointerY);
						var point = pickResult.pickedPoint;
					   	var source = camera.position;
					    if (point) {
					   		var direction = point.subtract(source).normalize();
						    var ray = new BABYLON.Ray(source, direction, 1000);
						    var hover = scene.multiPickWithRay(ray);
						    if (!hover[1]) {
						    	//When the user is not hovering over anything outside the invisible box; simply set transparency of everything to 1
						    	for (var i = 1; i < scene.meshes.length; i++) {
						    		scene.meshes[i].material.alpha = 1;
						    	}
						    }
						    else {
						    	//This is when the user is hovering over something other than the invisible box
						    	var mesh = hover[1].pickedMesh;
						    	//Note that by changing the transparency of the mesh can create the "lightening" effect
						    	mesh.material.alpha = 0.5;
						    	//If the current mesh that is picked is different from before, then change the previous mesh's transparancey back to 1
						    	if (current_mesh && mesh.id != current_mesh.id) {
						    		current_mesh.material.alpha = 1;
						    	}
						    	//Update current_mesh variable
						    	current_mesh = mesh;
						    }
					    }
					}
				});
		        




			    // Register a render loop to repeatedly render the scene
			    engine.runRenderLoop(function () {
			        scene.render();
			    });


			    // Watch for browser/canvas resize events
			    window.addEventListener("resize", function () {
			        engine.resize();
			    });

			    //This is a local variable used by the scroll listener to make sure that only 1 scroll event is passed through in a certain time interval;
			    //This ensures that when user scrollls, it will only shift the tiles up or down once
			    var animation_start = true;

			    //This function adds a mouse scroll listener. The desired effect is when the user scrolls, one tile should be shifted up or down. The difficult part 
			    //here is that numrous mouse scroll events fire when a user scrolls
				$(window).on('mousewheel DOMMouseWheel', $.throttle( 600, function(event) {
					//Should only have effect when in scrolling state
					if (scroll_enabled) {
						//only when the animation is starting
						if (animation_start) {
							//Immediately set it to false as further scroll events emitted from the user will not be registered, for the time being
							animation_start = false;
							//When scrollling down
							if (event.originalEvent.deltaY <= -2.5) {
								//Retrieve animations, add animations, begin animations and delete animations
						    	var boxes = create_scroll_animation(scene, false, input);
						    	//boxes.length is 0 if scrolled all the way up
						    	if (boxes.length != 0) {
						    		for (var i = 1; i < scene.meshes.length; i++) {
						   				scene.meshes[i].animations.push(boxes[i - 1]);
						   				scene.beginAnimation(scene.meshes[i], 0, input.speed);
						   			}
						   			for (var i = 1; i < scene.meshes.length; i++) {
						   				scene.meshes[i].animations = [];
						   			}
						    	}				    	
						    }
						    //When scrolling up
						    else if (event.originalEvent.deltaY >= 2.5) {
						    	//Retrieve animations, add animations, begin animations and delete animations
						    	var boxes = create_scroll_animation(scene, true, input);
						    	//boxes.length is 0 if scrolled all the way down
						    	if (boxes.length != 0) {
						    		for (var i = 1; i < scene.meshes.length ; i++) {
						   				scene.meshes[i].animations.push(boxes[i - 1]);
						   				scene.beginAnimation(scene.meshes[i], 0, input.speed);
						   			}
						   			for (var i = 1; i < scene.meshes.length; i++) {
						   				scene.meshes[i].animations = [];
						   			}
						    	}
						    }
						    //After a certain while, set animation_start to true so the it can register another scroll event
						    setTimeout(function() {
								animation_start = true;
							}, 500 * Math.ceil(input.speed / 4));
						}
						
					} 
				}));

			    


			    scene.registerBeforeRender(function () {
			    	//console.log(hover_enabled);
				});
	   		}



	   		/****************************************
			

			End of functions and listeners section
			

		    ****************************************/
	      	




	   


		    /****************************************
			

			The following are mudularized functions to use to create the various objects in the scene
			

		    ****************************************/



		    // This function adds a tile to the scene. The dimensions of the tile is specified by the height, width, depth variables. The texture_url is the path to the texture file
		    // in jpg, png... For instance, a texture_url can be "images/volcano.jpg". For Karndean, there are 7 tiles so add_tile function should be called 7 times with the correct
		    // parameters. Note that the name of all the tiles should be unique, otherwise bugs will occur. Also the name ghost should not be used as that is the nane of the invisible
		    // box.

		    //The tile_count variable keeps track of how many tiles there are right now, and then offsets the initial position of the stiles based on the count
		    var tile_count = 0;
		    function add_tile (name, height, width, depth, texture_url) {
		    	var new_box = BABYLON.MeshBuilder.CreateBox(name, {height: height, width: width, depth: depth}, scene);
		        new_box.position.y = 0 - input.cDistance * tile_count;
		        new_box.animations = [];
		        var new_texture = new BABYLON.StandardMaterial(texture_url + "texture", scene);
		        new_texture.diffuseTexture = new BABYLON.Texture(texture_url, scene);
		        new_box.material = new_texture;
		        tile_count++;
		    }


		    //This helper function creates a tile with a bumpmap on lit. Everything is the same except for the addition of texture_url and bump_url. texture_url is the url to the 
		    //texture file; this is the same as before. bump_url is the url to the bumpmap. The bumpmap is essentially overlayed on top of the original texture
		    function add_tile_with_bumpmap(name, height, width, depth, texture_url, bump_url) {
		    	var new_box = BABYLON.MeshBuilder.CreateBox(name, {height: height, width: width, depth: depth}, scene);
		        new_box.position.y = 0 - input.cDistance * tile_count;
		        new_box.animations = [];
		        var bump = new BABYLON.StandardMaterial(texture_url + "texture", scene);
		        bump.diffuseTexture = new BABYLON.Texture(texture_url, scene);
		        bump.bumpTexture = new BABYLON.Texture(bump_url, scene);
		        new_box.material = bump;
		        tile_count++;
		    }


		    //This function adds a customized mesh tile to the scene. The mesh is imported using the babylon.js obj loader. mesh_path is the path to the directory where the 
		    //obj files reside. mesh_name is the name of the obj files. Note that both obj and mtl files must be present for the loader to work
		    //An working example is at the very bottom of this file.
		    function add_custom_mesh(mesh_path, mesh_name) {
		    	engine.enableOfflineSupport  = false
		    	BABYLON.SceneLoader.Load(mesh_path, mesh_name, engine);
		    	var loader = new BABYLON.AssetsManager(scene);
				var mesh = loader.load("batman", "", mesh_path, mesh_name);
				BABYLON.SceneLoader.ImportMesh("", mesh_path, mesh_name, scene, function (meshes) { 
				    for (var i = 0; i < meshes.length; i++) {
				    	var new_mesh = meshes[i];
				    	new_mesh.position.y = 0 - input.cDistance * tile_count;
				    	new_mesh.animations = [];
				    	tile_count++;
				    }
				});
				
		    }


		    // This function adds the invisible box to the scene. Note that the invisible box is used to deal with the hover in and hover out expansion and compression effect.
		    // So a listener must be added to the ghost_box object for this to work.
		    // IMPORTANT: LATER ON WHEN YOU CALL THE FUNCTIONS, PLEASE CALL add_ghost() BEFORE ANY OTHER TILES ARE CREATED BECAUSE THE FUNCTIONS IN animations.js REQUIRE THE GHOST OBJECT // TO BE THE FIRST OBJECT IN THE SCENE.MESHES ARRAY.
		    function add_ghost() {
		    	//The next two lines of code declares two actions in babylon that deals with hover_in and hover_out events
		        //Note that here when there is a onPointerOverTrigger, my hover_in_animation_logic helper is called and when there is a onPointerOutTrigger, my 
		        //hover_out_animation_logic is called. You can learn more about actions in BABYLON.js here: https://doc.babylonjs.com/tutorials/how_to_use_actions
		        var hover_in_expand_action = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, hover_in_animation_logic);
		        var hover_out_compress_action = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, hover_out_animation_logic);


		    	//This is the ghost box that surrounds the tiles; the hover_in and hover_out animations only occur when the mouse hovers onto or out of the invisible box;
		        //It should be very tall and hence the 2000 height
		        var ghost_box = BABYLON.MeshBuilder.CreateBox("ghost", {height: 2000, width: 5, depth: 5}, scene);
		        //Creates the action manager for the ghost box
		        ghost_box.actionManager = new BABYLON.ActionManager(scene);
		        //Register both the hover_in and hover_out animations to ghost_box
		        ghost_box.actionManager.registerAction(hover_in_expand_action);
		        ghost_box.actionManager.registerAction(hover_out_compress_action);

		   		//Just creating a standard texture for the ghost_box, it does not matter the texture cause it will be rendered transparent
		        var ghost_texture = new BABYLON.StandardMaterial("ghost", scene);
		        ghost_texture.diffuseTexture = new BABYLON.Texture("loose_lay/images/volcano.jpg", scene);
		        ghost_box.material = ghost_texture;
		        //Set the ghost box to be transparent so that it is invisible
		        ghost_texture.alpha = 0;
		    }


		    // tile_compress_distance sets the distance between each tile when they are in the compressed state, the default is 0.3
		    // tile_expanded_distance sets the distance between each tile in the expanded state after the expand animation
		    // frame sets the animation speed of all the animations in the scene. The current default is 4, and use this number as a reference to customize the animation.
		    // The higher the frame number, the slower the animation is
		    // If you want to make specific changes to the certain animations, you can change the animation frames in index.html and animations.js
		    function set_input(tile_compress_distance, tile_expanded_distance, frame) {
		    	var object = {
		    		cDistance: tile_compress_distance,
		    		eDistance: tile_expanded_distance,
		    		speed: frame
		    	}
		    	input = object;
		    }

		    
		   

		    
		    /****************************************
			

			End of modularized functions
			

		    ****************************************/





		    /****************************************
			

			Scene rendering goes here

			Note: You only need to modify the code below to create the desired effects necessary. An example is given below where 4 tiles are created.

			There are 3 kinds of tiles that you can add: the normal one with one texture overlay, the one with bumpmap on top and a customized one

			The order of calling the helper functions is as below: create_scene(), set_input(), add_ghost(), {the 7 add_tile functions}

			DO NOT CHANGE THE ORDER IN WHICH THE ABOVE FUNCTIONS ARE CALLED OTHERWISE ERRORS WILL OCCUR. ALSO add_ghost() MUST OCCUR BEFORE ALL THE OTHER 7 TILES HAVE BEEN CREATED!!!


			My code works well with frame set to less than or equal to 4, if frame is set any higher (higher means slower animation btw) then wierd bugs may occur; but I assume that 
			animation frames should be below 4 otherwise it would be too slow

			

		    ****************************************/





		    create_scene();
		    set_input(0.4, 5, 4);
		    add_ghost();
		    add_tile("box1", 0.2, 4, 4, "loose_lay/images/grass.jpg");
			add_tile("box2", 0.2, 4, 4, "loose_lay/images/ocean.jpg");
			add_tile("box3", 0.2, 4, 4, "loose_lay/images/volcano.jpg");
			add_tile_with_bumpmap("box4", 0.2, 4, 4, "loose_lay/images/volcano.jpg", "loose_lay/images/sample_bumpmap.jpg");
			add_custom_mesh("loose_lay/obj/", "capsule.obj");
			









