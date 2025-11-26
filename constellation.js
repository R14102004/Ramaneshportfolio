export function initConstellation(canvasSelector) {
    const canvas = document.querySelector(canvasSelector);
    if (!canvas || !window.THREE) {
        console.warn("Constellation: Canvas or THREE not found");
        return;
    }

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        canvas.offsetWidth / canvas.offsetHeight,
        0.1,
        1000
    );
    camera.position.z = 100;

    // --- Particles ---
    const particleCount = window.innerWidth < 768 ? 60 : 120;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 150; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z

        velocities.push({
            x: (Math.random() - 0.5) * 0.08,
            y: (Math.random() - 0.5) * 0.08,
            z: (Math.random() - 0.5) * 0.02,
        });
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Material for dots
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00f6ff, // Cyan
        size: 0.8,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // --- Lines ---
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00f6ff,
        transparent: true,
        opacity: 0.15,
    });

    const linesGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(lines);

    // --- Mouse Interaction ---
    const mouse = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event) => {
        mouse.x = (event.clientX - windowHalfX) * 0.05;
        mouse.y = (event.clientY - windowHalfY) * 0.05;
    };
    document.addEventListener("mousemove", onDocumentMouseMove, false);

    // --- Animation Loop ---
    const animate = () => {
        requestAnimationFrame(animate);

        // Smooth mouse movement
        target.x += (mouse.x - target.x) * 0.05;
        target.y += (mouse.y - target.y) * 0.05;

        camera.position.x += (target.x - camera.position.x) * 0.05;
        camera.position.y += (-target.y - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Update particles
        const positions = particleSystem.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;

            // Boundary check (bounce)
            if (positions[i * 3] < -75 || positions[i * 3] > 75) velocities[i].x *= -1;
            if (positions[i * 3 + 1] < -50 || positions[i * 3 + 1] > 50) velocities[i].y *= -1;
            if (positions[i * 3 + 2] < -25 || positions[i * 3 + 2] > 25) velocities[i].z *= -1;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Draw lines
        const linePositions = [];
        const connectionDistance = 25;

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < connectionDistance) {
                    // Add both points to create a line segment
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }

        lines.geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePositions, 3)
        );

        renderer.render(scene, camera);
    };

    animate();

    // Resize
    window.addEventListener("resize", () => {
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}
