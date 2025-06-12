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
    vec4 vertex_pos = model_view * vert;
    vec4 light_view_pos = u_view_matrix * u_light_pos;
    
    // TODO calculate this on the CPU
    mat4 normal_matrix = transpose(inverse(model_view));
    vec4 normal = normalize(normal_matrix * vec4(a_normal, 0.0)); // Use 0.0 for normals
    vec4 light_norm = normalize(light_view_pos - vertex_pos);
    
    // Ambient component
    float ambient = 0.2;
    
    // View direction (camera at origin in view space)
    vec4 view_norm = normalize(-vertex_pos);
    
    // Diffuse component
    float impact = max(dot(normal, light_norm), 0.0);
    vec4 diffuse = impact * u_light_color;
    
    float shininess = 8.0;
    
    // Classic Phong specular component
    vec4 reflect_dir = reflect(-light_norm, normal);
    float spec = pow(max(dot(view_norm, reflect_dir), 0.0), shininess);
    vec4 specular = spec * u_light_color;
    
    // Combine lighting components - specular is ADDED, not multiplied by material color
    vec4 res = (ambient + diffuse) * a_color + specular;
    
    gl_Position = u_proj_matrix * vertex_pos;
    v_color = vec4(res.rgb, a_color.a);
}
