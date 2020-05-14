precision mediump float;
uniform float time;
varying vec2 uv;
const float EPSILON = 0.001;
const int steps = 40;
const float smallNumber = 0.000000325;
const float maxDist = 200.; 
const vec3 sky = vec3(0.);

mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);

    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);

    return mat3(
        vec3(c, -s, 0),
        vec3(s, c, 0),
        vec3(0, 0, 1)
    );
}

vec4 scene(vec3 pos){
   vec3 position = rotateY(sin(time / 10.)) * rotateZ(sin(time / 10.) * 0.15) * pos;
    float sphere = length(position + vec3(0., sin(time  * 0.2) * 0.1, sin(time  * 0.2) + 1.)) - .0625;
    float ground;
    if (sin(time* 0.5) > 0.) {
      ground = position.y *position.y * -.5
        + sin(position.x + sin(position.z) * 3. + position.x) / 2.
        + cos(position.z - time) / 10. + 1.;
        
    } else {
      ground =  -.5 * position.y * position.y+ 2.
        + sin(position.x)
        + cos(position.z - time);
    }

    if (sphere > ground) {
      if (position.y > 0.) {
        return vec4(ground, vec3(1.));
      } else {
        if (position.y < -10.05) return vec4(.1, 0., .5, .8);
        return vec4(ground, vec3(1., 0.8, 0.4));
      }
        
    } else {
        return vec4(sphere, .6, 0.2, 0.1);
    }
}
 

vec3 estimateNormal(vec3 p) {
  float x = scene(vec3(p.x + EPSILON, p.y, p.z)).x - scene(vec3(p.x - EPSILON, p.y, p.z)).x;
  float y = scene(vec3(p.x, p.y + EPSILON, p.z)).x - scene(vec3(p.x, p.y - EPSILON, p.z)).x;
  float z = scene(vec3(p.x, p.y, p.z + EPSILON)).x - scene(vec3(p.x, p.y, p.z - EPSILON)).x;
  return normalize(vec3(x,y,z));
}
vec4 trace (vec3 origin, vec3 direction){    
    float dist = 0.;
    float totalDistance = 0.;
    vec3 positionOnRay = origin;
    vec4 scn;
    for(int i = 0 ; i < steps; i++){
        scn = scene(positionOnRay);
        dist = scn.x;
        positionOnRay += dist * direction;        
        totalDistance += dist;
        
        if (dist < smallNumber) {
          
          return vec4((1. - (totalDistance / maxDist)) * scn.gba, .5 - estimateNormal(positionOnRay) + 0.5);
        }
        
        if (totalDistance > maxDist){
            return vec4(vec3(sin(time)) * sky, 1.); // Background color.
        }
    }    
    return vec4(vec3(sin(time)) * sky, 1.);// Background color.
}

void main() {
    
    vec2 pos = uv;

    vec3 camOrigin = vec3(0,0, -1.);
	vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.);
	vec3 dir = camOrigin + rayOrigin;

    vec4 color = vec4(trace(rayOrigin,dir));
    
    gl_FragColor = color;
       
}