import { DefaultValue } from 'src/common/decorators/default-value.decorator';
import {
  OptionalProperty,
  Property,
} from 'src/common/decorators/property.decorator';
import { TRANSFORM_GROUPS } from '../constants/transform-options.constant';

export class BaseEntity {
  @Property()
  id: string;

  @Property()
  @DefaultValue(Date.now, {
    groups: [TRANSFORM_GROUPS.creatDto],
  })
  createdAt: number;

  @OptionalProperty()
  @DefaultValue(Date.now, {
    groups: [TRANSFORM_GROUPS.updateDto],
  })
  updatedAt: number;

  @OptionalProperty()
  deletedAt: number;
}
