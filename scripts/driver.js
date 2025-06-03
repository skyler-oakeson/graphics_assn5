MySample.main = (async function() {
    'use strict';
    const canvas = document.getElementById('canvas-main');
    const gl = canvas.getContext('webgl2');

    const near = .1;
    const far = 1000;
    const viewport = gl.getParameter(gl.VIEWPORT);
    const aspect = viewport[2] / viewport[3]; // width / height
    const fov = 90

    let perspective = perspectiveProjection(fov, aspect, near, far)
    let orthographic = orthographicProjection(10, 10, near, far)
    let projViewMatrix = orthographic

    if (!gl) {
        console.error('WebGL2 not supported');
        return;
    }

    const vertexShaderSrc = await loadFileFromServer("/assets/shaders/simple.vert");
    if (!vertexShaderSrc) {
        console.error("Unable to load vertex shader source")
    }

    const fragmentShaderSrc = await loadFileFromServer("/assets/shaders/simple.frag")
    if (!fragmentShaderSrc) {
        console.error("Unable to load fragment shader source")
    }

    const programInfo = createProgram(gl, vertexShaderSrc, fragmentShaderSrc)
    if (!programInfo || !programInfo.program) {
        console.error("Failed to compile WebGL program")
    }


    const TABLE_BUFFERS = {
        vertex: TABLE_VERTICES,
        colors: createStaticVertexBuffer(gl, TABLE_COLORS),
        index: createStaticIndexBuffer(gl, TABLE_INDICES)
    }


    const cube = new Shape(gl, programInfo, CUBE_VERTICES, CUBE_COLORS, CUBE_INDICES)
    cube.translate(4, 1, -14)
    cube.rotate(45, 45, 45)

    const tetrahedron = new Shape(gl, programInfo, TETRAHEDRON_VERTICES, TETRAHEDRON_COLORS, TETRAHEDRON_INDICES)
    tetrahedron.translate(-4, -3, -11)

    const octahedron = new Shape(gl, programInfo, OCTAHEDRON_VERTICES, OCTAHEDRON_COLORS, OCTAHEDRON_INDICES)
    octahedron.translate(-4, 3, -7)

    const shapes = [cube, tetrahedron, octahedron]

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsed) {
        if (totalTime > 5000) {
            projViewMatrix = perspective
        }

        cube.rotate(1, 0, 0)
        tetrahedron.rotate(1, 1, 1)
        octahedron.rotate(3, 0, 1)

        shapes.forEach((shape) => {
            shape.update(elapsed)
        })
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        gl.clearColor(0, 0, 0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // enable depth
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        // enable blending -- this will help when you try to make something transparent
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

        gl.useProgram(programInfo.program)

        gl.uniformMatrix4fv(programInfo.uniloc.u_proj_view_matrix, false, projViewMatrix)

        shapes.forEach((shape) => {
            shape.draw(gl, programInfo)
        })
    }


    var prevTime = performance.now()
    var totalTime = performance.now()

    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {
        const elapsed = time - prevTime
        prevTime = time
        totalTime = time

        update(elapsed);
        render();

        requestAnimationFrame(animationLoop);
    }


    console.log('initializing...');
    requestAnimationFrame(animationLoop);
}());
