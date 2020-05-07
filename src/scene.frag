precision mediump float;
uniform float time;

const int steps = 40; // This is the maximum amount a ray can march.
const float smallNumber = 0.5;
const float maxDist = 40.; // This is the maximum distance a ray can travel.
varying vec2 uv;

float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
}

vec4 scene(vec3 position){
   vec3 p = vec3(
            position.x + cos(time * position.z * 0.025), 
            position.y, 
            position.z + 2.);
    float sphere = sdOctahedron( p + vec3(sin(p.x *.5), sin(p.y * .5), sin(p.z *.5))
        , .9 );
    float ground = position.y * position.y * -1.
                   + sin(position.x + sin(position.z) * 3. + position.x + time * .6) / 2.
                   + cos(position.z * 10.) / 10. + 1.;
    if (sphere > ground) {
      if (position.y > 0.) {
        return vec4(ground, vec3(1.));
      } else {
        return vec4(ground, vec3(1., 0.8, 0.4));
      }
        
    } else {
        return vec4(sphere, .6, 0.4, 0.);
    }
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
        
        if (dist < smallNumber){
            return vec4((1. - (totalDistance / maxDist)) * scn.gba, 1.);
        }
        
        if (totalDistance > maxDist){
            return vec4(vec3(origin.y), 1.); // Background color.
        }
    }    
    return vec4(0.4, 0.0, 0.4, 1.);// Background color.
}

void main() {
    
    vec2 pos = uv;

    vec3 camOrigin = vec3(0,0, -1.);
	vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.);
	vec3 dir = camOrigin + rayOrigin;

    vec4 color = vec4(trace(rayOrigin,dir));
    
    gl_FragColor = color;
       
}