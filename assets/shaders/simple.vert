#version 300 es

in vec3 a_vertex;
in vec3 a_normal;
in vec4 a_color;

uniform mat4 u_proj_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_model_matrix;
uniform mat4 u_normal_matrix;

out vec4 v_color;
out vec4 v_normal;
out vec4 v_frag_pos;

void main() {
    vec4 vert = vec4(a_vertex, 1.0);
    vec4 norm = vec4(a_normal, 1.0);
    mat4 model_view = u_view_matrix * u_model_matrix;

    // TODO calculate this on the CPU
    mat4 normal_matrix = transpose(inverse(model_view));

    vec4 frag_pos = model_view * vert;

    gl_Position = u_proj_matrix * frag_pos;
    v_color = a_color;
    v_normal = normalize(normal_matrix * norm);
    v_frag_pos = frag_pos;
    
}
