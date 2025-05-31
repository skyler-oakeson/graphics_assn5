MySample.main = (async function() {
    'use strict';
    const canvas = document.getElementById('canvas-main');
    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('WebGL2 not supported');
        return;
    }

    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    const vertices = new Float32Array([
        // Front face
        -1.0, -1.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0, 1.0,
        -1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, 1.0,

        // Top face
        -1.0, 1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, -1.0, 1.0,

        // Bottom face
        -1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0, 1.0,
        1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0, 1.0,
    ]);


    var colors = new Float32Array([
        // Face 1 (front)
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        // Face 2 (back)
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        // Face 3 (left)
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        // Face 4 (right)
        1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
        // Face 5 (bottom)
        1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
        // Face 6 (top)
        0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1
    ]);

    const indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23,   // left
    ]);

    const vertexShaderSrc = await loadFileFromServer("/assets/shaders/simple.vert");
    const fragmentShaderSrc = await loadFileFromServer("/assets/shaders/simple.frag")

    const programInfo = initProgram(gl, vertexShaderSrc, fragmentShaderSrc)
    const buffers = initBuffers(gl, vertices, colors, indices)

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update() {
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        drawScene(gl, programInfo, buffers, {})
    }


    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {

        update();
        render();

        requestAnimationFrame(animationLoop);
    }


    console.log('initializing...');
    requestAnimationFrame(animationLoop);
}());
