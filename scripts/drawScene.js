const fieldOfView = (45 * Math.PI) / 180; // in radians
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const zNear = 0.1;
const zFar = 100.0;

function drawScene(gl, programInfo, buffers, updates) {
    gl.clearColor(
        0.3921568627450980392156862745098,
        0.58431372549019607843137254901961,
        0.92941176470588235294117647058824,
        1.0);
    gl.clearDepth(1.0);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    setVertexAttribute(gl, buffers, programInfo)
    setColorAttribute(gl, buffers, programInfo)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index.buffer);

    gl.useProgram(programInfo.program)

    gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 0);
}

function setVertexAttribute(gl, buffers, programInfo) {
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

function setColorAttribute(gl, buffers, programInfo) {
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

function setProjectionMatrix(gl, programInfo) {
    const projectionMatrix = transposeMatrix4x4(projectionMatrix(fov, aspect, zNear, zFar))
    gl.uniformMatrix4fc(
        programInfo.uniformLocations.u_proj_matrix,
        false,
        projectionMatrix
    )
}

