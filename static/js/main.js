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

        },
        bindEvents: () => {
            App.initializeData.model();

        },
        initializeData: {
            model: () => {
                let settings;
                let model3D;
                let INTERSECTED;
                let meshes = [];

                let widthCanvas = App.htmlElements.container.offsetWidth;
                let heightCanvas = App.htmlElements.container.offsetHeight;

                // Parse data from views

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

                loader.load(model, function (gltf) {
                    model3D = gltf.scene;

                    model3D.traverse(function(child){

                    })



                })


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

})();