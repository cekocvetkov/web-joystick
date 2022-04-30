import { Options } from '@angular-slider/ngx-slider';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-joystick',
  templateUrl: './joystick.component.html',
  styleUrls: ['./joystick.component.css'],
})
export class JoystickComponent implements OnInit, AfterViewInit {
  @ViewChild('outerCircle')
  outerCircleElement: ElementRef<HTMLElement>;
  @ViewChild('innerCircle')
  innerCircleElement: ElementRef<HTMLElement>;

  diameter: number = 240;
  innerDiameter: number = this.diameter - 100;
  radius: number = this.diameter / 2;
  innerRadius: number = this.innerDiameter / 2;
  currCircleOrigin: { x: number; y: number } = { x: 0, y: 0 };
  circleOrigin: { x: number; y: number; edge: { left: number; top: number } };

  speed: number = 0;
  speedSliderValue = 5;
  speedSliderOptions: Options = {
    floor: 0,
    ceil: 10,
  };
  angleInDegrees: number = 0;

  constructor(private cdRef: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    const outerCircleClientRect =
      this.outerCircleElement.nativeElement.getBoundingClientRect();
    this.currCircleOrigin = {
      x: outerCircleClientRect.left + this.radius,
      y: outerCircleClientRect.top + this.radius,
    };
    this.circleOrigin = {
      x: outerCircleClientRect.left + this.radius,
      y: outerCircleClientRect.top + this.radius,
      edge: {
        left: this.innerCircleElement.nativeElement.offsetLeft,
        top: this.innerCircleElement.nativeElement.offsetTop,
      },
    };
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {}

  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation();
    document.ontouchend = () => this.closeDragElement();
    //arrow function is needed here to have a reference to *this*.currentDragPosX/Y
    document.ontouchmove = (e) => this.elementDrag(e);
  }
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    document.onmouseup = () => this.closeDragElement();
    //arrow function is needed here to have a reference to *this*.currentDragPosX/Y
    document.onmousemove = (e) => this.elementDrag(e);
  }

  elementDrag(e: UIEvent) {
    e.preventDefault();
    e.stopPropagation();

    let newCoords: { x: number; y: number } = this.getNewCoordsFromEvent(e);

    let angle: number = this.getAngleToCenterInRadians(
      newCoords.x,
      newCoords.y
    );
    if (this.isInTheCircle(newCoords.x, newCoords.y)) {
      this.currCircleOrigin = { x: newCoords.x, y: newCoords.y };
      this.speed = this.getSpeedForPosition(newCoords.x, newCoords.y);
    } else {
      let x = this.radius * Math.cos(angle) + this.circleOrigin.x;
      let y = this.radius * Math.sin(angle) + this.circleOrigin.y;
      this.currCircleOrigin = { x: x, y: y };
      this.speed = this.getSpeedForPosition(x, y);
    }
    this.drawInnerCircle(this.currCircleOrigin.x, this.currCircleOrigin.y);
  }

  getSpeedForPosition(x: number, y: number) {
    let speed = this.getDistanceBetweenTwoPoints(
      x,
      y,
      this.circleOrigin.x,
      this.circleOrigin.y
    );
    return speed * this.speedSliderValue;
  }

  getDistanceBetweenTwoPoints(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  getNewCoordsFromEvent(e: UIEvent) {
    let newX;
    let newY;
    if (e instanceof MouseEvent) {
      newX = e.clientX;
      newY = e.clientY;
    } else {
      newX = (e as TouchEvent).touches[0].pageX;
      newY = (e as TouchEvent).touches[0].pageY;
    }

    return { x: newX, y: newY };
  }

  getAngleToCenterInRadians(x: number, y: number) {
    var angle = Math.atan2(y - this.circleOrigin.y, x - this.circleOrigin.x);
    if (Math.sign(angle) == -1) {
      this.angleInDegrees = Math.round((-angle * 180) / Math.PI);
    } else {
      this.angleInDegrees = Math.round(360 - (angle * 180) / Math.PI);
    }
    return angle;
  }

  isInTheCircle(x: number, y: number) {
    var currRadius = Math.sqrt(
      Math.pow(x - this.circleOrigin.x, 2) +
        Math.pow(y - this.circleOrigin.y, 2)
    );
    if (this.radius >= currRadius) return true;
    else return false;
  }

  drawInnerCircle(x: number, y: number) {
    this.innerCircleElement.nativeElement.style.left = `${
      x - this.innerRadius
    }px`;
    this.innerCircleElement.nativeElement.style.top = `${
      y - this.innerRadius
    }px`;
  }

  closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    this.currCircleOrigin = this.circleOrigin;
    this.innerCircleElement.nativeElement.style.left =
      this.circleOrigin.edge.left + 'px';

    this.innerCircleElement.nativeElement.style.top =
      this.circleOrigin.edge.top + 'px';
    this.angleInDegrees = 0;
    this.speed = 0;
    // innerCircleDiv.style.left = `${newPositionLeft}px`;
    // innerCircleDiv.style.top = `${newPositionTop}px`;
  }
}
