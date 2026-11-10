precision highp float;

uniform float uAlpha;
uniform float uMultiplier;

uniform sampler2D tMap;

varying float vDisplacement;
varying vec2 vUv;

vec3 saturation(vec3 rgb,float adjustment){
  const vec3 W=vec3(.2125,.7154,.0721);
  vec3 intensity=vec3(dot(rgb,W));
  return mix(intensity,rgb,adjustment);
}

void main(){
  vec3 color=texture2D(tMap,vUv).rgb;
  float value=1.;

  if(vDisplacement>0.){
    color+=vDisplacement*mix(.2,.7,uMultiplier);
    value=1.+vDisplacement*2.;
  }

  color=saturation(color,value);

  gl_FragColor.rgb=color;
  gl_FragColor.a=uAlpha;
}
