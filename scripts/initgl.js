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

function createBuffer(gl, type, data, usage) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer)
    gl.bufferData(type, data, usage)
    return buffer
}

function initBuffers(gl, vertices, colors, indices) {
    const vertexBuffer = createBuffer(gl, gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    const colorBuffer = createBuffer(gl, gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
    const indexBuffer = createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return {
        vertex: {
            data: vertices,
            buffer: vertexBuffer,
        },
        color: {
            data: colors,
            buffer: colorBuffer
        },
        index: {
            data: indices,
            buffer: indexBuffer
        }
    }
}

async function initProgram(gl) {
    try {
        const vertexShaderSrc = await loadFileFromServer("/assets/shaders/simple.vert");
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);

        const fragmentShaderSrc = await loadFileFromServer("/assets/shaders/simple.frag")
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        return {
            program: program,
            attribLocations: {
                a_vertex: gl.getAttribLocation(program, 'a_vertex'),
                a_color: gl.getAttribLocation(program, 'a_color'),
            }
        };

    } catch (error) {
        console.error(`${error.name}: ${error.message}`)
        return null

    }
}
