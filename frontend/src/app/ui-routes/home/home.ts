import { Component, signal } from '@angular/core';

import { HomeLoggedoutComponent } from './home-loggedout/home-loggedout';
import { HomeLoggedinComponent } from './home-loggedin/home-loggedin';

import { LoggedStateService } from '../../log.service';

@Component({
	selector: 'app-home',
	imports: [
		HomeLoggedoutComponent,
		HomeLoggedinComponent,
	],
	templateUrl: './home.html',
	styleUrl: './home.css',
})
export class HomeComponent {
	protected isLoggedIn = signal<boolean>(false);

	constructor( public logged : LoggedStateService) {
		this.isLoggedIn.set(logged.isLoggedIn());
	}
}
