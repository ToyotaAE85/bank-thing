import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) { }

	register(username: string, password: string) {
		const existing = this.usersService.findOne(username);
		if (existing) {
			throw new UnauthorizedException('User already exists');
		}
		return this.usersService.create(username, password);
	}

	login(username: string, password: string) {
		const user = this.usersService.findOne(username);
		if (!user || user.password !== password) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { username: user.username, sub: user.id };
		return { access_token: this.jwtService.sign(payload) };
	}
}