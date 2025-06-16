import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PushNotificationService } from '../push-notification/push-notification.service';

@Component({
    selector: 'app-notification-permission',
    templateUrl: './notification-permission.component.html',
    styleUrl: './notification-permission.component.css',
    standalone: true,
    imports: [AsyncPipe]
})
export class NotificationPermissionComponent {
    permissionStatus: string =  'Waiting';

    constructor(private pushNotifService: PushNotificationService) { }

    async requestPermission(): Promise<void> {
        const permission = await this.pushNotifService.requestPermission();
        this.permissionStatus = permission;
    }
}
