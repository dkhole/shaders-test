const fragment = `
    uniform float time;
    uniform vec4 resolution;
    uniform sampler2D image;
    uniform sampler2D disp;
    uniform float progress;
    
    varying vec2 vUv;
    
    void main() {

        vec4 colorDisp = texture2D(disp, vUv.yx);
        vec2 displacedUV = vec2(
            vUv.x,
            vUv.y
        );
        displacedUV.y = mix(vUv.y, colorDisp.r - 0.2, progress);

        vec4 color = texture2D(image, displacedUV);
        color.r = texture2D(image, displacedUV + vec2(0.,5. *  0.05) * progress).r;
        color.g = texture2D(image, displacedUV + vec2(0., 5. *  0.01) * progress).g;
        color.b = texture2D(image, displacedUV + vec2(0., 5. *  0.02) * progress).b;

        gl_FragColor = color;
    }
`;

export default fragment;
