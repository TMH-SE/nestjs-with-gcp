import { SetMetadata } from '@nestjs/common';
import DatastoreKind from 'src/shared/enums/datastore-kind.enum';

/**
 * Register datastore entity
 * @param kind Datastore kind name - categorizes the entity. If empty, the kind will be `classname + 's'` (lowercase)
 * @returns class decorator
 */
export function Entity(kind?: DatastoreKind) {
  return (target: any) => {
    SetMetadata('kind', kind || `${target.name.toLowerCase()}s`)(target);
  };
}
