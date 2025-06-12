MySample.main = (async function() {
    'use strict';
    const canvas = document.getElementById('canvas-main');
    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('WebGL2 not supported');
        return;
    }


    //------------------------------------------------------------------
    //
    // Initialize gl program and variables
    //
    //------------------------------------------------------------------
    const near = .1;
    const far = 1000;
    const viewport = gl.getParameter(gl.VIEWPORT);
    const aspect = viewport[2] / viewport[3]; // width / height
    const fov = 45

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

    let perspective = perspectiveProjection(fov, aspect, near, far)
    gl.clearColor(0, 0, 0, 1.0);
    gl.clearDepth(1.0);

    // enable depth
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // enable blending -- this will help when you try to make something transparent
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // enable culling backfaces
    gl.enable(gl.CULL_FACE)
    gl.enable(gl.BACK)

    gl.useProgram(programInfo.program)


    //------------------------------------------------------------------
    //
    // Model code
    //
    //------------------------------------------------------------------

    const dragon = await loadModelFromServer(gl, programInfo, "assets/models/dragon_vrip.ply")
    dragon.translate(0, -.5, -2)

    // const model = await loadModelFromServer(gl, programInfo, "assets/models/cube.ply")

    const bunny = await loadModelFromServer(gl, programInfo, "assets/models/bun_zipper.ply")
    bunny.translate(0, -.5, -3)

    const l1 = {
        pos: new Float32Array([0, 0, 0, 1]),
        color: new Float32Array([1, 1, 1, 1])
    }

    const l2 = {
        pos: new Float32Array([0, -.3, .3, 1]),
        color: new Float32Array([1, 0, 0, 1])
    }

    let light = l1;

    function turnOffLight() {
        light["prev"] = light.color;
        light.color = new Float32Array([0, 0, 0, 0]);
    }

    function turnOnLight() {
        light.color = light.prev;
    }

    const models = [bunny]

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsed) {
        if (totalTime > 5000) {
            models.pop()
            models.push(dragon)
            light = l2;
        }

        models.forEach((model) => {
            model.rotate(1, 0, 0)
            model.update(elapsed)
        })
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(programInfo.uniloc.u_proj_matrix, false, perspective)
        gl.uniformMatrix4fv(programInfo.uniloc.u_view_matrix, false, IDENTITY_MATRIX)

        gl.uniform4fv(programInfo.uniloc.u_light_pos, light.pos)
        gl.uniform4fv(programInfo.uniloc.u_light_color, light.color)

        models.forEach((model) => {
            model.draw(gl, programInfo)
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
