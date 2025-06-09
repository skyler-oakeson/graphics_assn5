//------------------------------------------------------------------
//
// Helper function used to load a file from the server
//
//------------------------------------------------------------------
async function loadFileFromServer(filename) {
    let result = await fetch(filename);
    return result.text();
}


//------------------------------------------------------------------
//
// Helper function used to load and parse a ply into a Model
//
//------------------------------------------------------------------
async function loadModelFromServer(gl, programInfo, filename) {
    const ply = await loadFileFromServer(filename)
    const parsed = parsePly(ply)

    const model = new Model(gl, programInfo, parsed.vertices, parsed.colors, parsed.indices)
    return model
}


//------------------------------------------------------------------
//
// Helper function to multiply two 4x4 matrices.
//
//------------------------------------------------------------------
function multiplyMatrix4x4(m1, m2) {
    let r = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0];

    // Iterative multiplication
    // for (let i = 0; i < 4; i++) {
    //     for (let j = 0; j < 4; j++) {
    //         for (let k = 0; k < 4; k++) {
    //             r[i * 4 + j] += m1[i * 4 + k] * m2[k * 4 + j];
    //         }
    //     }
    // }

    // "Optimized" manual multiplication
    r[0] = m1[0] * m2[0] + m1[1] * m2[4] + m1[2] * m2[8] + m1[3] * m2[12];
    r[1] = m1[0] * m2[1] + m1[1] * m2[5] + m1[2] * m2[9] + m1[3] * m2[13];
    r[2] = m1[0] * m2[2] + m1[1] * m2[6] + m1[2] * m2[10] + m1[3] * m2[14];
    r[3] = m1[0] * m2[3] + m1[1] * m2[7] + m1[2] * m2[11] + m1[3] * m2[15];

    r[4] = m1[4] * m2[0] + m1[5] * m2[4] + m1[6] * m2[8] + m1[7] * m2[12];
    r[5] = m1[4] * m2[1] + m1[5] * m2[5] + m1[6] * m2[9] + m1[7] * m2[13];
    r[6] = m1[4] * m2[2] + m1[5] * m2[6] + m1[6] * m2[10] + m1[7] * m2[14];
    r[7] = m1[4] * m2[3] + m1[5] * m2[7] + m1[6] * m2[11] + m1[7] * m2[15];

    r[8] = m1[8] * m2[0] + m1[9] * m2[4] + m1[10] * m2[8] + m1[11] * m2[12];
    r[9] = m1[8] * m2[1] + m1[9] * m2[5] + m1[10] * m2[9] + m1[11] * m2[13];
    r[10] = m1[8] * m2[2] + m1[9] * m2[6] + m1[10] * m2[10] + m1[11] * m2[14];
    r[11] = m1[8] * m2[3] + m1[9] * m2[7] + m1[10] * m2[11] + m1[11] * m2[15];

    r[12] = m1[12] * m2[0] + m1[13] * m2[4] + m1[14] * m2[8] + m1[15] * m2[12];
    r[13] = m1[12] * m2[1] + m1[13] * m2[5] + m1[14] * m2[9] + m1[15] * m2[13];
    r[14] = m1[12] * m2[2] + m1[13] * m2[6] + m1[14] * m2[10] + m1[15] * m2[14];
    r[15] = m1[12] * m2[3] + m1[13] * m2[7] + m1[14] * m2[11] + m1[15] * m2[15];

    return r;
}

//------------------------------------------------------------------
//
// Transpose a matrix.
// Reference: https://jsperf.com/transpose-2d-array
//
//------------------------------------------------------------------
function transposeMatrix4x4(m) {
    let t = [
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
    ];
    return t;
}


//------------------------------------------------------------------
//
// Create a scaling matrix ready to be sent to the GPU
//
//------------------------------------------------------------------
function scalingMatrix(sx, sy, sz) {
    let s = [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1,
    ]

    return transposeMatrix4x4(s)
}

//------------------------------------------------------------------
//
// Create a translation matrix ready to be sent to the GPU
//
//------------------------------------------------------------------
function translationMatrix(dx, dy, dz) {
    let t = [
        1, 0, 0, dx,
        0, 1, 0, dy,
        0, 0, 1, dz,
        0, 0, 0, 1,
    ]

    return transposeMatrix4x4(t)
}

const AXIS = Object.freeze({
    Z: "xy",
    X: "yz",
    Y: "xz",
})

const toDegrees = (rad) => {
    return rad * 180 / Math.PI
}

const toRadians = (deg) => {
    return deg * Math.PI / 180
}

//------------------------------------------------------------------
//
// Create a rotation matrix ready to be sent to the GPU
//
//------------------------------------------------------------------
const rotationMatrix = function() {
    // cache sin and cos

    var sin = []
    var cos = []

    for (let i = 0; i <= 360; i++) {
        sin.push(Math.sin(toRadians(i)))
        cos.push(Math.cos(toRadians(i)))
    }

    return function(yaw, pitch, roll) {

        // x, y, z = aplha, beta, gamma
        yaw = yaw % 360
        pitch = pitch % 360
        roll = roll % 360

        gamma = [
            cos[roll], -sin[roll], 0, 0,
            sin[roll], cos[roll], 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];

        beta = [
            1, 0, 0, 0,
            0, cos[pitch], -sin[pitch], 0,
            0, sin[pitch], cos[pitch], 0,
            0, 0, 0, 1,
        ];

        alpha = [
            cos[yaw], 0, sin[yaw], 0,
            0, 1, 0, 0,
            -sin[yaw], 0, cos[yaw], 0,
            0, 0, 0, 1
        ];

        return transposeMatrix4x4(multiply3Matrix4x4(gamma, beta, alpha))
    }
}()


//------------------------------------------------------------------
//
// Create an orthographic projection projection matrix 
//
//------------------------------------------------------------------
function orthographicProjection(width, height, aspect, near, far) {
    let left = -width * aspect;
    let right = width * aspect;
    let top = height * aspect;
    let bottom = -height * aspect;
    let op = [
        2 / (right - left), 0, 0, -(right + left) / (right - left),
        0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
        0, 0, -2 / (far - near), -(far + near) / (far - near),
        0, 0, 0, 1
    ];

    return transposeMatrix4x4(op);
}

function makeFrustrum(left, right, bottom, top, near, far) {

}

//------------------------------------------------------------------
//
// Create a perspective projection matrix by using the frustrum
//
//------------------------------------------------------------------
function perspectiveProjection(fov, aspect, near, far) {
    let top = near * Math.tan(toRadians(fov) / 2)
    let bottom = -top
    let right = top * aspect
    let left = -right

    const pp = [
        2 * near / (right - left), 0, 0, -near * (right + left) / (right - left),
        0, (2 * near) / (top - bottom), 0, -near * (top + bottom) / (top - bottom),
        0, 0, -(far + near) / (far - near), (2 * far * near) / (near - far),
        0, 0, -1, 0
    ];

    return transposeMatrix4x4(pp);
}

//------------------------------------------------------------------
//
// Helper function to create a single matrix capable of rotation, translation, and scaling
//
//------------------------------------------------------------------
function multiply3Matrix4x4(x, y, z) {
    return multiplyMatrix4x4(x, multiplyMatrix4x4(y, z))
}

function computeNormals(vertices, faces) {

}

const IDENTITY_MATRIX = transposeMatrix4x4(new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]))
