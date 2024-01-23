import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getAllUsers(
        @Query('sort') sort?: string,
        @Query('name') name?: string,
        @Query('email') email?: string,
        @Query('dateOfBirth') dateOfBirth?: string,
        @Query('createdDate') createdDate?: string,
    ) {
        return this.userService.getAllUsers(sort, { name, email, dateOfBirth, createdDate });
    }

    @Get(':id')
    getUserById(@Param('id') id: number) {
        return this.userService.getUserById(id);
    }

    @Post()
    createUser(@Body() user) {
        return this.userService.createUser(user);
    }

    @Put(':id')
    updateUser(@Param('id') id: number, @Body() user) {
        return this.userService.updateUser(id, user);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }
}
