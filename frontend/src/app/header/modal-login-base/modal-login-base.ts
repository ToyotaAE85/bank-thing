import { Component, input, output, signal } from '@angular/core';

import { form, FormField, required } from '@angular/forms/signals';

import { ApiService } from '../../api.service';
import { LoggedStateService } from '../../log.service';
import { ModalService } from '../modal-service';

interface LoginFormData {
	username: string,
	password: string,
};

@Component({
	selector: 'app-modal-login-base',
	templateUrl: './modal-login-base.html',
	styleUrl: './modal-login-base.css',
	imports: [FormField],
})
export class ModalLoginBaseComponent {

	constructor(private api: ApiService, protected logged : LoggedStateService, protected modalData : ModalService) { }
	
	protected hasSignedUp = signal<boolean>(false);
	protected hasLoggedIn = signal<boolean>(false);
	protected errorReported = signal<string>('');


	protected resetFormData(): void {
		this.loginData.set({
			username: '',
			password: '',
		});
		this.errorReported.set('');
	}


	private loginData = signal<LoginFormData>({
		username: '',
		password: '',
	});


	private successLoginEvent(modalEvent : string) {
		if (modalEvent === 'signup') {
			this.hasSignedUp.set(true);

			setTimeout(() => {
				this.hasSignedUp.set(false);
				this.resetFormData();
				this.modalData.setModalTypeTo('login');
			}, 2000);

		} else if (modalEvent === 'login') {
			this.hasLoggedIn.set(true);

			setTimeout(() => {
				this.hasLoggedIn.set(false);
				this.logged.setLoggedStatus(true);	
				this.modalData.setModalOpenTo(false);
			}, 2000);
	
		}
	}

	
	protected submitForm(event: Event, action: string): void {
		event.preventDefault();

		const { username, password } = this.loginData();

		if (action === 'register') {
			this.api.register(username, password).subscribe({
				next: (res) => {},
				error: (err) => { 
					this.errorReported.set('User already exists.');
				},
				complete: () => this.successLoginEvent('signup'),
			});
		} else if (action === 'login') {
			this.api.login(username, password).subscribe({
				next: (res: any) => {
					localStorage.setItem('token', res.access_token);
				},
				error: (_) => {
					this.errorReported.set('Invalid credentials supplied.');
				},
				complete: () => this.successLoginEvent('login'),
			});
		}
	};


	public loginForm = form(this.loginData, (schemaPath) => {
		required(schemaPath.password);
		required(schemaPath.username);
	});

};
