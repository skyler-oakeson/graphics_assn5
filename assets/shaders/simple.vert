#version 300 es
in vec4 a_vertex;
in vec4 a_color;
out vec4 v_color;
void main() {
    gl_Position = a_vertex;
    v_color = a_color;
}
