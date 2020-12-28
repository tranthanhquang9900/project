var i = 0;
      function move() {
        if (i == 0) {
          i = 1;
          var container = document.getElementById("container")
          var elem = document.getElementById("myBar");
          var width = 0;
          var id = setInterval(frame, 22);
          function frame() {
            if (width >= 100) {
                container.style.display = "none";
                clearInterval(id);
                app();            
                i = 0;
            } else {
              width+=1;
              console.log("afdh", width);
              elem.style.width = width + "%";
            }
          }
        }
      }

var app = function() {
    // init scene, camera, objects and renderer
    var scene, camera, renderer,car;
    let mixerCar;
    const clock = new THREE.Clock();

    var meteors = [];
    var barriers = [];
    var group = new THREE.Group(meteors);

    var randomInRange = function(min, max){
        return Math.random()*(max-min)+min;
    }

    var create_barrier = function(){
        var geometry = new THREE.TorusGeometry(3,1.5,20,50);
        var material = new THREE.MeshBasicMaterial({color:Math.random()*0xffffff});
        var barrier = new THREE.Mesh(geometry,material);
        
        barrier.position.x = randomInRange(-200, 200);
        barrier.position.y = 0;
        barrier.position.z = -1000;
        barrier.name = "barrier";
        scene.add(barrier);
        barriers.push(barrier);
    };
    
    var meteor = function () {
        var material = new THREE.MeshBasicMaterial({
            color:0xfff4bd
          });

          // Cube  
        var geometry = new THREE.SphereGeometry( 2.2, 8, 6);   

        var meteor = new THREE.Mesh(geometry,material);

        meteor.position.x = randomInRange(-1500, 1500);
        meteor.position.y = randomInRange(-1500, 1500);
        meteor.position.z = randomInRange(-4000, 1000);
        meteor.name ="meteor";

        group.add(meteor);
        scene.add(group);
        // scene.add(meteor);
        meteors.push(meteor);
    };

    var load_car_model = function() {
        var gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load("./data/models/car/scene.gltf", (gltf) => {
            car = gltf.scene;
            car.scale.setScalar(2);
            car.rotation.y = MY_LIBS.degToRad(45);
            car.position.set(0,0,1000);
            scene.add(car);
            mixerCar = new THREE.AnimationMixer(car);
            gltf.animations.forEach((clip) => {
                mixerCar.clipAction(clip).play();
            })
        });
    };
    
    var create_skybox = function(){
        var geometry = new THREE.BoxGeometry(10000,10000,10000);
        var front_texture = new THREE.TextureLoader().load("./data/textures/skybox/corona_ft.png");
        var back_texture = new THREE.TextureLoader().load("./data/textures/skybox/corona_bk.png");
        var up_texture = new THREE.TextureLoader().load("./data/textures/skybox/corona_up.png");
        var down_texture = new THREE.TextureLoader().load("./data/textures/skybox/corona_dn.png");
        var right_texture = new THREE.TextureLoader().load("./data/textures/skybox/corona_rt.png");
        var left_texture = new THREE.TextureLoader().load("./data/textures/skybox/corona_lf.png");

        var materials = [];
        materials.push(new THREE.MeshBasicMaterial({map:front_texture}));
        materials.push(new THREE.MeshBasicMaterial({map:back_texture}));
        materials.push(new THREE.MeshBasicMaterial({map:up_texture}));
        materials.push(new THREE.MeshBasicMaterial({map:down_texture}));
        materials.push(new THREE.MeshBasicMaterial({map:right_texture}));
        materials.push(new THREE.MeshBasicMaterial({map:left_texture}));

        //for loop
        for(var i=0; i<6; i++){
            materials[i].side = THREE.BackSide;
        }
        skybox = new THREE.Mesh(geometry,materials);
        scene.add(skybox);
    }
    var init_app = function() {
        // 1. Create the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // 2. Create and locate the camera
        
        var fieldOfViewY = 60, aspectRatio = window.innerWidth / window.innerHeight, near = 0.1, far = 10000.0;
        camera = new THREE.PerspectiveCamera(fieldOfViewY, aspectRatio, near, far);
        camera.position.z = 600;
        camera.position.y = 0;

        // light
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        var pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(3, 1, 3);

        scene.add(ambientLight);
        scene.add(pointLight);

        // three directional lights

        const keyLight = new THREE.DirectionalLight( 0xffffff, 1);
        keyLight.position.set(100,1,-50);

        const fillLight = new THREE.DirectionalLight( 0xffffff, 1);
        fillLight.position.set(100,1,50);

        const backLight = new THREE.DirectionalLight( 0xffffff, 1);
        backLight.position.set(-50,1,10);

        scene.add(keyLight);
        scene.add(fillLight);
        scene.add(backLight);

        load_car_model();
        create_skybox();

        // 4. Create the renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // control camera
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.campingFactor = 0.25;
        controls.enableZoom = true;

        // controls.update();
        
    };
    // mover the object by keydown 
    document.addEventListener('keydown', function(e){
        console.log("the current key:"+e.keyCode);
        var speed = 75;
        switch(e.keyCode){
            case 65:
                car.position.x += -speed;
                car.rotateX(-0.05);
                break;
            case 68:
                car.position.x += speed;
                car.rotateX(0.05);
                break;
            default:
                console.log("the current key:"+e.keyCode);
        }
    });

    var update_meteor = function(meteor,index){
        meteor.position.z += 5;
        if(meteor.position.z >=1000){
            meteors.splice(index,1);
            scene.remove(meteor);
        }
    };

    var update_barrier = function(barrier,index){
        barrier.position.z += 5;
        if(barrier.position.z >=1000){
            barriers.splice(index,1);
            scene.remove(barrier);
        }
    };

    // main animation loop - calls every 50-60ms
    var mainLoop = function() {
        requestAnimationFrame(mainLoop);
        const delta = clock.getDelta();
        mixerCar.update(delta);
        group.rotation.z += 0.003;

        let randBarrier = Math.random();
        if(randBarrier < 0.005){
            create_barrier();
        }
        barriers.forEach(update_barrier);

        let rand = Math.random();
        if(rand = 1){
            meteor();
        }
        meteors.forEach(update_meteor);
        renderer.render(scene, camera);
    };
    init_app();
    mainLoop();
}



