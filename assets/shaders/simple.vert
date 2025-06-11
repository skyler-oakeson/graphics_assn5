#version 300 es

in vec3 a_vertex;
in vec3 a_normal;
in vec4 a_color;
uniform vec4 u_light_pos;
uniform vec4 u_light_color;
uniform mat4 u_proj_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_model_matrix;

out vec4 v_color;

void main() {
    vec4 vert = vec4(a_vertex, 1.0);
    mat4 model_view = u_view_matrix * u_model_matrix;

    // TODO calculate this on the CPU
    mat4 normal_matrix = transpose(inverse(model_view));
    vec4 norm = normalize(normal_matrix * vec4(a_normal, 1.0));

    vec4 vertex_pos = model_view * vert;

    vec4 light_norm = normalize(u_light_pos - vertex_pos);

    float impact = max(dot(norm, light_norm), 0.0);
    vec4 diffuse = impact * u_light_color;

    float ambient = 0.2;

    vec4 res = (ambient + diffuse) * a_color;

    gl_Position = u_proj_matrix * vertex_pos;
    v_color = vec4(res.rgb, a_color.a);
}
