MySample.main = (async function() {
    'use strict';
    const canvas = document.getElementById('canvas-main');
    const gl = canvas.getContext('webgl2');

    const near = .1;
    const far = 1000;
    const viewport = gl.getParameter(gl.VIEWPORT);
    const aspect = viewport[2] / viewport[3]; // width / height
    const fov = 45

    let perspective = perspectiveProjection(fov, aspect, near, far)
    let orthographic = orthographicProjection(aspect, near, far)

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
    cube.scale(.5, .5, .5)
    cube.translate(4, 1, -14)

    const tetrahedron = new Shape(gl, programInfo, TETRAHEDRON_VERTICES, TETRAHEDRON_COLORS, TETRAHEDRON_INDICES)
    tetrahedron.translate(-4, -1, -14)

    const octahedron = new Shape(gl, programInfo, OCTAHEDRON_VERTICES, OCTAHEDRON_COLORS, OCTAHEDRON_INDICES)
    octahedron.translate(-4, 3, -14)

    const shapes = [cube, tetrahedron, octahedron]

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsed) {
        shapes.forEach((shape) => {
            shape.rotate(1, 10, 3)
            shape.update()
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

        gl.uniformMatrix4fv(programInfo.uniloc.u_proj_view_matrix, false, perspective)

        shapes.forEach((shape) => {
            shape.draw(gl, programInfo)
        })
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
