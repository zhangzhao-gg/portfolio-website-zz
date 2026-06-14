import * as THREE from 'three';
import Application from '../Application';

// 简约吊灯 — 细线 + 圆锥灯罩 + 发光灯泡
export default class CeilingLamp {
    application: Application;
    scene: THREE.Scene;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.create();
    }

    create() {
        const group = new THREE.Group();

        // 灯罩中心位置 — 天花板高处
        const lampY = 5500;
        const lampZ = 600;

        // 吊线：从天花板到灯罩顶部
        const wireMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const wireGeo = new THREE.CylinderGeometry(6, 6, 5000, 8);
        const wire = new THREE.Mesh(wireGeo, wireMat);
        wire.position.set(0, lampY + 2500, lampZ);
        group.add(wire);

        // 灯罩：倒锥台，简约工业风
        const shadeMat = new THREE.MeshBasicMaterial({
            color: 0x1a1a1a,
            side: THREE.DoubleSide,
        });
        const shadeGeo = new THREE.CylinderGeometry(50, 280, 180, 32, 1, true);
        const shade = new THREE.Mesh(shadeGeo, shadeMat);
        shade.position.set(0, lampY, lampZ);
        group.add(shade);

        // 灯罩顶盖
        const capGeo = new THREE.CircleGeometry(50, 32);
        const cap = new THREE.Mesh(capGeo, shadeMat);
        cap.rotation.x = Math.PI / 2;
        cap.position.set(0, lampY + 90, lampZ);
        group.add(cap);

        // 灯泡发光体：暖白色
        const bulbMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(2.5, 2.2, 1.6),
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
        });
        const bulbGeo = new THREE.SphereGeometry(40, 16, 16);
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(0, lampY - 50, lampZ);
        group.add(bulb);

        // 灯泡光晕
        const glowMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(1.2, 1.1, 0.8),
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const glowGeo = new THREE.SphereGeometry(70, 16, 16);
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.set(0, lampY - 50, lampZ);
        group.add(glow);

        this.scene.add(group);
    }
}
