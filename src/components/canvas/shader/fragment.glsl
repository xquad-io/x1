precision mediump float;

uniform sampler2D uTexture;

void main(){
  vec4 img = texture2D(uTexture, gl_PointCoord);

  gl_FragColor = vec4(img.xyz,0.6);
}