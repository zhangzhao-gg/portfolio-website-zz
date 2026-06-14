import * as THREE from 'three';

// 台灯顶点世界坐标，与 LampBeam.ts 保持一致
const LAMP_APEX = new THREE.Vector3(0, 5500, 600);

// ------------------------------------------------------------------ vertex --
const vertexShader = `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ---------------------------------------------------------------- fragment --
const fragmentShader = `
varying vec2 vUv;
varying vec3 vWorldPosition;

uniform sampler2D uBakedTexture;
uniform vec3  uLampPosition;
uniform float uAmbient;
uniform float uLampIntensity;
uniform float uLampRadius;

void main() {
    vec4 baked = texture2D(uBakedTexture, vUv);

    // 距离衰减：越靠近台灯越亮
    float dist  = distance(vWorldPosition, uLampPosition);
    // 线性衰减更柔和，smoothstep 避免硬边
    float atten = smoothstep(uLampRadius, uLampRadius * 0.1, dist);

    // 暖白色灯光
    vec3 lampColor = vec3(1.0, 0.88, 0.7);

    vec3 col = baked.rgb * uAmbient
             + baked.rgb * lampColor * atten * uLampIntensity;

    gl_FragColor = vec4(col, baked.a);
}
`;

export default class BakedModel {
    model: LoadedModel;
    texture: LoadedTexture;
    material: THREE.ShaderMaterial;

    constructor(model: LoadedModel, texture: LoadedTexture, scale?: number) {
        this.model = model;
        this.texture = texture;

        this.texture.flipY = false;
        this.texture.encoding = THREE.sRGBEncoding;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uBakedTexture:  { value: this.texture },
                uLampPosition:  { value: LAMP_APEX },
                uAmbient:       { value: 0.10 },
                uLampIntensity: { value: 2.2 },
                uLampRadius:    { value: 9000 },
            },
            vertexShader,
            fragmentShader,
        });

        this.model.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (scale) child.scale.set(scale, scale, scale);
                child.material = this.material;
            }
        });

        return this;
    }

    getModel(): THREE.Group {
        return this.model.scene;
    }
}
