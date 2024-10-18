import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


(() => {

    let App = {
        htmlElements: {
            container: document.getElementById('canvas-container'),
            panelContainer: document.getElementById('moveGui'),



        },
        init: () => {
            App.bindEvents();
        },
        bindEvents: () => {
            App.initializeData.model();

        },
        initializeData: {
            model: () => {
                console.log('Start model function');
                
                // Boiler Plate Code
               
                let model3D;
                let model3DData;
                let INTERSECTED;
                let meshes = [];

                let widthCanvas = App.htmlElements.container.offsetWidth;
                let heightCanvas = App.htmlElements.container.offsetHeight;

                // Parse data from views
                console.log(objectTypes);
                model3DData = JSON.parse(modelData);
                // console.log(model3DData);

                const clock = new THREE.Clock();

                const raycaster = new THREE.Raycaster()
                const pointer = new THREE.Vector2()

                const renderer = new THREE.WebGLRenderer( {antialias: true });
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( widthCanvas, heightCanvas );

                App.htmlElements.container.appendChild( renderer.domElement );

                document.addEventListener( 'pointermove', onPointerMove );

                const scene = new THREE.Scene();
                scene.background = new THREE.Color( 0xbfe3dd );

                const camera = new THREE.PerspectiveCamera( 40, widthCanvas/heightCanvas, 0.1, 1000 );
                camera.position.set( 350, 0, 5);
                camera.lookAt( 0, 0, 0);

                const light = new THREE.AmbientLight( 'white', 0.9);
                scene.add(light);

                const controls = new OrbitControls( camera, renderer.domElement );
                controls.update();
                controls.enablePan = true;
                controls.enableDamping = true;

                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

                const loader = new GLTFLoader();
                loader.setDRACOLoader( dracoLoader );

                const objects = [];

               loader.load(model, function( gltf ){

                model3D = gltf.scene;

                model3D.traverse(function(child) {
                   
                    if (child.isMesh){
                        
                        if (child.material) {
                            child.material = child.material.clone();
                        }

                    child.material.metalness = 0;
                    meshes.push(child);
                    let dataObject;

                    dataObject = App.utils.getObjectData(child.name, model3DData);
                    // console.log(dataObject);
                    child.userData = dataObject;
                    // console.log(child.userData.objectType);
                    if (child.userData.objectType == "Isolated Footing"){
                        child.material.color.setHex( 0xffff00);
                    }
                    if (child.userData.objectType == "Concrete Beam"){
                        child.material.color.setHex( 0xffc0cb);
                    }
                    if (child.userData.objectType == "Steel Section"){
                        child.material.color.setHex( 0x0000ff);
                    }
                    if (child.userData.objectType == "Roof"){
                        child.material.color.setHex( 0x06402b);
                    }
                    if (child.userData.objectType == "Floor"){
                        child.material.color.setHex( 0x808080);
                    }
                    if (child.userData.objectType == "Concrete Column"){
                        child.material.color.setHex( 0xffa500);
                    }
                    if (child.userData.objectType == "Stair"){
                        child.material.color.setHex( 0x7b3f00);
                    }


                    }
                   


                })
                model3D.position.set(0, 0,0);
                model3D.scale.set( 1,1,1 );
                scene.add( model3D );

                renderer.setAnimationLoop(animate);



               }, undefined, function(e){
                console.error(e);
               });

               createPanel(model3D);

               window.onresize = function () {
                camera.aspect = widthCanvas / heightCanvas;
                camera.updateProjectionMatrix();

                renderer.setSize( widthCanvas, heightCanvas );
               };
            

               function animate() {
                const delta = clock.getDelta();

                controls.update();
                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObjects(meshes, false);
                // console.log(intersects)
                if (intersects.length>0){
                	for (let i=0; i<intersects.length;i++){
                		console.log(intersects[i].object.name)
                	}
                }


                renderer.render( scene, camera );

               }

               function createPanel (model3D){
                
                let settings;
                const panel = new GUI( {width: 200, autoPlace: false });
                let panelContainer = App.htmlElements.panelContainer;
                panelContainer.appendChild(panel.domElement);
                panel.close();
                const folder1 = panel.addFolder('visibility');
                folder1.close();

                settings = {
                    'show model': true,
                }

                folder1.add(settings, 'show model').onChange(showModel);

            }

            function showModel (visibility){
                
                model3D.visible = visibility;
            }

            function onPointerMove(event) { 
                const rect = renderer.domElement.getBoundingClientRect()
                // console.log(rect)
                pointer.x = ((event.clientX - rect.left) / (rect.width)) * 2 - 1;
                pointer.y = -((event.clientY - rect.top) / (rect.height)) * 2 + 1
                
            }

            

            }
            
        },
        utils:{
            getObjectData: (objectName, objectsData)=>{
                // console.log(objectName);
                let number;
                let name;
                let description;
                let objectType
                for (let i=0; i<objectsData.length; i++){
                    if (objectName == objectsData[i].object_name){
                        number = objectsData[i].number;
                        description = objectsData[i].description;
                        objectType =objectsData[i].object_type;
                        return {
                            number: number,
                            objectName: objectName,
                            description: description,
                            objectType: objectType,
                        }
                    }
                }
                return {
                    number: "",
                    objectName: objectName,
                    description: "",
                    objectType: ""
                }

            },
           

           


        }
    }
    App.init();

})();