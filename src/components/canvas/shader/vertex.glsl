
precision mediump float;

#define AMP 0.2
#define FREQ 10.0
#define PI 3.14159265359

// uniform float time;
// uniform vec2 mouse;

// attribute float aRandom;

// float mapRange (float inputMin, float inputMax, float outputMin, float outputMax, float value) {
//   float inputRange = inputMax - inputMin;
//   float outputRange = outputMax - outputMin;

//   float normalizeValue = (value - inputMin) / inputRange;

//   return normalizeValue * outputRange + outputMin;
// }

void main(){
  vec3 newPosition = position;

  // float inputMin = uCount / 2.0 - uArea;
  // float inputMax = uCount / 2.0 + uArea;
  // float longitude = mapRange(inputMin, inputMax, -PI * 2.0, PI * 2.0, newPosition.x);
  // float latitude = mapRange(inputMin, inputMax, -PI, PI, newPosition.y);
  // float random = aRandom * inputMax * uProgress;

  // if (random > inputMin && random < inputMax) {
  //   newPosition.x = uRadius * cos(longitude) * sin(latitude);
  //   newPosition.y = uRadius * sin(longitude) * sin(latitude);
  //   newPosition.z = uRadius * cos(latitude) + uRadius + 15.0;
  // }


  // float dist = distance(uv, mouse);
  // float decay = clamp(dist * 5.0, 1.0, 10.0);

  // float ripple = sin(-PI * FREQ * dist + time) * (AMP/ decay);
  // newPosition.z = ripple;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
  gl_PointSize = 100.0 * (1.0 / - viewPosition.z);

}