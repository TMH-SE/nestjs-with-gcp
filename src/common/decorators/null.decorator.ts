import { applyDecorators } from '@nestjs/common';
import { Transform, TransformOptions } from 'class-transformer';

// use @Null() to set null as default value
export function Null(options?: TransformOptions) {
  return applyDecorators(
    Transform(({ value }) => {
      if (value === undefined) {
        return null;
      }
      return value;
    }, options),
  );
}
