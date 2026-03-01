import { Component, signal, OnDestroy, OnInit } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';

import { LoggedStateService } from '../../../log.service';
import { ApiService } from '../../../api.service';

import { CurrencyPipe, TitleCasePipe } from '@angular/common'

interface TransferData {
	username: string,
	destination: string,
	amount: number,
	message: string,
};

@Component({
	selector: 'app-home-loggedin',
	imports: [FormField, CurrencyPipe, TitleCasePipe],
	templateUrl: './home-loggedin.html',
	styleUrl: './home-loggedin.css',
})
export class HomeLoggedinComponent implements OnDestroy, OnInit {

	constructor(private logged: LoggedStateService, protected api: ApiService) { }

	ngOnInit() {
		this.startSessionCountdown();
		this.retrieveUserData();
	}

	protected currentWindow = signal<string>('transfer');
	protected sessionTimer = signal<string>('10:00');

	protected htmlBalanceData = signal<number>(0);
	protected htmlUsername = signal<string>('');
	protected htmlTransactions = signal<any[]>([]);
	protected htmlError = signal<string>('');

	protected requestSuccess = signal<boolean>(false);



	private defaultUserData = signal<TransferData>({
		username: '', // change this to username
		destination: '',
		amount: 0,
		message: '',
	});

	protected userForm = form(this.defaultUserData, (schemaPath) => {
		required(schemaPath.amount);
		required(schemaPath.destination);
	});


	protected requestCurrentWindow(requestedType: string): boolean {
		return requestedType === this.currentWindow();
	}

	protected changeWindow(windowName: string) {
		this.currentWindow.set(windowName);

		this.userForm.amount().value.set(0);
		this.userForm.destination().value.set('');
		this.userForm.message().value.set('');
		this.htmlError.set('');
	}

	protected operationSuccess() {
		this.requestSuccess.set(true);
		this.retrieveUserData();

		setTimeout(() => {
			this.requestSuccess.set(false);
		}, 1000);
	}


	protected onSubmit(event: Event) {
		event.preventDefault();

		if (this.requestSuccess() === true){ return; }

		console.log("submit type:");

		if (this.currentWindow() === 'deposit'){
			this.api.deposit(this.userForm.amount().value(), this.userForm.message().value()).subscribe({
				next: () => {},
				error: (err) => { 
					this.htmlError.set('Error: invalid funds detected, please try again.'); 
					console.log(err); 
				},
				complete: () => this.operationSuccess(),
			})
		} else if (this.currentWindow() === 'transfer') {
			this.api.transfer(this.userForm.destination().value(), this.userForm.amount().value(), this.userForm.message().value()).subscribe({
				next: () => {},
				error: (err) => {
					this.htmlError.set('Error: invalid destination/funds detected, please try again.');
					console.log(err);
				},
				complete: () => this.operationSuccess(),
			})
		}
	}

	/* HTTP DATA BELOWWWWWWWWWW */

	protected retrieveUserData() {
		this.api.getBalance().subscribe({
			next: (res) => {this.htmlBalanceData.set(res.balance)},
			error: (err) => {this.htmlError.set("CRITICAL ERROR, BALANCE RETRIEVAL FAILURE.")},
		});

		this.api.getCurrentUser().subscribe({
			next: (res) => {this.htmlUsername.set(res.username)},
			error: (err) => {this.htmlError.set("CRITICAL ERROR, USERNAME RETRIEVAL FAILURE.")},
		});

		this.api.getTransactions().subscribe({
			next: (res) => (this.htmlTransactions.set(res)),
			error: (err) => {this.htmlError.set("CRITICAL ERROR, TRANSACTIONS RETRIEVAL FAILURE.")},
		});
	}



	/* non important v */
	private interval: any;

	private startSessionCountdown() {
		const token = localStorage.getItem('token');
		if (!token) { return; }

		const decoded: any = JSON.parse(atob(token.split('.')[1]));
		const expTime = decoded.exp * 1000;

		const updateTimer = () => {
			const now = Date.now();
			const diff = expTime - now;

			if (diff <= 0) {
				this.sessionTimer.set('00:00');

				if (localStorage.getItem('token')) {
					this.logged.setLoggedStatus(false, true);
					localStorage.removeItem('token');
				}

				return;
			}

			const mins = Math.floor(diff / 60000);
			const secs = Math.floor((diff % 60000) / 1000) + 1;

			this.sessionTimer.set(
				`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
			);
		};

		updateTimer();
		this.interval = setInterval(updateTimer, 1000); // milliseconds...
	}

	ngOnDestroy(): void {
		clearInterval(this.interval);
	}

}
