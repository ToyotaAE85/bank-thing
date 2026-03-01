import { Injectable } from '@nestjs/common';
import { error } from 'console';

export interface Transaction {
	from: string,
	to: string,
	amount: number,
	message: string,
	type: string,
};

export type User = {
	id: number;
	username: string;
	password: string;
	balance: number;
	transactions: Transaction[];
};

@Injectable()
export class UsersService {
	private users: User[] = [];
	private nextId = 1;

	findOne(username: string): User | undefined {
		return this.users.find(user => user.username === username);
	}

	create(username: string, password: string): User {
		const newUser: User = {
			id: this.nextId++,
			username,
			password,
			balance: 1000,
			transactions: []
		};
		this.users.push(newUser);
		return newUser;
	}

	deposit(username: string, amount: number, message = '') {
		const user = this.findOne(username);

		if (typeof(amount) !== "number") throw new Error("Invalid Number detected");
		if (!user) throw new Error('User not found');
		if (amount <= 0) throw new Error('Negative or cero funds are not allowed');
		if (message.length > 250) throw new Error('Message is too long');

		user.balance += amount;

		user.transactions.push({
			from: username + ' (self)',
			to: username,
			amount,
			message,
			type: 'deposit',
		});

		return user;
	}

	transfer(fromUsername: string, toUsername: string, amount: number, message = '') {
		const fromUser = this.findOne(fromUsername);
		const toUser = this.findOne(toUsername);
		
		if (typeof(amount) !== "number") throw new Error("Invalid Number detected");
		if (!fromUser || !toUser) throw new Error('Sender or recipient not found');
		if (fromUser.balance < amount) throw new Error('Insufficient funds');
		if (fromUser === toUser) throw new Error('Cannot send to yourself, do deposit ffs');
		if (amount <= 0) throw new Error('Negative or cero funds are not allowed');
		if (message.length > 250) throw new Error('Message is too long');

		fromUser.balance -= amount;
		toUser.balance += amount;

		const record: Transaction = {
			from: fromUsername,
			to: toUsername,
			amount,
			message,
			type: 'transfer',
		};

		fromUser.transactions.push(record);
		toUser.transactions.push(record);

		return record;
	}
}