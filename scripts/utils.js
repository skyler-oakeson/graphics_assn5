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

const Plane = Object.freeze({
    XY: "xy",
    YZ: "yz",
    XZ: "xz",
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

    return function(theta, plane) {
        let degrees = Math.trunc(toDegrees(theta))
        let res = [];

        switch (plane) {
            case Plane.XY:
                res = [
                    cos[degrees], -sin[degrees], 0, 0,
                    sin[degrees], cos[degrees], 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1,
                ];
                break;
            case Plane.YZ:
                res = [
                    1, 0, 0, 0,
                    0, cos[degrees], -sin[degrees], 0,
                    0, sin[degrees], cos[degrees], 0,
                    0, 0, 0, 1,
                ];
                break;
            case Plane.XZ:
                res = [
                    cos[degrees], 0, sin[degrees], 0,
                    0, 1, 0, 0,
                    -sin[degrees], 0, cos[degrees], 0,
                    0, 0, 0, 1
                ];
                break;
            default:
                let p0 = plane.p0
                let p1 = plane.p1
                // TODO implement a way to do arbitrary rotation
                res = [
                    cos[degrees], 0, sin[degrees], 0,
                    0, 1, 0, 0,
                    -sin[degrees], 0, cos[degrees], 0,
                    0, 0, 0, 1
                ];
                break;
        }
        return transposeMatrix4x4(new Float32Array(res))
    }
}()


//------------------------------------------------------------------
//
// Create an orthographic projection projection matrix 
//
//------------------------------------------------------------------
function orthographicProjection(aspect, near, far, size = 3) {
    const left = -size * aspect;
    const right = size * aspect;
    const bottom = -size;
    const top = size;

    let op = [
        2 / (right - left), 0, 0, -(right + left) / (right - left),
        0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
        0, 0, -2 / (far - near), -(far + near) / (far - near),
        0, 0, 0, 1
    ];

    return transposeMatrix4x4(op);
}

function makeFrustrum(left, right, bottom, top, near, far) {
    const f = [
        2 * near / (right - left), 0, 0, -near * (right + left) / (right - left),
        0, (2 * near) / (top - bottom), 0, -near * (top + bottom) / (top - bottom),
        0, 0, -(far + near) / (far - near), (2 * far * near) / (near - far),
        0, 0, -1, 0
    ];

    return transposeMatrix4x4(f);
}

//------------------------------------------------------------------
//
// Create a perspective projection matrix by using the frustrum
//
//------------------------------------------------------------------
function perspectiveProjection(fovy, aspect, near, far) {
    let top = near * Math.tan(toRadians(fovy) / 2)
    let bottom = -top
    let right = top * aspect
    let left = -right

    return makeFrustrum(left, right, bottom, top, near, far)
}

//------------------------------------------------------------------
//
// Helper function to create a single matrix capable of rotation, translation, and scaling
//
//------------------------------------------------------------------
function worldMatrix(rotation, translation, scale) {
    return multiplyMatrix4x4(rotation, multiplyMatrix4x4(translation, scale))
}

const IDENTITY_MATRIX = transposeMatrix4x4(new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]))
