import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private baseUrl = 'http://localhost:3000';

	constructor(private http: HttpClient) { }

	register(username: string, password: string): Observable<any> {
		return this.http.post(`${this.baseUrl}/auth/register`, { username, password });
	}

	login(username: string, password: string): Observable<any> {
		return this.http.post(`${this.baseUrl}/auth/login`, { username, password });
	}

	private getAuthHeaders(): { headers: HttpHeaders } {
		const token = localStorage.getItem('token');
		return {
			headers: new HttpHeaders({
				Authorization: `Bearer ${token}`, 
			}),
		};
	}


	getBalance(): Observable<any> {
		return this.http.get(
			`${this.baseUrl}/account/balance`,
			this.getAuthHeaders()
		);
	}

	getTransactions(): Observable<any> {
		return this.http.get(
			`${this.baseUrl}/account/transactions`,
			this.getAuthHeaders()
		);
	}

	getCurrentUser(): Observable<any> {
		const token = localStorage.getItem('token');
		return this.http.get(
			`${this.baseUrl}/account/me`, 
			this.getAuthHeaders()
		);
	}


	deposit(amount: number, message: string): Observable<any> {
		return this.http.post(
			`${this.baseUrl}/account/deposit`,
			{ amount, message },
			this.getAuthHeaders()
		);
	}

	transfer(
		to: string,
		amount: number,
		message: string
	): Observable<any> {
		return this.http.post(
			`${this.baseUrl}/account/transfer`,
			{ to, amount, message },
			this.getAuthHeaders()
		);
	}
}
