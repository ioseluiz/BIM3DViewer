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
                // console.log(modelData)
                model3DData = JSON.parse(modelData);

                const clock = new THREE.Clock();

                const renderer = new THREE.WebGLRenderer( {antialias: true });
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( widthCanvas, heightCanvas );

                App.htmlElements.container.appendChild( renderer.domElement );

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

            }
            
        },
        utils:{
           

           


        }
    }
    App.init();

})();