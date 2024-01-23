export class CreateUserDto {
	readonly name: string;
	readonly email: string;
	readonly password: string;
	readonly dateOfBirth: Date;
}

export class UpdateUserDto {
	readonly name: string;
	readonly email: string;
	readonly dateOfBirth: Date;
}
