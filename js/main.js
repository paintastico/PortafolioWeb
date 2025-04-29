import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Inicializar la escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xCACACA); // Color de fondo

// 2. Configurar la cámara
const camera = new THREE.PerspectiveCamera(
    75, // Campo de visión
    window.innerWidth / window.innerHeight, // Relación de aspecto
    0.1, // Plano cercano
    1000 // Plano lejano
);
camera.position.z = 5; // Posición inicial de la cámara

// 3. Configurar el renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 4. Añadir controles de órbita (para rotar/zoom/pan)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suaviza los movimientos
controls.dampingFactor = 0.05;

// 5. Añadir iluminación (esencial para ver materiales)
const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiental
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Intensidad más fuerte en luz ambiental
ambientLight.intensity = 0.01; 

// Luz direccional un poco más suave
directionalLight.intensity = 0.05;

// 6. Cargar el modelo 3D
const loader = new GLTFLoader();
const loadingElement = document.getElementById('loading');

loader.load(
    'models/cap.glb', // Ruta a tu archivo .glb o .gltf
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        
        // Ocultar mensaje de carga
        loadingElement.style.display = 'none';
        
        // Ajustar la cámara para que el modelo sea visible completamente
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        camera.position.copy(center);
        camera.position.z = size.length() * 1.5;
        controls.target.copy(center);
        controls.update();
        
        console.log('Modelo cargado correctamente:', model);
    },
    (xhr) => {
        // Progreso de carga (opcional)
        const percentLoaded = (xhr.loaded / xhr.total) * 100;
        loadingElement.textContent = `Cargando modelo... ${Math.round(percentLoaded)}%`;
    },
    (error) => {
        console.error('Error al cargar el modelo:', error);
        loadingElement.textContent = 'Error al cargar el modelo. Ver consola.';
        loadingElement.style.color = 'red';
    }
);

// 7. Manejar redimensionamiento de ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 8. Bucle de animación
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Solo necesario si controls.enableDamping = true
    renderer.render(scene, camera);
}

animate();