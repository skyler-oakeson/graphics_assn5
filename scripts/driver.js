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

    const programInfo = await initProgram(gl)
    const buffers = initBuffers(gl, vertices, colors, indices)

    gl.useProgram(programInfo.program)

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
        gl.clearColor(
            0.3921568627450980392156862745098,
            0.58431372549019607843137254901961,
            0.92941176470588235294117647058824,
            1.0);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        setVertexAttribute(buffers, programInfo)
        setColorAttribute(buffers, programInfo)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index.buffer);

        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 0);
    }

    function setVertexAttribute(buffers, programInfo) {
        const components = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = Float32Array.BYTES_PER_ELEMENT * 4;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex.buffer);
        gl.vertexAttribPointer(
            programInfo.attribLocations.a_vertex,
            components,
            type,
            normalize,
            stride,
            offset
        );

        gl.enableVertexAttribArray(programInfo.attribLocations.a_vertex)
    }

    function setColorAttribute(buffers, programInfo) {
        const components = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = Float32Array.BYTES_PER_ELEMENT * 4;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color.buffer);
        gl.vertexAttribPointer(
            programInfo.attribLocations.a_color,
            components,
            type,
            normalize,
            stride,
            offset
        );

        gl.enableVertexAttribArray(programInfo.attribLocations.a_color)
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
