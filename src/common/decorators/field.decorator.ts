import { Transform } from 'class-transformer';
import { TRANSFORM_GROUPS } from 'src/shared/constants/transform-options.constant';

interface FieldOptions {
  excludeFromIndexes: boolean;
}

export function Field(options?: FieldOptions) {
  const { excludeFromIndexes = false } = options ?? {};
  return Transform(
    ({ value, key }) => {
      if (value === undefined) return undefined;
      return {
        name: key,
        value: value ?? null,
        excludeFromIndexes,
      };
    },
    {
      toPlainOnly: true,
      groups: [TRANSFORM_GROUPS.datastore],
    },
  );
}
