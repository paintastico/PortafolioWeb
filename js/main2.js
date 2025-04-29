// Esperar a que todo esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configuración básica
    const loadingElement = document.getElementById('loading');
    let modelLoaded = false;
    
    // 1. Crear escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);
    
    // 2. Configurar cámara
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // 3. Configurar renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    
    // 4. Controles de órbita
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // 5. Iluminación
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // 6. Cargar modelo
    const loader = new THREE.GLTFLoader();
    
    // Timeout para carga infinita
    const loadTimeout = setTimeout(() => {
        if (!modelLoaded) {
            showError("El modelo está tardando demasiado en cargar");
        }
    }, 15000); // 15 segundos
    
    loader.load(
        './models/orange.glb',
        function(gltf) {
            clearTimeout(loadTimeout);
            modelLoaded = true;
            
            const model = gltf.scene;
            scene.add(model);
            loadingElement.style.display = 'none';
            
            // Ajustar cámara al modelo
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3()).length();
            
            camera.position.copy(center);
            camera.position.z = size * 1.5;
            controls.target.copy(center);
            controls.update();
        },
        function(xhr) {
            const percent = (xhr.loaded / xhr.total) * 100;
            loadingElement.textContent = `Cargando modelo... ${Math.round(percent)}%`;
        },
        function(error) {
            clearTimeout(loadTimeout);
            showError("Error al cargar el modelo: " + error.message);
            console.error(error);
        }
    );
    
    // 7. Manejo de redimensionamiento
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // 8. Bucle de animación
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
    
    // Función para mostrar errores
    function showError(message) {
        loadingElement.innerHTML = `
            <div style="color: #ff4444;">Error</div>
            <div>${message}</div>
            <button id="retry-btn" onclick="window.location.reload()">Reintentar</button>
        `;
    }
});