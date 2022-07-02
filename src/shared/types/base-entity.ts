import { DefaultValue } from 'src/common/decorators/default-value.decorator';
import { Field } from 'src/common/decorators/field.decorator';
import { OptionalProperty, Property } from 'src/common/decorators/property.decorator';
import { TRANSFORM_GROUPS } from '../constants/transform-options.constant';

export class BaseEntity {
  @Property()
  @Field({ excludeFromIndexes: true })
  id: string;

  @Property()
  @Field()
  @DefaultValue(Date.now, {
    groups: [TRANSFORM_GROUPS.creatDto],
  })
  createdAt: number;

  @OptionalProperty()
  @Field()
  @DefaultValue(Date.now, {
    groups: [TRANSFORM_GROUPS.updateDto],
  })
  updatedAt: number;

  @OptionalProperty()
  @Field()
  deletedAt: number;
}
