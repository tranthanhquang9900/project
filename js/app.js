var app = function() {
    // init scene, camera, objects and renderer
    var scene, camera, renderer,crate;
    let mixerBook;
    const clock = new THREE.Clock();
    const A_Key = 65, D_Key=68;

    var onKeyDown = function(e){
        console.log("the current key:"+e.keyCode);
        switch(e.keyCode){
            case A_Key:
                crate.position.x += -100;
                break;
            case D_Key:
                crate.position.x += 100;
                break;
            default:
                console.log("the current key:"+e.keyCode);
        }
    }
    
    var load_car_model = function() {
        var gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load("./data/models/scene.gltf", (gltf) => {
            book = gltf.scene;
            book.scale.setScalar(1.5);
            book.rotation.y = MY_LIBS.degToRad(45);
            book.position.set(0,-600,1000);
            scene.add(book);
            mixerBook = new THREE.AnimationMixer(book);
            gltf.animations.forEach((clip) => {
                mixerBook.clipAction(clip).play();
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
        camera.position.z = 1000;

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
        
        //control direction model
        document.addEventListener("keyDown",onKeyDown,false);
    };
    // main animation loop - calls every 50-60ms
    var mainLoop = function() {
        requestAnimationFrame(mainLoop);
        const delta = clock.getDelta();
        mixerBook.update(delta);
        renderer.render(scene, camera);
    };
    init_app();
    mainLoop();
}



