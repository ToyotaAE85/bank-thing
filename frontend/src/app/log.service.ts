import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class LoggedStateService {
	public isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));
	public sessionExpired = signal<boolean>(false);

	public setLoggedStatus(status: boolean, expired : boolean = false) {
		this.isLoggedIn.set(status);

		if (expired){
			this.sessionExpired.set(true);
			
			setTimeout(() => {
				this.sessionExpired.set(false);
			}, 3000);
		}
	}

}