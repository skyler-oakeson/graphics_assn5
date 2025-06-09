#version 300 es
in vec3 a_vertex;
in vec4 a_color;
uniform mat4 u_proj_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_model_matrix;
out vec4 v_color;
void main() {
    vec4 vert = vec4(a_vertex, 1.0);
    gl_Position = u_proj_matrix * u_view_matrix * u_model_matrix * vert;
    v_color = a_color;
}
