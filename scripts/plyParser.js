function parsePlyData(data) {
    const lines = data.split('\n');

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

    for (let x = 0; x < lines.length; x++) {
        const line = lines[x].trim();

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

        if (line.includes("end_header")) {
            continue;
        }

        if (line.match(/^([-|\d]+(\.\d+)?)\s+([-|\d]+(\.\d+)?)\s+([-|\d]+(\.\d+)?)/) && vertexCount !== expectedVertices) {
            vertexCount += 1;

            if ((property_red === 1) && (property_green === 1) && (property_blue === 1)) {
                const vertex = line.trim().split(/\s+/).slice(0, 6)
                vertices.push([parseFloat(vertex[0]), parseFloat(vertex[1]), parseFloat(vertex[2])]);
                colors.push([parseFloat(vertex[3]), parseFloat(vertex[4]), parseFloat(vertex[5])]);

            } else {
                const vertex = line.trim().split(/\s+/).slice(0, 3)
                vertices.push([parseFloat(vertex[0]), parseFloat(vertex[1]), parseFloat(vertex[2])]);
            }

        }

        if (line.match(/^[34]\s+\d+\s+\d+\s\d+/) && facesCount !== expectedFaces) {
            facesCount += 1;

            if (line[0].startsWith('3')) {
                const face = line.trim().split(/\s+/).slice(1, 4)
                faces.push([parseInt(face[0]), parseInt(face[1]), parseInt(face[2])]);
            } else if (line[0].startsWith('4')) {
                const face = line.trim().split(/\s+/).slice(1, 5)
                faces.push([parseInt(face[0]), parseInt(face[1]), parseInt(face[2]), parseInt(face[3])]);
            }
        }
    }

    if (vertices.length !== expectedVertices) {
        console.log(`Error: total vertices read: ${vertices.length} does not match expected vertices: ${expectedVertices}`);
        throw new Error(`Error: total vertices read: ${vertices.length} does not match expected vertices: ${expectedVertices}`);
    }

    if (faces.length !== expectedFaces) {
        console.log(`Error: total faces read: ${faces.length} does not match expected faces: ${expectedFaces}`);
        throw new Error(`Error: total faces read: ${faces.length} does not match expected faces: ${expectedFaces}`);
    }

    let data = {}
    data.vertices = vertices
    data.faces = faces
    data.colors = colors

    return data;
}

let test = async function() {
    let file = await loadFileFromServer('assets/models/bun_zipper.ply')
    console.log(parsePlyData(file))
}()
