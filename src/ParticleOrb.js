import * as THREE from "three";

export function createParticleOrb(container, options = {}) {
    if (!container) {
        throw new Error("Particle container not found");
    }

    // ================= SCENE =================

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = options.mini ? 5.2 : 8.5;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const white = new THREE.Color("#f4f3ff");
    const lime = new THREE.Color("#dfff80");

    const radius = 1.25;
    const particleCount = 12500;
    const trailParticles = 6500;
    const orbitCount = 12;

    // ================= MAIN PARTICLES =================

    const positions = [];
    const colors = [];

    for (let i = 0; i < particleCount; i++) {
        const y = 1 - (i / (particleCount - 1)) * 2;
        const ring = Math.sqrt(1 - y * y);
        const angle = i * Math.PI * (3 - Math.sqrt(5));
        const r = radius + (Math.random() - 0.5) * 0.15;

        positions.push(
            Math.cos(angle) * ring * r,
            y * r,
            Math.sin(angle) * ring * r
        );

        const color = Math.random() < 0.095 ? lime : white;
        const brightness = 0.55 + Math.random() * 0.65;

        colors.push(
            color.r * brightness,
            color.g * brightness,
            color.b * brightness
        );
    }

    const basePositions = new Float32Array(positions);
    const baseColors = new Float32Array(colors);

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );

    particleGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
        size: options.mini ? 0.010 : 0.019,
        vertexColors: true,
        transparent: true,
        opacity: options.mini ? 0.8 : 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(
        particleGeometry,
        particleMaterial
    );

    root.add(particles);

    // ================= TRAIL PARTICLES =================

    const trailGroup = new THREE.Group();
    root.add(trailGroup);

    const trailPositions = [];
    const trailColors = [];

    for (let i = 0; i < trailParticles; i++) {
        const orbitIndex = Math.floor(Math.random() * 46);
        const phase = Math.random() * Math.PI * 2;
        const tilt = orbitIndex * 2.399963;
        const wobble =
            1 + 0.035 * Math.sin(phase * 5 + orbitIndex);

        const point = new THREE.Vector3(
            radius * Math.cos(phase) * wobble,
            radius * Math.sin(phase) * wobble,
            0
        );

        point.applyEuler(
            new THREE.Euler(
                tilt * 0.71,
                tilt * 0.43,
                tilt * 0.87
            )
        );

        trailPositions.push(point.x, point.y, point.z);

        const color = Math.random() < 0.11 ? lime : white;
        const intensity = 0.3 + Math.random() * 0.7;

        trailColors.push(
            color.r * intensity,
            color.g * intensity,
            color.b * intensity
        );
    }

    const trailGeometry = new THREE.BufferGeometry();

    trailGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(trailPositions, 3)
    );

    trailGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(trailColors, 3)
    );

    const trailMaterial = new THREE.PointsMaterial({
        size: options.mini ? 0.012 : 0.022,
        vertexColors: true,
        transparent: true,
        opacity: options.mini ? 0.65 : 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    trailGroup.add(
        new THREE.Points(trailGeometry, trailMaterial)
    );

    // ================= ORBIT RINGS =================

    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xaaaabb,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < orbitCount; i++) {
        const points = [];
        const a = (i / orbitCount) * Math.PI;
        const b = i * 1.618;

        for (let j = 0; j <= 240; j++) {
            const t = (j / 240) * Math.PI * 2;

            const point = new THREE.Vector3(
                radius * Math.cos(t),
                radius * Math.sin(t) * Math.cos(a),
                radius * Math.sin(t) * Math.sin(a)
            );

            point.applyAxisAngle(
                new THREE.Vector3(0, 1, 0),
                b
            );

            points.push(point);
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        trailGroup.add(
            new THREE.Line(geometry, orbitMaterial)
        );
    }

    // ================= CURSOR CONNECTIONS =================

    // A fixed-size buffer avoids rebuilding line geometry every frame.
    const maxConnections = 80;
    const connectionPositions = new Float32Array(maxConnections * 2 * 3);
    const connectionColors = new Float32Array(maxConnections * 2 * 3);

    const connectionGeometry = new THREE.BufferGeometry();

    connectionGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(connectionPositions, 3)
    );

    connectionGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(connectionColors, 3)
    );

    connectionGeometry.setDrawRange(0, 0);

    const connectionMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const connections = new THREE.LineSegments(
        connectionGeometry,
        connectionMaterial
    );

    // Connections use the orb's local coordinates.
    root.add(connections);

    // ================= CURSOR STATE =================

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(10, 10);
    const cursorWorld = new THREE.Vector3();
    const cursorLocal = new THREE.Vector3();

    const cursorPlane = new THREE.Plane(
        new THREE.Vector3(0, 0, 1),
        0
    );

    let cursorActive = false;
    let frameId;
    let disposed = false;

    function onPointerMove(event) {
        const rect = container.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        cursorActive =
            x >= 0 && x <= 1 && y >= 0 && y <= 1;

        if (!cursorActive) return;

        pointerNDC.set(
            x * 2 - 1,
            1 - y * 2
        );
    }

    function onPointerLeave() {
        cursorActive = false;
        connectionGeometry.setDrawRange(0, 0);
    }

    // ================= RESPONSIVE SIZE =================

    function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        if (options.mini) {
            root.scale.setScalar(1);
        } else if (width < 480) {
            root.scale.setScalar(0.72);
        } else if (width < 768) {
            root.scale.setScalar(0.85);
        } else {
            root.scale.setScalar(1);
        }

        // The orb never moves with the cursor.
        root.position.set(0, 0, 0);
    }

    window.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // ================= ANIMATION =================

    const clock = new THREE.Clock();

    function animate() {
        if (disposed) return;

        frameId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Fixed position, gentle continuous rotation.
        root.position.set(0, 0, 0);
        root.rotation.y = elapsed * 0.065;
        root.rotation.x = 0.24 + Math.sin(elapsed * 0.22) * 0.025;
        root.rotation.z = -0.12 + Math.sin(elapsed * 0.17) * 0.018;

        // Independent, subtle trail motion.
        trailGroup.rotation.y = Math.sin(elapsed * 0.12) * 0.08;
        trailGroup.rotation.x = Math.cos(elapsed * 0.09) * 0.06;
        trailGroup.rotation.z = Math.sin(elapsed * 0.08) * 0.025;

        root.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);

        let hasCursorHit = false;

        if (cursorActive) {
            raycaster.setFromCamera(pointerNDC, camera);

            const hit = raycaster.ray.intersectPlane(
                cursorPlane,
                cursorWorld
            );

            if (hit) {
                cursorLocal.copy(cursorWorld);
                root.worldToLocal(cursorLocal);
                hasCursorHit = true;
            }
        }

        const positionAttribute = particleGeometry.attributes.position;
        const colorAttribute = particleGeometry.attributes.color;

        const influenceRadius = 0.75;
        const repelStrength = 0.25;
        const attractStrength = 0.055;

        let connectionCount = 0;

        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;

            const bx = basePositions[index];
            const by = basePositions[index + 1];
            const bz = basePositions[index + 2];

            let px = bx;
            let py = by;
            let pz = bz;
            let glow = 0;

            if (hasCursorHit) {
                const dx = bx - cursorLocal.x;
                const dy = by - cursorLocal.y;
                const dz = bz - cursorLocal.z;

                const distance = Math.sqrt(
                    dx * dx + dy * dy + dz * dz
                );

                if (distance < influenceRadius) {
                    const proximity =
                        1 - distance / influenceRadius;

                    // Gentle attraction at the edge,
                    // smooth repulsion near the center.
                    const force =
                        proximity > 0.52
                            ? proximity * repelStrength
                            : -proximity * attractStrength;

                    const safeDistance = Math.max(distance, 0.0001);

                    px += (dx / safeDistance) * force;
                    py += (dy / safeDistance) * force;
                    pz += (dz / safeDistance) * force;

                    glow = proximity;

                    // Limit connection work to a subset of particles.
                    if (
                        i % 8 === 0 &&
                        connectionCount < maxConnections &&
                        distance < 0.68
                    ) {
                        const lineIndex = connectionCount * 6;

                        connectionPositions[lineIndex] = px;
                        connectionPositions[lineIndex + 1] = py;
                        connectionPositions[lineIndex + 2] = pz;

                        connectionPositions[lineIndex + 3] = cursorLocal.x;
                        connectionPositions[lineIndex + 4] = cursorLocal.y;
                        connectionPositions[lineIndex + 5] = cursorLocal.z;

                        const alpha = 0.08 + proximity * 0.42;

                        connectionColors[lineIndex] = lime.r * alpha;
                        connectionColors[lineIndex + 1] = lime.g * alpha;
                        connectionColors[lineIndex + 2] = lime.b * alpha;

                        connectionColors[lineIndex + 3] = lime.r * alpha * 0.7;
                        connectionColors[lineIndex + 4] = lime.g * alpha * 0.7;
                        connectionColors[lineIndex + 5] = lime.b * alpha * 0.7;

                        connectionCount++;
                    }
                }
            }

            positionAttribute.array[index] = px;
            positionAttribute.array[index + 1] = py;
            positionAttribute.array[index + 2] = pz;

            // Restore original colors outside the cursor influence.
            colorAttribute.array[index] = THREE.MathUtils.lerp(
                baseColors[index],
                lime.r,
                glow * 0.55
            );

            colorAttribute.array[index + 1] = THREE.MathUtils.lerp(
                baseColors[index + 1],
                lime.g,
                glow * 0.55
            );

            colorAttribute.array[index + 2] = THREE.MathUtils.lerp(
                baseColors[index + 2],
                lime.b,
                glow * 0.55
            );
        }

        positionAttribute.needsUpdate = true;
        colorAttribute.needsUpdate = true;

        connectionGeometry.attributes.position.needsUpdate = true;
        connectionGeometry.attributes.color.needsUpdate = true;
        connectionGeometry.setDrawRange(0, connectionCount * 2);

        renderer.render(scene, camera);
    }

    resize();
    animate();

    // ================= CLEANUP =================

    return function destroyParticleOrb() {
        disposed = true;

        cancelAnimationFrame(frameId);
        resizeObserver.disconnect();

        window.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);

        particleGeometry.dispose();
        particleMaterial.dispose();

        trailGeometry.dispose();
        trailMaterial.dispose();

        connectionGeometry.dispose();
        connectionMaterial.dispose();

        orbitMaterial.dispose();
        renderer.dispose();

        if (renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
        }
    };
}
