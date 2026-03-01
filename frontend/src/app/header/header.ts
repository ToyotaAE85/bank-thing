import { Component, signal, output, input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router'

import { ModalLoginBaseComponent } from "./modal-login-base/modal-login-base";
import { LoggedStateService } from '../log.service';

import { ModalService } from './modal-service'

@Component({
    selector:'app-header',
    templateUrl:'./header.html',
    styleUrl: './header.css',
    imports: [
        ModalLoginBaseComponent,
        RouterLink, 
        RouterModule,
    ],
	providers: [ ModalService ]
})
export class HeaderComponent { 

	constructor(protected logged : LoggedStateService, protected modalData : ModalService) { }
	
	protected logout() {
		if (localStorage.getItem('token')) {
			localStorage.removeItem('token');
			this.logged.setLoggedStatus(false);
		}
	}
};
