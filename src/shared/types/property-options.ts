import { TransformOptions } from 'class-transformer';

export class DefaultValuePropertyOptions {
  value: any;
  transformOptions: TransformOptions;
}

export class PropertyOptions {
  default: any | DefaultValuePropertyOptions;
}
