import {
  ClassTransformOptions,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import {
  AdditionalProperty,
  OptionalProperty,
  Property,
} from 'src/common/decorators/property.decorator';
import { TRANSFORM_GROUPS } from 'src/shared/constants/transform-options.constant';
import { BaseEntity } from 'src/shared/types/base-entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export class User extends BaseEntity {
  constructor(args: Partial<User>, options: ClassTransformOptions = {}) {
    super();
    Object.assign(this, plainToInstance(User, args, options));
  }

  static fromCreateDto(args: CreateUserDto) {
    return new User(args, {
      groups: [TRANSFORM_GROUPS.creatDto],
    });
  }

  static fromUpdateDto(args: UpdateUserDto) {
    return instanceToPlain(new User(args), {
      groups: [TRANSFORM_GROUPS.updateDto],
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
  }

  @Property()
  email: string;

  @Property()
  phoneNumber: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @OptionalProperty()
  birthDay?: string;

  @AdditionalProperty()
  get fullName(): string {
    return [this.lastName, this.firstName].join(' ').trim();
  }
}
