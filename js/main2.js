// main.js - Versión compatible con GitHub Pages

// Cargar Three.js desde CDN
const THREE = window.THREE;

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Luces
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Cargar modelo
const loader = new THREE.GLTFLoader();
const loadingElement = document.getElementById('loading');

loader.load(
    './models/tu_modelo.glb', // Nota el ./ al inicio
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        loadingElement.style.display = 'none';
        
        // Ajustar cámara
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3()).length();
        
        camera.position.copy(center);
        camera.position.z = size * 1.5;
        controls.target.copy(center);
        controls.update();
    },
    (xhr) => {
        const percent = (xhr.loaded / xhr.total) * 100;
        loadingElement.textContent = `Cargando ${Math.round(percent)}%`;
    },
    (error) => {
        console.error('Error:', error);
        loadingElement.textContent = 'Error al cargar el modelo';
        loadingElement.style.color = 'red';
    }
);

// Redimensionamiento
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animación
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();