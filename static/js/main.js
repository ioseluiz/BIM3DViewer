import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


(() => {

    let App = {
        htmlElements: {
            container: document.getElementById('canvas-container'),



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
                let settings;
                let model3D;
                let model3DData;
                let INTERSECTED;
                let meshes = [];

                let widthCanvas = App.htmlElements.container.offsetWidth;
                let heightCanvas = App.htmlElements.container.offsetHeight;

                console.log(widthCanvas);
                console.log(heightCanvas);

                // Parse data from views
                console.log(modelData)
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

               window.onresize = function () {
                camera.aspect = widthCanvas / heightCanvas;
                camera.updateProjectionMatrix();

                renderer.setSize( widthCanvas, heightCanvas );
               };

               function animate() {
                const delta = clock.getDelta();

                renderer.render( scene, camera );

               }
               




            }
            
        },
        utils:{
            traverseModel: (child) => {
                if (child.isMesh){
                    child.material = child.material.clone();
                    
                }
            }
        }
    }
    App.init();

})();