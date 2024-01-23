import { Injectable } from '@nestjs/common';
import { Equal, FindManyOptions, Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getAllUsers(filters?: { id?: number, name?: string; email?: string, dateOfBirth?: string, createdDate?: string }, sortBy?: string, sortDirection?: string): Promise<User[]> {
        const options: FindManyOptions<User> = {
            order: { [sortBy]: sortDirection }
        };
        if (filters) {
            options.where = {
                ...(filters.id && { id: Equal(filters.id) }),
                ...(filters.name && { name: Like(`%${filters.name}%`) }),
                ...(filters.email && { email: Like(`%${filters.email}%`) }),
                ...(filters.dateOfBirth && { dateOfBirth: Equal(new Date(filters.dateOfBirth)) }),
                ...(filters.createdDate && { createdDate: Equal(new Date(filters.createdDate)) }),
            };
        }
        return await this.userRepository.find(options);
    }

    async getUserById(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }

    async createUser(user: CreateUserDto): Promise<User> {
        const userDto = this.userRepository.create(user);
        return await this.userRepository.save(userDto);
    }

    async updateUser(id: number, data: UpdateUserDto) {
        await this.userRepository.update(id, data);
        return await this.getUserById(id);
    }

    async deleteUser(id: number) {
        return await this.userRepository.update(id, { deletedDate: new Date });
    }
}
