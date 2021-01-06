function move() {
    var i = 0;
    if (i == 0) {
    i = 1;
    var container = document.getElementById("container");
    var tutorial = document.getElementById("tutorial");
    var count2 = document.getElementById("count2");
    var countObj = document.getElementById("count");
    var elem = document.getElementById("myBar");
    var width = 0;
    var id = setInterval(frame, 30);
    function frame() {
    if (width >= 100) {
        count2.style.display = "block";
        countObj.style.display = "block";
        tutorial.style.display = "block";
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
};
 
function tryAgain(){
    window.location.reload();
}

var app = function() {
    // init scene, camera, objects and renderer
    var scene, camera, renderer,car;
    let mixerCar;
    const clock = new THREE.Clock();
    var barrier;
    var count =0;
    var point =0;

    var meteors = [];
    var barriers = [];
    var group = new THREE.Group(meteors);
    var positionA = new THREE.Vector3();
    var imgLoad = new THREE.TextureLoader().load("./data/textures/box.jpg");

    var randomInRange = function(min, max){
        return Math.random()*(max-min)+min;
    }

    var create_barrier = function(){
        var geometry = new THREE.BoxGeometry(22,22,22);
        var material = new THREE.MeshBasicMaterial({map:imgLoad,color:Math.random()*0xffffff});
        // var Lambermaterial = new THREE.MeshLamberMaterial({map:imgLoad,color:Math.random()*0xffffff,emissive: 'black'});
        // var light = new THREE.MeshPhongMaterial({color:Lambermaterial,emissive:Lambermaterial,shininess:150});
        barrier = new THREE.Mesh(geometry,material);
        
        barrier.position.x = randomInRange(-100, 100);
        barrier.position.y = -50;
        barrier.position.z = -1500;
        barrier.name = "barrier";
        scene.add(barrier);
        barriers.push(barrier);
    };
    var loader = new THREE.FontLoader();
        loader.load('js/helvetiker_bold.typeface.json', function ( font ) {
        
        var textGeometry = new THREE.TextGeometry("Enter To Play Game", {
            font: font,
            size: 5,
            height: 5,
            curveSegments: 12,
        
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelOffset: 0
        });
    
        var textMaterial = new THREE.MeshPhongMaterial( 
        { color: 0x00fff2,specular: 0xffffff}
        );
    
        mesh = new THREE.Mesh( textGeometry, textMaterial );
        mesh.position.set(-33,10,-100);
        scene.add( mesh );
        
        });
    
    var meteor = function () {
        var material = new THREE.MeshBasicMaterial({
            color:0xfff4bd
          });

          // Cube  
        var geometry = new THREE.SphereGeometry( 3, 8, 6);   

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
            car.position.set(0,-500,0);
            scene.add(car);
            mixerCar = new THREE.AnimationMixer(car);
            gltf.animations.forEach((clip) => {
                mixerCar.clipAction(clip).play();
            })
        });
    };
    
    var init_app = function() {
        // 1. Create the scene
        scene = new THREE.Scene();
        scene.background = new THREE.TextureLoader().load("./data/textures/background.png");
        scene.updateMatrixWorld(true);

        // 2. Create and locate the camera
        var fieldOfViewY = 60, aspectRatio = window.innerWidth / window.innerHeight, near = 0.1, far = 10000.0;
        camera = new THREE.PerspectiveCamera(fieldOfViewY, aspectRatio, near, far);
        
        // light
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        var pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(3, 1, 3);

        scene.add(ambientLight);
        scene.add(pointLight);

        // three directional lights

        const keyLight = new THREE.DirectionalLight( 0xffffff, 1);
        keyLight.position.set(100,100,-500);

        const fillLight = new THREE.DirectionalLight( 0xffffff, 1);
        fillLight.position.set(100,100,500);

        const backLight = new THREE.DirectionalLight( 0xffffff, 1);
        backLight.position.set(-50,100,100);

        scene.add(keyLight);
        scene.add(fillLight);
        scene.add(backLight);

        load_car_model();
        create_barrier();

        // 4. Create the renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);        
    };
    var gogo = false;
    // mover the object by keydown 
    document.addEventListener('keydown', function(e){
        console.log("the current key:"+e.keyCode);
        gogo = true;
        var speed = 20;
        if(e.keyCode = 13){
            switch(e.keyCode){
                case 39:
                    if(positionA.x <= 600){
                        car.position.x += speed;
                        car.rotateX(0.05);
                    }
                    break;
                case 37:
                    if(positionA.x >= -600){
                        car.position.x += -speed;
                        car.rotateX(-0.05); 
                    }
                    break;
                default:
                    console.log("the current key:"+e.keyCode);
            }
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
        barrier.position.z += 8;
        barrier.rotation.x += 0.08;
        barrier.rotation.y += 0.08;
        if(barrier.position.z >=1500){
            barriers.splice(index,1);
            scene.remove(barrier);
        }
    };

    var play = true;
    // main animation loop - calls every 50-60ms
    var mainLoop = function() {
       
        if(play){
            requestAnimationFrame(mainLoop);
        }
        
        const delta = clock.getDelta();
        mixerCar.update(delta);
        group.rotation.z += 0.003;

        if(barrier.position.z > positionA.z){
            create_barrier();
            count += 1;
            point += 1;
            document.getElementById('count').innerHTML = 'Score : ' + count;
            document.getElementById('point').innerHTML = 'Score : ' + point+" / 10";
        }

        if(count == 10){
            document.body.removeChild(renderer.domElement);
            var winner = document.getElementById("menu-game");
            var countObj = document.getElementById("count");
            countObj.style.display="none";
            winner.style.display="block";
            play = false;
        }

        if (gogo){
            scene.remove(mesh);
            barriers.forEach(update_barrier);   
        }

        let rand = Math.random();
        if(rand = 1){
            meteor();
        }
        meteors.forEach(update_meteor);

        positionA.setFromMatrixPosition(car.matrixWorld);
        barriers.forEach(barrier => {  
            if(positionA.z - 300 <= barrier.position.z && barrier.position.z <= positionA.z + 10 && barrier.position.x - 20 <= positionA.x && positionA.x <= barrier.position.x + 20){
                document.body.removeChild(renderer.domElement);
                var end = document.getElementById("menu-close");
                var countObj = document.getElementById("count");

                point = document.getElementById("point");
                point.style.display="block";

                countObj.style.display="none";
                end.style.display="block";
                play = false;
            } 
        });
        
        renderer.render(scene, camera);
    };
    init_app();
    mainLoop();
}



