import * as THREE from 'three';

export const bubbleVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewVector;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewVector = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const bubbleFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewVector;
  varying vec2 vUv;
  uniform float uTime;
  
  void main() {
    float fresnel = dot(vNormal, vViewVector);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    
    // For a white background, we need darker, more saturated colors to provide contrast
    vec3 glassBlue = vec3(0.2, 0.5, 0.9); // Deeper, more saturated blue
    vec3 iridPink = vec3(0.6, 0.3, 0.8);  // Deeper purple/pink
    vec3 specularWhite = vec3(1.0, 1.0, 1.0);
    
    // Mix base glass color with iridescent shifts
    vec3 color = mix(glassBlue, iridPink, pow(fresnel, 2.0) * sin(uTime * 0.4 + vNormal.y));
    
    // Add strong Fresnel highlight for "glass edge" feel
    color = mix(color, specularWhite, pow(fresnel, 5.0));
    
    // Increased opacity for better visibility on white backgrounds
    float alpha = mix(0.15, 0.7, pow(fresnel, 2.0));
    gl_FragColor = vec4(color, alpha);
  }
`;

export class GlassMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: bubbleVertexShader,
      fragmentShader: bubbleFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }
}
