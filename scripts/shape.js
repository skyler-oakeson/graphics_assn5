class Shape {
    constructor(gl, programInfo, vertices, colors, indices) {
        this.numIndices = indices.length
        this.updated = {
            status: false,
            trigger: function() { this.status = true },
            reset: function() { this.status = false }
        }
        this.scaling = IDENTITY_MATRIX
        this.translation = IDENTITY_MATRIX
        this.rotation = IDENTITY_MATRIX
        this.worldMatrix = multiply3Matrix4x4(this.rotation, this.translation, this.scaling)
        this.buffers = {
            vertex: createStaticVertexBuffer(gl, vertices),
            colors: createStaticVertexBuffer(gl, colors),
            index: createStaticIndexBuffer(gl, indices)
        }
        this.vao = create3dPosColorVao(gl, programInfo, this.buffers)
    }

    translate(x, y, z) {
        this.updated.trigger()
        this.translation = multiplyMatrix4x4(this.translation, translationMatrix(x, y, z));
    }

    scale(x, y, z) {
        this.updated.trigger()
        this.translation = multiplyMatrix4x4(this.scaling, scalingMatrix(x, y, z));
    }

    rotate(yaw, pitch, roll) {
        this.updated.trigger()
        this.rotation = multiplyMatrix4x4(this.rotation, rotationMatrix(yaw, pitch, roll))
    }

    update() {
        // only recomputes the world matrix if an update happens
        if (this.updated.status) {
            this.updated.reset()
            this.worldMatrix = multiply3Matrix4x4(this.rotation, this.translation, this.scaling)
        }
    }

    draw(gl, programInfo) {
        gl.bindVertexArray(this.vao);
        gl.uniformMatrix4fv(programInfo.uniloc.u_world_matrix, false, this.worldMatrix)
        gl.disable(gl.CULL_FACE)
        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
        gl.enable(gl.CULL_FACE)
        gl.bindVertexArray(null);
    }
}
