import { Injectable } from '@nestjs/common';
import { Equal, FindManyOptions, Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getAllUsers(sort?: string, filters?: { name?: string; email?: string, dateOfBirth?: string, createdDate?: string }): Promise<User[]> {
        const options: FindManyOptions<User> = {};
        if (sort) {
            options.order = { [sort]: 'ASC' };
        }

        if (filters) {
            options.where = {
              ...(filters.name && { name: Like(`%${filters.name}%`) }),
              ...(filters.email && { email: Like(`%${filters.email}%`) }),
              ...(filters.dateOfBirth && { dateOfBirth: Equal(new Date(filters.dateOfBirth)) }),
              ...(filters.createdDate && { createdDate: Equal(new Date(filters.createdDate)) }),
            };
          }
        return await this.userRepository.find(options);
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: id });
        return user;
    }

    async createUser(user: CreateUserDto): Promise<User> {
        console.log( typeof user)
        return await this.userRepository.save(user);
    }

    async updateUser(id: number, updatedUser: User) {
        await this.userRepository.update(id, updatedUser);
        return await this.getUserById(id);
    }

    async deleteUser(id: number) {
        return await this.userRepository.update(id, {deletedDate: new Date});
    }
}
