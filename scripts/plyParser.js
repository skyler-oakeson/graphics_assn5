const KEYWORDS = {
    format: format,
    element: element,
    property: property,
    end_header: end_header,
    comment: comment,
}

const TYPE_ALIAS = {
    char: "UINT8",
    uchar: "UINT8",
    short: "INT8",
    ushort: "UINT8",
    int: "INT32",
    uint: "UINT32",
    float: "FLOAT32",
    double: "FLOAT64",
    list: "LIST",
}

const CONVERSION = {
    "UINT8": parseInt,
    "INT8": parseInt,
    "UINT8": parseInt,
    "INT32": parseInt,
    "UINT32": parseInt,
    "FLOAT32": parseFloat,
    "FLOAT64": parseFloat,
}


function tokenize(file) {
    const tokens = file.split(/[\n, ' ']/).filter(Boolean)
    console.log(tokens)
    return tokens;
}

let pointer = 0;
let elements = []
let currElem = -1
let propertyIndex = 0
let fileformat = ""
let data = {}

function parsePly(file) {
    let tokens = tokenize(file)

    if (consume(tokens) != "ply") {
        console.error("Missing keyword ply.")
    }

    while (pointer < tokens.length) {
        let tok = consume(tokens)
        if (KEYWORDS[tok]) {
            KEYWORDS[tok](tokens)
        }
    }

    return data
}

function parseElements(tokens) {
    for (let e = 0; e < element.length; e++) {
        let element = elements[e]

        // Initialize data object
        for (let p = 0; p < element.properties.length; p++) {
            let prop = element.properties[p]
            data[prop.name] = []
        }

        // Fill all properties on data object
        for (let i = 0; i < element.properties.length * element.count; i++) {
            let propIndex = i % element.properties.length
            let prop = element.properties[propIndex];
            let name = prop.name;
            let type = prop.type;

            if (type == "LIST") {
                let count = CONVERSION[prop.countType](consume(tokens))
                let face = []
                for (let l = 0; l < count; l++) {
                    let tok = consume(tokens)
                    let vert = CONVERSION[prop.valueType](tok)
                    list.push(vert)
                }
                data[name].push(face)
            } else {
                data[name].push(CONVERSION[type](consume(tokens)))
            }
        }
    }
}

function element(tokens) {
    let name = consume(tokens)
    let count = parseInt(consume(tokens))
    currElem++
    propertyIndex = 0
    elements.push({ name: name, count: count, properties: [] })
}

function consume(tokens) {
    let prev = pointer
    pointer++
    return tokens[prev]
}

function next(tokens) {
    let next = pointer + 1
    return tokens[next]
}

function property(tokens) {
    let tok = consume(tokens)
    switch (tok) {
        case "char":
        case "uchar":
        case "short":
        case "ushort":
        case "int":
        case "uint":
        case "float":
        case "double":
            let type = TYPE_ALIAS[tok]
            let name = consume(tokens)
            elements[currElem]["properties"][propertyIndex] = { type: type, name: name }
            propertyIndex++
            break;
        case "list":
            let countType = TYPE_ALIAS[consume(tokens)]
            let valueType = TYPE_ALIAS[consume(tokens)]
            let listName = consume(tokens)
            elements[currElem]["properties"][propertyIndex] = { type: "LIST", name: listName, countType: countType, valueType: valueType }
            break;
        default:
            console.error("Invalid property type")
            break;
    }
}

function format(tokens) {
    let tok = consume(tokens)
    switch (tok) {
        case "ascii":
            consume(tokens)
            break;
        case "binary_big_endian":
        case "binary_little_endian":
            console.error("Binary not supported.")
            break;
    }
}

function end_header(tokens) {
    parseElements(tokens)
}

function comment(tokens) {
    while (!KEYWORDS[next(tokens)]) {
        consume(tokens)
    }
}

let test = async function() {
    let file = await loadFileFromServer('assets/models/bun_zipper.ply')
    console.log(parsePly(file))
}()


