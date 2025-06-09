#version 300 es
in vec4 a_vertex;
in vec4 a_color;
uniform mat4 u_proj_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_model_matrix;
out vec4 v_color;
void main() {
    gl_Position = u_proj_matrix * u_model_matrix * u_view_matrix * a_vertex;
    v_color = vec4(a_color.r, a_color.g, a_color.b, a_color.a);
}
