import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebJoystickComponent } from './web-joystick.component';

describe('WebJoystickComponent', () => {
  let component: WebJoystickComponent;
  let fixture: ComponentFixture<WebJoystickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebJoystickComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebJoystickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
