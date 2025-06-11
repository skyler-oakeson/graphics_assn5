#version 300 es
precision lowp float;
in vec4 v_color;
in vec4 v_frag_pos;
in vec4 v_normal;

out vec4 out_color;


void main() {
    vec4 light_pos = vec4(.8, 0, .2, 1);
    vec4 light_dir = normalize(light_pos - v_frag_pos);

    float diff = max(dot(v_normal, light_dir), 0.0);
    vec4 diffuse = diff * vec4(1.0, 1.0, 1.0, 1.0);

    vec4 res = (.2 + diffuse) * v_color;

    out_color = vec4(res.rgb, v_color.a);
}

