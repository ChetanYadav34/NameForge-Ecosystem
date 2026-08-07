import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

export const BubbleMaterial = shaderMaterial(
  {
    uTime: 0,
    uBaseColor: new THREE.Color('#e0f2fe'),
    uIridescence: 1.0,
    uHoverState: 0.0,
  },
  // vertex shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float uTime;
    uniform float uHoverState;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      // Subtle vertex displacement for floating bubble effect
      float noise = sin(uTime * 2.0 + position.y * 3.0 + position.x * 2.0) * 0.03;
      // Amplify displacement on hover
      noise += sin(uTime * 5.0 + position.z * 4.0) * 0.02 * uHoverState;
      
      vec3 pos = position + normal * noise;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // fragment shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform vec3 uBaseColor;
    uniform float uIridescence;
    uniform float uHoverState;
    
    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = dot(vNormal, viewDir);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, 3.0);
      
      // Iridescence based on viewing angle
      vec3 iridescenceColor = vec3(
        0.5 + 0.5 * cos(fresnel * 10.0 + 0.0),
        0.5 + 0.5 * cos(fresnel * 10.0 + 2.0),
        0.5 + 0.5 * cos(fresnel * 10.0 + 4.0)
      );
      
      vec3 finalColor = mix(uBaseColor, iridescenceColor, uIridescence * fresnel);
      // Brighten on hover
      finalColor += vec3(0.2) * uHoverState;
      
      gl_FragColor = vec4(finalColor, 0.4 + fresnel * 0.6);
    }
  `
);
