import { Component, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";

import { HeaderComponent } from './header/header';
import { Footer } from './footer/footer';

import {LoggedStateService} from './log.service';

@Component({
	selector: 'app-root',

	imports: [
		HeaderComponent,
		Footer,
		RouterOutlet,
	],

	templateUrl: './app.html',
	styleUrl: './app.css'
})

export class App {

	protected isLoggedIn = signal<boolean>(false);

	constructor( public logged : LoggedStateService ) { 
		this.isLoggedIn.set(this.logged.isLoggedIn());
	}

	public setLoggedStatus(status : boolean) {
		this.isLoggedIn.set(status);
	}

}
