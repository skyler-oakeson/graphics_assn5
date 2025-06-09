function parsePly(ply) {
    const lines = ply.split('\n');

    let expectedFaces = null;
    let expectedVertices = null;

    const vertices = [];
    const faces = [];
    const colors = [];

    let vertexCount = 0;
    let facesCount = 0;

    let property_red = 0
    let property_blue = 0
    let property_green = 0

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

        if (line.includes("property uchar red")) {
            property_red = 1
            continue
        }

        if (line.includes("property uchar green")) {
            property_green = 1
            continue
        }

        if (line.includes("property uchar blue")) {
            property_blue = 1
            continue
        }

        if (line.includes("element face")) {
            expectedFaces = parseInt(line.match(/^element\s+face\s+(\d+)/)[1]);
        }
    }

    //parse vertex
    for (let i = endHeader + 1; i <= endHeader + expectedVertices; i++) {
        const line = lines[i].trim();

        if ((property_red === 1) && (property_green === 1) && (property_blue === 1)) {
            const vertex = line.trim().split(/\s+/).slice(0, 6)
            vertices.push(parseFloat(vertex[0]), parseFloat(vertex[1]), parseFloat(vertex[2]));
            colors.push(parseFloat(vertex[3]), parseFloat(vertex[4]), parseFloat(vertex[5]));

        } else {
            const vertex = line.trim().split(/\s+/).slice(0, 3)
            vertices.push(parseFloat(vertex[0]), parseFloat(vertex[1]), parseFloat(vertex[2]));
        }
    }

    // parse faces
    for (let i = endHeader + expectedVertices + 1; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('3')) {
            const face = line.trim().split(/\s+/).slice(1, 4)
            faces.push(parseInt(face[0]), parseInt(face[1]), parseInt(face[2]));
        } else if (line.startsWith('4')) {
            const face = line.trim().split(/\s+/).slice(1, 5)
            faces.push(parseInt(face[0]), parseInt(face[1]), parseInt(face[2]), parseInt(face[3]));
        }
    }

    let data = {}
    convertToUnitSpace(vertices)
    data.vertices = new Float32Array(vertices)
    data.faces = new Uint16Array(faces)
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
    console.log(max)
}

let test = async function() {
    let file = await loadFileFromServer('assets/models/bun_zipper.ply')
    console.log(parsePly(file))
}()
