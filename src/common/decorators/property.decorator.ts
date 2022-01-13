import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TRANSFORM_GROUPS } from 'src/shared/constants/transform-options.constant';
import { Null } from './null.decorator';

export function Property() {
  return applyDecorators(ApiProperty(), Expose());
}

export function OptionalProperty() {
  return applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Null({ groups: [TRANSFORM_GROUPS.creatDto] }), // store null as default when value is undefined
  );
}

export function AdditionalProperty() {
  return applyDecorators(
    ApiPropertyOptional(),
    Expose({ groups: [TRANSFORM_GROUPS.viewDto] }), // only includes in response
  );
}
