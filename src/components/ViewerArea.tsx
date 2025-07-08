import React, { useRef, useEffect } from 'react';
import './ViewerArea.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const ViewerArea: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let animationId: number;

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);

      // Camera
      const container = mountRef.current;
      camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      // OrbitControls
      controls = new OrbitControls(camera, renderer.domElement);
      
      // config for trackpad
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 1.0;
      controls.zoomSpeed = 1.0;
      controls.panSpeed = 1.0;
      controls.enableZoom = true;
      controls.enableRotate = true;
      controls.enablePan = true;
      controls.minDistance = 2;
      controls.maxDistance = 50;
      controls.target.set(0, 0, 0);
      controls.update();

      renderer.domElement.style.touchAction = 'none';
      renderer.domElement.tabIndex = 0;

      // Lights
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);

      // Loading the 3D model
      const mtlLoader = new MTLLoader();
      mtlLoader.setPath('/Gear/');
      
      mtlLoader.load('Gear1.mtl', (materials) => {
        materials.preload();
        
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/Gear/');
        
        objLoader.load(
          'Gear1.obj',
          (object) => {
            // Adjust the scale and position of the model
            object.scale.setScalar(0.1); // Reduce the scale if too large
            object.position.set(0, 0, 0);
            
            // Center the model
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);
            
            scene.add(object);
            console.log('Modello Gear caricato con successo!');
          },
          (progress) => {
            console.log('Caricamento OBJ:', (progress.loaded / progress.total * 100) + '%');
          },
          (error) => {
            console.error('Errore caricamento OBJ:', error);
            // Fallback: add a cube if the loading fails
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
          }
        );
      }, 
      (progress) => {
        console.log('Caricamento MTL:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Errore caricamento MTL:', error);
        // Fallback: load only the OBJ without materials
        const objLoader = new OBJLoader();
        objLoader.setPath('/Gear/');
        
        objLoader.load('Gear1.obj', (object) => {
          object.scale.setScalar(0.1);
          object.position.set(0, 0, 0);
          
          // Apply a base material
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshLambertMaterial({ color: 0x888888 });
            }
          });
          
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          object.position.sub(center);
          
          scene.add(object);
          console.log('Modello Gear caricato senza materiali MTL');
        });
      });

      // Grid for reference
      const gridHelper = new THREE.GridHelper(20, 20);
      scene.add(gridHelper);

      // Axes for orientation
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);

      // First render
      renderer.render(scene, camera);

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Resize handler
      const handleResize = () => {
        if (!mountRef.current) return;
        
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup function to prevent memory leak
      return () => {
        console.log('Cleanup ViewerArea - Disposing Three.js objects...');
        
        // Remove event listener
        window.removeEventListener('resize', handleResize);
        
        // Stop the animation loop
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        
        // Dispose the controls
        if (controls) {
          controls.dispose();
        }
        

        
        // Function to dispose of materials and textures
        const disposeMaterial = (material: THREE.Material) => {
          // Dispose the textures if present
          Object.keys(material).forEach(key => {
            const value = (material as any)[key];
            if (value && value instanceof THREE.Texture) {
              value.dispose();
            }
          });
          
          // Dispose the material
          material.dispose();
        };
        
        // Function to dispose of entire objects more aggressively
        const disposeObjectCompletely = (obj: THREE.Object3D) => {
          if (obj instanceof THREE.Mesh) {
            // Dispose geometry
            if (obj.geometry) {
              obj.geometry.dispose();
            }
            
            // Dispose materials more thoroughly
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach(material => {
                  disposeMaterial(material);
                });
              } else {
                disposeMaterial(obj.material);
              }
            }
          }
          
          // For lights, dispose specific properties
          if (obj instanceof THREE.Light) {
            if ((obj as any).shadow && (obj as any).shadow.map) {
              (obj as any).shadow.map.dispose();
            }
          }
          
          // Remove from parent before disposing
          if (obj.parent) {
            obj.parent.remove(obj);
          }
          
          // Dispose children recursively
          while (obj.children.length > 0) {
            disposeObjectCompletely(obj.children[0]);
          }
        };
        
        // Dispose of all objects in the scene
        if (scene) {
          // Use the more aggressive dispose method
          while (scene.children.length > 0) {
            disposeObjectCompletely(scene.children[0]);
          }
          
          // Clear the scene
          scene.clear();
          
          // Dispose scene itself if possible
          if ((scene as any).dispose) {
            (scene as any).dispose();
          }
        }
        
        // Dispose the renderer and remove from the DOM
        if (renderer && mountRef.current) {
          // Remove canvas from the DOM
          if (mountRef.current.contains(renderer.domElement)) {
            mountRef.current.removeChild(renderer.domElement);
          }
          
          // Force context loss to free GPU resources
          const gl = renderer.getContext();
          if (gl && gl.getExtension('WEBGL_lose_context')) {
            gl.getExtension('WEBGL_lose_context')!.loseContext();
          }
          
          // Clear renderer info and properties
          renderer.info.memory.geometries = 0;
          renderer.info.memory.textures = 0;
          renderer.info.render.calls = 0;
          renderer.info.render.triangles = 0;
          renderer.info.render.points = 0;
          renderer.info.render.lines = 0;
          
          // Dispose the renderer
          renderer.dispose();
          renderer.forceContextLoss();
          
          // Set renderer properties to null for garbage collection
          (renderer as any).domElement = null;
          (renderer as any).context = null;
        }
        
        // Clear references to help garbage collection
        scene = null as any;
        camera = null as any;
        renderer = null as any;
        controls = null as any;
        
        // Force garbage collection if available (development only)
        if ((window as any).gc) {
          (window as any).gc();
        }
        
        console.log('Cleanup ViewerArea completato - Memory leak risolto');
        
        // Delay to let garbage collection work
        setTimeout(() => {
          console.log('Garbage collection cycle completed');
        }, 100);
      };

    } catch (error) {
      console.error('Errore durante l\'inizializzazione Three.js:', error);
    }
  }, []);

  return (
    <div className="viewer-area">
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default ViewerArea; 