import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { excludeDetails } from './utils';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async users() {
        const users = await this.usersService.findAll();
        return users.map((user) => excludeDetails(user));
    }

    @UseGuards(AuthGuard)
    @Get('me')
    async me(@Req() req: Request) {
        const user = await this.usersService.findOneById(req.userId);
        return excludeDetails(user);
    }
}
