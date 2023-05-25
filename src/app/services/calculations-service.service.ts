import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculationsServiceService {
  constructor() {}

  getAngleToCenterInRadians(x: number, y: number, circleOriginX: number, circleOriginY: number) {
    let angle = Math.atan2(y - circleOriginY, x - circleOriginX);
    return angle;
  }

  getAngleToCenterInDegrees(x: number, y: number, circleOriginX: number, circleOriginY: number) {
    let angle = Math.atan2(y - circleOriginY, x - circleOriginX);
    let angleInDegrees = 0;
    if (Math.sign(angle) == -1) {
      angleInDegrees = Math.round((-angle * 180) / Math.PI);
    } else {
      angleInDegrees = Math.round(360 - (angle * 180) / Math.PI);
    }
    return angleInDegrees;
  }

  getDistanceBetweenTwoPoints(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  isInTheCircle(x: number, y: number, radius: number, circleOriginX: number, circleOriginY: number) {
    var currRadius = Math.sqrt(Math.pow(x - circleOriginX, 2) + Math.pow(y - circleOriginY, 2));
    if (radius >= currRadius) return true;
    else return false;
  }

  getPointOnCircleCircumference(angleInRadians: number, circleOriginX: number, circleOriginY: number, radius: number) {
    let x = radius * Math.cos(angleInRadians) + circleOriginX;
    let y = radius * Math.sin(angleInRadians) + circleOriginY;

    return { x: x, y: y };
  }

  getSpeedForPosition(x: number, y: number, circleoriginX: number, circleOriginY: number, speedMultiplier: number) {
    let speed = this.getDistanceBetweenTwoPoints(x, y, circleoriginX, circleOriginY);
    return speed * speedMultiplier;
  }

  mapNumRange(num: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
}
