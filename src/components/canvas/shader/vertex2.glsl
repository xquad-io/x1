 #define AMP 0.2
#define FREQ 10.0
#define PI 3.14159265359

uniform vec2 mouse;

varying vec2 vUv;

void main() {
  vec2 vUv = uv;
  vec3 pos = position;
  vec2 mous = mouse;

  float distX = distance(pos.x, mous.x);
  float xDir = pos.x - mous.x;
  xDir = xDir / distX;

  float distY = distance(pos.y, mous.y);
  float yDir = pos.y - mous.y;
  yDir = yDir / distY;


  float maxDisX = max(1.35 - distX , 0.0);
  float maxDisY = max(1.35 - distY , 0.0);

  float ratio = max(0.35 - distY * distX , 0.0);

  float poasX = maxDisX * sin(xDir * distX) ;
  float poasY = maxDisY * sin(yDir * distY) ;

  pos.x += atan(poasX * ratio) * 1.5;
  pos.y += atan(poasY * ratio) * 1.5;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
  gl_PointSize = 20.0 * (1.2 / - viewPosition.z);
}