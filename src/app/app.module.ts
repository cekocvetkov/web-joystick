import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebJoystickComponent } from './web-joystick/web-joystick.component';

@NgModule({
  declarations: [AppComponent, WebJoystickComponent],
  imports: [BrowserModule, AppRoutingModule, NgxSliderModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
