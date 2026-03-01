import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('account')
export class AccountController {
	constructor(private usersService: UsersService) { }

	@UseGuards(JwtAuthGuard)
	@Get('balance')
	getBalance(@Request() req) {
		const user = this.usersService.findOne(req.user.username);
		return { balance: user?.balance ?? 0 };
	}

	@UseGuards(JwtAuthGuard)
	@Get('transactions')
	getTransactions(@Request() req) {
		const user = this.usersService.findOne(req.user.username);
		// console.log(user);
		return user?.transactions ?? [];
	}

	@UseGuards(JwtAuthGuard)
	@Post('deposit')
	deposit(
		@Request() req,
		@Body() body: { amount: number; message?: string },
	) {
		return this.usersService.deposit(
			req.user.username,
			body.amount,
			body.message ?? '',
		);
	}

	@UseGuards(JwtAuthGuard)
	@Post('transfer')
	transfer(
		@Request() req,
		@Body() body: { to: string; amount: number; message?: string },
	) {
		return this.usersService.transfer(
			req.user.username,
			body.to,
			body.amount,
			body.message ?? '',
		);
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	getUsername(@Request() req) {
		return {username: req.user.username};
	}

}