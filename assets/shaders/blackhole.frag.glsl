#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

varying vec2 vUv;

#define PI 3.14159265359

// --- Noise Functions ---
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 6; i++) { // Increased octaves for detail
        v += a * noise(p);
        p = rot * p * 2.0 + vec2(100.0);
        a *= 0.5;
    }
    return v;
}

void main() {
    // 1. Setup Coordinates
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    // Mouse interaction
    vec2 mouse = uMouse * 2.0 - 1.0;
    uv += mouse * 0.1; // Subtle parallax

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // 2. Physics Parameters
    float eventHorizonRadius = 0.25;
    float photonRingRadius = 0.32; // Unstable orbit
    float accretionDiskInner = 0.35;
    float accretionDiskOuter = 0.95;
    
    // 3. Gravitational Lensing
    // Light bends around the black hole. The closer to the center, the more it bends.
    // We approximate this by pulling texture coordinates inwards non-linearly.
    float dist = r;
    float distortion = 0.18 / (dist + 0.01); // Stronger distortion near center
    vec2 distortedUV = uv * (1.0 - distortion);
    
    // 4. Accretion Disk Simulation
    // We map the disk to a tilted plane to give it 3D depth
    // Simple tilt approximation: compress Y coordinate
    float tilt = 0.4;
    vec2 diskUV = vec2(uv.x, uv.y / tilt);
    float diskR = length(diskUV);
    float diskAngle = atan(diskUV.y, diskUV.x);
    
    // Animated noise for the swirling gas
    float flowSpeed = 1.5;
    float noiseVal = fbm(vec2(diskR * 4.0 - uTime * 0.3, diskAngle * 3.0 + uTime * flowSpeed));
    
    // Disk Shape Mask
    float diskMask = smoothstep(accretionDiskInner, accretionDiskInner + 0.05, diskR);
    diskMask *= smoothstep(accretionDiskOuter, accretionDiskOuter - 0.3, diskR);
    
    // 5. Doppler Beaming (Relativistic Beaming)
    // Matter moving towards viewer (left side) appears brighter and bluer.
    // Matter moving away (right side) appears dimmer and redder.
    // We use the x-coordinate of the disk to determine this asymmetry.
    float doppler = 1.0 - uv.x * 1.5; // Brighter on left (-x), dimmer on right (+x)
    doppler = clamp(doppler, 0.2, 2.5); // Limit the range
    
    // 6. Composition
    
    // Disk Color
    // Core is hot white/blue, outer edges cool to orange/red
    vec3 hotColor = vec3(0.8, 0.9, 1.0); // Blue-white
    vec3 warmColor = vec3(1.0, 0.4, 0.1); // Orange-red
    vec3 coolColor = vec3(0.5, 0.1, 0.05); // Dark red
    
    vec3 diskColor = mix(coolColor, warmColor, noiseVal);
    diskColor = mix(diskColor, hotColor, smoothstep(0.6, 0.9, noiseVal));
    
    // Apply Doppler and Mask
    vec3 finalDisk = diskColor * diskMask * noiseVal * doppler;
    
    // Photon Ring (The thin bright ring of trapped light)
    float ringWidth = 0.015;
    float photonRing = smoothstep(photonRingRadius, photonRingRadius + ringWidth, r);
    photonRing *= smoothstep(photonRingRadius + ringWidth * 2.0, photonRingRadius + ringWidth, r);
    vec3 ringColor = vec3(1.0, 0.8, 0.6) * 2.0; // Bright glowing ring
    
    // Event Horizon (The Void)
    float shadow = smoothstep(eventHorizonRadius, eventHorizonRadius - 0.02, r);
    
    // Background Stars (Lensed)
    float starNoise = pow(hash(distortedUV * 80.0), 30.0);
    vec3 stars = vec3(starNoise) * 0.8;
    
    // Combine Everything
    vec3 finalColor = stars; // Start with stars
    
    // Add Disk (behind the black hole shadow? No, disk is in front and behind)
    // Simplified: Render disk, then cut out the hole, then add photon ring
    
    // We need to handle the "behind" part of the disk being blocked by the hole
    // But for a top-down/tilted view, the hole blocks the back part of the disk.
    // Since we are doing a 2D shader approximation:
    
    finalColor += finalDisk;
    finalColor += ringColor * photonRing;
    
    // Apply Event Horizon Shadow (blocks everything behind it)
    // But the photon ring is "on" the horizon, so we mask strictly inside it.
    finalColor *= (1.0 - smoothstep(eventHorizonRadius - 0.01, eventHorizonRadius, r));
    
    // Add a glow/bloom
    float glow = exp(-r * 2.5) * 0.3;
    finalColor += vec3(0.1, 0.2, 0.4) * glow;

    gl_FragColor = vec4(finalColor, 1.0);
    
    // Alpha blend edges for seamless integration
    gl_FragColor.a = 1.0; // Keep full alpha for the effect, rely on black background
}
