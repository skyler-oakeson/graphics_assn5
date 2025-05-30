MySample.main = (function() {
    'use strict';
    const canvas = document.getElementById('canvas-main');
    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('WebGL2 not supported');
        return;
    }

    function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    function createProgram(vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        return program;
    }

    function createBuffer(type, data, usage) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, data, usage)
        return buffer
    }

    // Triangle vertex positions (X, Y, Z)
    var vertices = new Float32Array([
        -1, -1, -1, 1,
        1, -1, -1, 1,
        1, 1, -1, 1,
        -1, 1, -1, 1,
        -1, -1, 1, 1,
        1, -1, 1, 1,
        1, 1, 1, 1,
        -1, 1, 1, 1,
        -1, -1, -1, 1,
        -1, 1, -1, 1,
        -1, 1, 1, 1,
        -1, -1, 1, 1,
        1, -1, -1, 1,
        1, 1, -1, 1,
        1, 1, 1, 1,
        1, -1, 1, 1,
        -1, -1, -1, 1,
        -1, -1, 1, 1,
        1, -1, 1, 1,
        1, -1, -1, 1,
        -1, 1, -1, 1,
        -1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, -1, 1,
    ]);

    var colors = new Float32Array([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);

    var indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);




    async function initializeShaders() {
        try {
            const vertexShaderSrc = await loadFileFromServer("/assets/shaders/simple.vert");
            const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSrc);

            const fragmentShaderSrc = await loadFileFromServer("/assets/shaders/simple.frag")
            const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);

            const program = createProgram(vertexShader, fragmentShader);


            let vertexBuffer = createBuffer(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
            let positionLoc = getAndEnableVertexAttribArrayLocation(program, 'a_position')
            gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 4, 0)

            let colorsBuffer = createBuffer(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
            let colorLoc = getAndEnableVertexAttribArrayLocation(program, 'a_color')
            gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, colors.BYTES_PER_ELEMENT * 3, 0)

            let indexBuffer = createBuffer(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

            gl.useProgram(program);

        } catch (error) {
            console.error(`${error.name}: ${error.message}`)
        }
    }

    function getAndEnableVertexAttribArrayLocation(program, name) {
        let location = gl.getAttribLocation(program, name);
        if (location < 0) {
            console.error(`Failed to get attrib location for ${name}`)
        }
        gl.enableVertexAttribArray(location);

        return location
    }



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

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
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

    async function initialize() {
        await initializeShaders()
    }

    initialize()

    console.log('initializing...');
    requestAnimationFrame(animationLoop);
}());
