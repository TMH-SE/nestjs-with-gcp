import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from 'src/common/decorators/inject-repository.decorator';
import { Repository } from 'src/shared/modules/database/repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userRepository.save(User.fromCreateDto(createUserDto));
      return newUser;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const query = this.userRepository.query.filter('deletedAt', '=', null);
      // *NOTE: Should use `repository.find(query)` to run query
      const users = await this.userRepository.find(query);
      return users;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: string) {
    try {
      return this.userRepository.findById(id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existedUser = await this.findById(id);
      if (!existedUser) return null;
      const updatedUser = await this.userRepository.updateOne(
        new User(Object.assign(existedUser, User.fromUpdateDto(updateUserDto))),
      );
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    const existedUser = await this.findById(id);
    if (!existedUser) return null;
    const deletedUser = await this.userRepository.deleteOne(existedUser);
    return deletedUser;
  }
}
