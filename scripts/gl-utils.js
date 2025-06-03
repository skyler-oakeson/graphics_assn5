function createShader(gl, type, source) {
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

function createStaticVertexBuffer(gl, data) {
    const buffer = gl.createBuffer();
    if (!buffer) {
        console.error("Failed to allocate static vertex buffer.")
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    return buffer
}

function createStaticIndexBuffer(gl, data) {
    const buffer = gl.createBuffer();
    if (!buffer) {
        console.error("Failed to allocate static index buffer.")
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    return buffer
}

function create3dPosColorVao(
    gl,
    programInfo,
    buffers,
) {
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(programInfo.attribloc.a_vertex);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
    gl.vertexAttribPointer(programInfo.attribloc.a_vertex, 4, gl.FLOAT, false, 0, 0)

    gl.enableVertexAttribArray(programInfo.attribloc.a_color);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
    gl.vertexAttribPointer(programInfo.attribloc.a_color, 4, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index)
    gl.bindVertexArray(null)

    return vao
}


function createProgram(gl, vertexShaderSrc, fragShaderSrc) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    let a_vertex = gl.getAttribLocation(program, 'a_vertex')
    if (a_vertex < 0) {
        console.error("Unable to find a_vertex location.")
    }

    let a_color = gl.getAttribLocation(program, 'a_color')
    if (a_color < 0) {
        console.error("Unable to find a_color location.")
    }

    let u_proj_view_matrix = gl.getUniformLocation(program, 'u_proj_view_matrix')
    if (!u_proj_view_matrix) {
        console.error("Unable to find u_proj_view_matrix location.")
    }

    let u_world_matrix = gl.getUniformLocation(program, 'u_world_matrix')
    if (!u_world_matrix) {
        console.error("Unable to find u_world_matrix location.")
    }

    return {
        program: program,
        attribloc: {
            a_vertex: a_vertex,
            a_color: a_color
        },
        uniloc: {
            u_proj_view_matrix: u_proj_view_matrix,
            u_world_matrix: u_world_matrix,
        }
    };
}
