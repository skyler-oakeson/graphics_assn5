//------------------------------------------------------------------
//
// Cube geometry
//
//------------------------------------------------------------------
const CUBE_VERTICES = new Float32Array([
    -1.000000, -1.000000, 1.000000,
    -1.000000, 1.000000, 1.000000,
    -1.000000, 1.000000, -1.000000,
    1.000000, 1.000000, 1.000000,
    1.000000, 1.000000, -1.000000,
    1.000000, -1.000000, 1.000000,
    1.000000, -1.000000, -1.000000,
    -1.000000, -1.000000, -1.000000
]);

const CUBE_COLORS = new Float32Array([
    0.1, 0.8, 0.8, 1.0,
    0.2, 0.2, 0.8, 1.0,
    0.3, 0.3, 0.3, 1.0,
    0.4, 0.4, 0.4, 1.0,
    0.2, 0.5, 0.5, 1.0,
    0.6, 0.8, 0.1, 1.0,
    0.3, 0.2, 0.7, 1.0,
    0.8, 0.8, 0.2, 1.0,
]);


const CUBE_INDICES = new Uint16Array([
    0, 1, 2,
    1, 3, 4,
    3, 5, 6,
    0, 7, 5,
    7, 2, 4,
    5, 3, 1,
    7, 0, 2,
    2, 1, 4,
    4, 3, 6,
    5, 7, 6,
    6, 7, 4,
    0, 5, 1,
]);


//------------------------------------------------------------------
//
// Table geometry
//
//------------------------------------------------------------------
const TABLE_VERTICES = new Float32Array([
    -10.0, 0.0, -10.0, 1.0,
    -10.0, 0.0, 10.0, 1.0,
    10.0, 0.0, 10.0, 1.0,
    10.0, 0.0, -10.0, 1.0,
])

const TABLE_COLORS = new Float32Array([
    0.2, 0.2, 0.2, 1.0,
    0.2, 0.2, 0.2, 1.0,
    0.2, 0.2, 0.2, 1.0,
    0.2, 0.2, 0.2, 1.0
])

const TABLE_INDICES = new Uint16Array([
    0, 1, 2,
    0, 2, 3 // top
])


const TRIANGLE_VERTICES = new Float32Array([
    -0.5, -0.5, -1.0, 1.0,  // bottom left
    0.5, -0.5, -1.0, 1.0,  // bottom right  
    0.0, 0.5, -1.0, 1.0   // top
])

const TRIANGLE_COLORS = new Float32Array([
    1.0, 0.0, 0.0, 1.0,  // red
    0.0, 1.0, 0.0, 1.0,  // green
    0.0, 0.0, 1.0, 1.0   // blue
]);

const TRIANGLE_INDICES = new Uint16Array([
    0, 1, 2
])


//------------------------------------------------------------------
//
// Tetrahedron geometry
//
//------------------------------------------------------------------
const TETRAHEDRON_VERTICES = new Float32Array([
    // Face 1: Bottom face (red)
    -1.0, -1.0, 1.0, 1.0,
    0.0, -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0, 1.0,

    // Face 2: Front face (green)
    0.0, 1.0, 0.0, 1.0,
    -1.0, -1.0, 1.0, 1.0,
    1.0, -1.0, 1.0, 1.0,

    // Face 3: Left face (blue)
    0.0, 1.0, 0.0, 1.0,
    0.0, -1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0, 1.0,

    // Face 4: Right face (yellow)
    0.0, 1.0, 0.0, 1.0,
    1.0, -1.0, 1.0, 1.0,
    0.0, -1.0, -1.0, 1.0,  // Back base
]);

const TETRAHEDRON_COLORS = new Float32Array([
    // Face 1: Right face - red
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,

    // Face 2: Front face - green
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,

    // Face 3: Left face - blue
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,

    // Face 4: Bottom face - yellow
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
]);

const TETRAHEDRON_INDICES = new Uint16Array([
    // Face 1: Bottom face
    0, 1, 2,
    // Face 2: Front face  
    3, 4, 5,
    // Face 3: Left face
    6, 7, 8,
    // Face 4: Right face
    9, 10, 11,
]);

//------------------------------------------------------------------
//
// Octahedron geometry
//
//------------------------------------------------------------------


const OCTAHEDRON_VERTICES = new Float32Array([
    // Face 1: top-right-front (red)
    0.0, 1.0, 0.0, 1.0,   // top
    1.0, 0.0, 0.0, 1.0,   // right
    0.0, 0.0, 1.0, 1.0,   // front

    // Face 2: top-front-left (green)
    0.0, 1.0, 0.0, 1.0,   // top
    0.0, 0.0, 1.0, 1.0,   // front
    -1.0, 0.0, 0.0, 1.0,  // left

    // Face 3: top-left-back (blue)
    0.0, 1.0, 0.0, 1.0,   // top
    -1.0, 0.0, 0.0, 1.0,  // left
    0.0, 0.0, -1.0, 1.0,  // back

    // Face 4: top-back-right (yellow)
    0.0, 1.0, 0.0, 1.0,   // top
    0.0, 0.0, -1.0, 1.0,  // back
    1.0, 0.0, 0.0, 1.0,   // right

    // Face 5: bottom-front-right (cyan)
    0.0, -1.0, 0.0, 1.0,  // bottom
    0.0, 0.0, 1.0, 1.0,   // front
    1.0, 0.0, 0.0, 1.0,   // right

    // Face 6: bottom-left-front (magenta)
    0.0, -1.0, 0.0, 1.0,  // bottom
    -1.0, 0.0, 0.0, 1.0,  // left
    0.0, 0.0, 1.0, 1.0,   // front

    // Face 7: bottom-back-left (orange)
    0.0, -1.0, 0.0, 1.0,  // bottom
    0.0, 0.0, -1.0, 1.0,  // back
    -1.0, 0.0, 0.0, 1.0,  // left

    // Face 8: bottom-right-back (purple)
    0.0, -1.0, 0.0, 1.0,  // bottom
    1.0, 0.0, 0.0, 1.0,   // right
    0.0, 0.0, -1.0, 1.0,  // back
]);

// Each set of 3 vertices gets the same color for solid faces
const OCTAHEDRON_COLORS = new Float32Array([
    // Face 1: red
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,

    // Face 2: green
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,

    // Face 3: blue
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,

    // Face 4: yellow
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,

    // Face 5: cyan
    0.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,

    // Face 6: magenta
    1.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,

    // Face 7: orange
    1.0, 0.5, 0.0, 1.0,
    1.0, 0.5, 0.0, 1.0,
    1.0, 0.5, 0.0, 1.0,

    // Face 8: purple
    0.5, 0.0, 1.0, 1.0,
    0.5, 0.0, 1.0, 1.0,
    0.5, 0.0, 1.0, 1.0,
]);

// Simple sequential indices since each face has its own vertices
const OCTAHEDRON_INDICES = new Uint16Array([
    // Face 1
    0, 1, 2,
    // Face 2  
    3, 4, 5,
    // Face 3
    6, 7, 8,
    // Face 4
    9, 10, 11,
    // Face 5
    12, 13, 14,
    // Face 6
    15, 16, 17,
    // Face 7
    18, 19, 20,
    // Face 8
    21, 22, 23,
]);
