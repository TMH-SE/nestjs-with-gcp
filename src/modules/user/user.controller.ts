import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  Query,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiUserCreatedResponse,
  ApiUserOkResponse,
  ApiUserOkResponseWithPagination,
  UserOkResponse,
  UserOkResponseWithPagination,
} from './types/user-ok-response.model';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginationQuery } from 'src/common/decorators/api-pagination-query.decorator';
import { PaginationParams } from 'src/shared/types/pagination-params';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiCreatedResponse({ description: 'OK', type: ApiUserCreatedResponse })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserOkResponse> {
    const createdUser = await this.usersService.create(createUserDto);
    return { data: createdUser };
  }

  @Get()
  @ApiPaginationQuery()
  @ApiOkResponse({
    description: 'OK',
    type: ApiUserOkResponseWithPagination,
  })
  async findAll(@Query() query: PaginationParams): Promise<UserOkResponseWithPagination> {
    const users = await this.usersService.findAll();
    if (!users.length) {
      return { data: [], totalCount: 0 };
    }
    const totalCount = users.length;
    const { page, limit } = query;
    let data = users;
    if (page && limit) {
      data = users.splice((page - 1) * limit, limit);
    }
    return { data, totalCount };
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'OK',
    type: ApiUserOkResponse,
  })
  async findOne(@Param('id') id: string): Promise<UserOkResponse> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { data: user };
  }

  @Put(':id')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserOkResponse> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return { data: updatedUser };
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  async remove(@Param('id') id: string) {
    const deletedUser = await this.usersService.remove(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return true;
  }
}
