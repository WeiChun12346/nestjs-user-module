import { Injectable } from '@nestjs/common';
import { Between, Equal, FindManyOptions, IsNull, Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getAllUsers(filters?: { id?: number, name?: string; email?: string, dateOfBirth?: string, updatedDate?: string }, sortBy?: string, sortDirection?: string, page?: number, limit?: number): Promise<{ data: any[]; total: number }> {
        const options: FindManyOptions<User> = {
            order: { [sortBy]: sortDirection },
            skip: (page - 1) * limit || 0,
            take: limit || 0
        };
        if (filters) {
            options.where = {
                ...(filters.id && { id: Equal(filters.id) }),
                ...(filters.name && { name: Like(`%${filters.name}%`) }),
                ...(filters.email && { email: Like(`%${filters.email}%`) }),
                ...(filters.dateOfBirth && { dateOfBirth: 
                    Between(
                        new Date(new Date(filters.dateOfBirth).setHours(0, 0, 0, 0)),
                        new Date(new Date(filters.dateOfBirth).setHours(23, 59, 59, 999))
                    )
                }),
                ...(filters.updatedDate && { updatedDate: 
                    Between(
                        new Date(new Date(filters.updatedDate).setHours(0, 0, 0, 0)),
                        new Date(new Date(filters.updatedDate).setHours(23, 59, 59, 999))
                    ) 
                }),
                deletedDate: IsNull()
            };
        }
        const [results, total] = await this.userRepository.findAndCount(options);
        const data = results.map(({ password, ...rest }) => rest);
        return { data, total};
    }

    async getUserById(id: number): Promise<User> {
        return await this.userRepository.findOne({
            where: { id: id },
            select: ['name', 'email', 'dateOfBirth'],
        });
    }

    async createUser(user: CreateUserDto): Promise<User> {
        const userDto = this.userRepository.create(user);
        return await this.userRepository.save(userDto);
    }

    async updateUser(id: number, data: UpdateUserDto) {
        const foundEntity = await this.userRepository.findOneBy({id});
        await this.userRepository.save(Object.assign(foundEntity, data));
        return await this.getUserById(id);
    }

    async deleteUser(id: number) {
        return await this.userRepository.update(id, { deletedDate: new Date });
    }
}
