import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from './core/services/user.service';
import { AuthService } from './core/services/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  menuState = true;
  deviceInfo = null;
  public constructor(
    private titleService: Title,
    private authService: AuthService,
    private userService: UserService,
    private deviceService: DeviceDetectorService,
    ) { 
      this.epicFunction();
    }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  onClickWrapper() {
    this.menuState = false;
    return true;
  }

  onHide($event) {
    this.menuState = $event;
    console.log('menu', this.menuState);
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();

    if (isMobile) {
      this.menuState = false;
    }
  }
}
