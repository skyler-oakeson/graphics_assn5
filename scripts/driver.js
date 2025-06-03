MySample.main = (async function() {
    'use strict';
    const canvas = document.getElementById('canvas-main');
    const gl = canvas.getContext('webgl2');

    const near = .1;
    const far = 1000;
    const viewport = gl.getParameter(gl.VIEWPORT);
    const aspect = viewport[2] / viewport[3]; // width / height

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
    const tetrahedron = new Shape(gl, programInfo, TETRAHEDRON_VERTICES, TETRAHEDRON_COLORS, TETRAHEDRON_INDICES)
    const table = new Shape(gl, programInfo, TABLE_VERTICES, TABLE_COLORS, TABLE_INDICES)

    const shapes = [tetrahedron]

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsed) {
        tetrahedron.translate(0, 0, -.01)
        tetrahedron.rotate(.02, Plane.XY)
        tetrahedron.rotate(.03, Plane.YZ)
        tetrahedron.rotate(.02, Plane.XY)
        shapes.forEach((shape) => {
            shape.update()
        })
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
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);
        gl.useProgram(programInfo.program)

        let projViewMatrix = perspectiveProjection(45, aspect, near, far)
        gl.uniformMatrix4fv(programInfo.uniloc.u_proj_view_matrix, false, projViewMatrix)

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
