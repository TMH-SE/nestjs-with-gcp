import { applyDecorators } from '@nestjs/common';
import { Transform, TransformOptions } from 'class-transformer';

export function DefaultValue(defaultValue: any, options?: TransformOptions) {
  return applyDecorators(
    Transform(({ value }) => {
      return value !== undefined
        ? value
        : typeof defaultValue === 'function' // use function to init dynamic default value (eg: timestamp)
        ? defaultValue()
        : defaultValue;
    }, options),
  );
}
