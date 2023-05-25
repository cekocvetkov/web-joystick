import { ElementRef, Injectable } from '@angular/core';
import { Observable, fromEvent, map, switchMap, takeUntil } from 'rxjs';

export interface DragMoveInfo {
  originalEvent?: MouseEvent;
  deltaX?: number;
  deltaY?: number;
  startOffsetX?: number;
  startOffsetY?: number;
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root',
})
export class EventStreamsService {
  mouseDown$: Observable<Event>;
  mouseMove$: Observable<Event>;
  mouseUp$: Observable<Event>;

  dragMove$: Observable<DragMoveInfo>;
  constructor() {}

  initEventStreams(element: ElementRef<HTMLElement>, innerRadius: number) {
    this.mouseDown$ = fromEvent(element.nativeElement, 'mousedown');
    this.mouseMove$ = fromEvent(document, 'mousemove');
    this.mouseUp$ = fromEvent(document, 'mouseup');

    this.dragMove$ = this.mouseDown$.pipe(
      switchMap((start: any) =>
        this.mouseMove$.pipe(
          // we transform the mouseDown and mouseMove event to get the necessary information
          map((moveEvent: any) => ({
            originalEvent: moveEvent,
            deltaX: moveEvent.pageX - start.pageX,
            deltaY: moveEvent.pageY - start.pageY,
            startOffsetX: start.offsetX,
            startOffsetY: start.offsetY,
            x: moveEvent.pageX,
            y: moveEvent.pageY,
          })),
          takeUntil(this.mouseUp$)
        )
      )
    );
  }
}
