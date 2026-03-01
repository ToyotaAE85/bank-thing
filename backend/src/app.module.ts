import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		AccountModule,
	],
})
export class AppModule { }