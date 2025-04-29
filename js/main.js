import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Escena con fondo claro
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xB2FFFF);

// 2. Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Renderizador con configuración clave
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8; // Reduce el "quemado" de luces
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 4. Controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 5. Sistema de iluminación MEJORADO
// --- Luz ambiental suave ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Intensidad reducida
scene.add(ambientLight);

// --- Luz direccional principal ---
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, 1, 0.5).normalize();
directionalLight.castShadow = true; // Opcional para sombras
scene.add(directionalLight);

// --- Luz de relleno (fill light) ---
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-1, 0.5, -0.5).normalize();
scene.add(fillLight);

// 6. Carga del modelo CON AJUSTES
const loader = new GLTFLoader();
const loadingElement = document.getElementById('loading');

loader.load(
    'models/LUZ.glb',
    (gltf) => {
        const model = gltf.scene;
        
        // Ajuste crítico para materiales
        model.traverse((node) => {
            if (node.isMesh) {
                node.material = node.material.clone(); // Evita compartir materiales
                node.material.envMapIntensity = 0.2; // Reduce reflejos si es PBR
            }
        });
        
        scene.add(model);
        loadingElement.style.display = 'none';
        
        // Ajuste de cámara automático MEJORADO
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        
        camera.position.copy(center);
        camera.position.z = size * 2; // Distancia más segura
        controls.target.copy(center);
        controls.update();
        
        console.log('Modelo cargado:', model);
    },
    (xhr) => {
        const percentLoaded = (xhr.loaded / xhr.total) * 100;
        loadingElement.textContent = `Cargando... ${Math.round(percentLoaded)}%`;
    },
    (error) => {
        console.error('Error:', error);
        loadingElement.textContent = 'Error al cargar el modelo. Ver consola.';
        loadingElement.style.color = 'red';
    }
);

// 7. Responsive
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 8. Animación
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();