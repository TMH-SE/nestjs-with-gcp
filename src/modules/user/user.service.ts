import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'src/shared/modules/database/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from './user.providers';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const docRef = await this.userRepository.add(
      User.fromCreateDto(createUserDto),
    );
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      return null;
    }
    return snapshot.data();
  }

  async findAll() {
    const snapshot = await this.userRepository
      .where('deletedAt', '==', null)
      .orderBy('createdAt', 'desc')
      .get();
    if (snapshot.empty) {
      return [];
    }
    const results = snapshot.docs.map((doc) => {
      return doc.data();
    });
    return results;
  }

  async findById(id: string) {
    const snapshot = await this.userRepository.doc(id).get();
    if (!snapshot.exists) {
      return null;
    }
    const user = snapshot.data();
    if (user.deletedAt) {
      return null;
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existedUser = await this.findById(id);
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }
    const docRef = this.userRepository.doc(id);
    const writeResult = await docRef.update(User.fromUpdateDto(updateUserDto));
    return !!writeResult.writeTime;
  }

  async remove(id: string) {
    const existedUser = await this.findById(id);
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }
    const writeResult = await this.userRepository
      .doc(id)
      .update({ deletedAt: Date.now() });
    if (!writeResult.writeTime) {
      throw new InternalServerErrorException();
    }
  }
}
