import { ClassTransformOptions, instanceToPlain, plainToInstance } from 'class-transformer';
import { Entity } from 'src/common/decorators/entity.decorator';
import { Field } from 'src/common/decorators/field.decorator';
import {
  AdditionalProperty,
  OptionalProperty,
  Property,
} from 'src/common/decorators/property.decorator';
import { TRANSFORM_GROUPS } from 'src/shared/constants/transform-options.constant';
import { BaseEntity } from 'src/shared/types/base-entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Entity()
export class User extends BaseEntity {
  constructor(args: Partial<User>, options: ClassTransformOptions = {}) {
    super();
    Object.assign(this, plainToInstance(User, args, options));
  }

  static fromCreateDto(args: CreateUserDto) {
    return new User(args, {
      groups: [TRANSFORM_GROUPS.creatDto],
      exposeUnsetFields: false,
    });
  }

  static fromUpdateDto(args: UpdateUserDto) {
    return instanceToPlain(new User(args), {
      groups: [TRANSFORM_GROUPS.updateDto],
      exposeUnsetFields: false,
    });
  }

  @Property()
  @Field()
  email: string;

  @Property()
  @Field()
  phoneNumber: string;

  @Property()
  @Field()
  firstName: string;

  @Property()
  @Field()
  lastName: string;

  @OptionalProperty()
  @Field()
  birthDay?: string;

  @AdditionalProperty()
  get fullName(): string {
    return [this.lastName, this.firstName].join(' ').trim();
  }
}
