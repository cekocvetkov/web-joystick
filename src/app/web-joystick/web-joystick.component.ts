import { Options } from '@angular-slider/ngx-slider';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CalculationsServiceService } from '../services/calculations-service.service';
import { DragMoveInfo, EventStreamsService } from '../services/event-streams.service';

@Component({
  selector: 'app-web-joystick',
  templateUrl: './web-joystick.component.html',
  styleUrls: ['./web-joystick.component.css'],
})
export class WebJoystickComponent implements OnInit {
  @ViewChild('outerCircle')
  outerCircleElement: ElementRef<HTMLElement>;
  @ViewChild('innerCircle')
  innerCircleElement: ElementRef<HTMLElement>;

  diameter: number = 240;
  innerDiameter: number = this.diameter - 100;
  radius: number = this.diameter / 2;
  innerRadius: number = this.innerDiameter / 2;
  currCircleOrigin: { x: number; y: number } = { x: 0, y: 0 };
  circleOrigin: { x: number; y: number };

  speed: number = 0;
  speedSliderValue = 5;
  speedSliderOptions: Options = {
    floor: 0,
    ceil: 10,
  };
  angleInDegrees: number = 0;

  testX: number;
  testY: number;

  constructor(private eventStreamsService: EventStreamsService, private calculationsService: CalculationsServiceService) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.circleOrigin = {
      x: this.innerCircleElement.nativeElement.getBoundingClientRect().left + this.innerRadius,
      y: this.innerCircleElement.nativeElement.getBoundingClientRect().top + this.innerRadius,
    };
    this.eventStreamsService.initEventStreams(this.innerCircleElement, this.innerRadius);

    // Set to origin
    this.moveInnerCircle({
      x: this.circleOrigin.x,
      y: this.circleOrigin.y,
    });

    this.eventStreamsService.dragMove$.subscribe((moveEvent: DragMoveInfo) => {
      this.handleDrag(moveEvent);
    });

    this.eventStreamsService.mouseUp$.subscribe(() => {
      this.handleMouseUp();
    });
  }

  handleMouseUp() {
    this.moveInnerCircle({
      x: this.circleOrigin.x,
      y: this.circleOrigin.y,
    });
  }

  handleDrag(moveEvent: DragMoveInfo) {
    this.moveInnerCircle(moveEvent);
  }

  private moveInnerCircle(moveEvent: DragMoveInfo) {
    this.angleInDegrees = this.calculationsService.getAngleToCenterInDegrees(moveEvent.x, moveEvent.y, this.circleOrigin.x, this.circleOrigin.y);

    let newX;
    let newY;
    if (this.calculationsService.isInTheCircle(moveEvent.x, moveEvent.y, this.radius, this.circleOrigin.x, this.circleOrigin.y)) {
      newX = moveEvent.x;
      newY = moveEvent.y;
    } else {
      let angleInRadians = this.calculationsService.getAngleToCenterInRadians(moveEvent.x, moveEvent.y, this.circleOrigin.x, this.circleOrigin.y);
      // handle mouse drag outside the circle
      let pointOnCircleCircumference = this.calculationsService.getPointOnCircleCircumference(angleInRadians, this.circleOrigin.x, this.circleOrigin.y, this.radius);

      newX = pointOnCircleCircumference.x;
      newY = pointOnCircleCircumference.y;
    }

    this.innerCircleElement.nativeElement.style.left = newX - this.innerRadius + 'px';
    this.innerCircleElement.nativeElement.style.top = newY - this.innerRadius + 'px';

    this.speed = this.calculationsService.getSpeedForPosition(newX, newY, this.circleOrigin.x, this.circleOrigin.y, this.speedSliderValue);

    //map absolute coordinates of inner circle to values where the center of the circle is (0,0) and the maximum is (-speed, speed)
    let x1 = this.calculationsService.getPointOnCircleCircumference(0, this.circleOrigin.x, this.circleOrigin.y, this.radius).x;
    let y1 = this.calculationsService.getPointOnCircleCircumference(1.5707963268, this.circleOrigin.x, this.circleOrigin.y, this.radius).y;
    this.currCircleOrigin.x = this.calculationsService.mapNumRange(newX, x1 - this.diameter, x1, -this.speed, this.speed);
    this.currCircleOrigin.y = this.calculationsService.mapNumRange(newY, y1 - this.diameter, y1, -this.speed, this.speed);
  }
}
