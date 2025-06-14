const VERTEX_OFFSET = 3
const FACE_OFFSET = 3


//------------------------------------------------------------------
//
// Parses a ply file
//
//------------------------------------------------------------------
function parsePly(ply) {
    const lines = ply.split('\n');

    let expectedFaces = null;
    let expectedVertices = null;

    let vertices = [];
    const indices = [];
    const colors = [];

    let endHeader = 0;

    // parse header
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.includes("end_header")) {
            endHeader = i
            break;
        }

        if (!line || line === '') {
            continue;
        }

        if (line.startsWith("format")) {
            const fileFormat = line.trim().split(' ')[1];
            if (fileFormat.toLowerCase() !== "ascii") {
                console.error(`File format is not ascii. ${fileFormat} format not supported.`);
            }
        }

        if (line.startsWith("comment")) {
            continue;
        }

        if (line.includes("element vertex")) {
            expectedVertices = parseInt(line.match(/^element\s+vertex\s+(\d+)/)[1]);
            continue
        }

        if (line.includes("element face")) {
            expectedFaces = parseInt(line.match(/^element\s+face\s+(\d+)/)[1]);
        }
    }

    //parse vertex
    for (let i = endHeader + 1; i <= endHeader + expectedVertices; i++) {
        const line = lines[i].trim();
        const vertex = line.trim().split(/\s+/).slice(0, 3)
        const x = parseFloat(vertex[0])
        const y = parseFloat(vertex[1])
        const z = parseFloat(vertex[2])
        vertices.push(x, y, z);

        // assign random colors
        colors.push(1.0, 1.0, 1.0, 1.0);
    }

    // parse faces
    for (let i = endHeader + expectedVertices + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('3')) {
            const face = line.trim().split(/\s+/).slice(1, 4)
            indices.push(parseInt(face[0]), parseInt(face[1]), parseInt(face[2]));
        } else if (line.startsWith('4')) {
            const face = line.trim().split(/\s+/).slice(1, 5);
            const v0 = parseInt(face[0]);
            const v1 = parseInt(face[1]);
            const v2 = parseInt(face[2]);
            const v3 = parseInt(face[3]);
            indices.push(v0, v1, v2);
            indices.push(v0, v2, v3);
        }
    }

    let data = {}
    data.vertices = new Float32Array(convertToUnitSpace(vertices))
    data.indices = new Uint32Array(indices)
    data.colors = new Float32Array(colors)

    return data;
}

function convertToUnitSpace(vertices) {
    let max = 0;
    for (let i = 0; i < vertices.length; i++) {
        let cord = Math.abs(vertices[i])
        if (cord > max) {
            max = cord
        }
    }

    let scale = 1.0 / max;
    for (let i = 0; i < vertices.length; i++) {
        vertices[i] *= scale
    }

    return vertices
}

