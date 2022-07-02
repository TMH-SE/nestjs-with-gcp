import { Datastore, DatastoreOptions } from '@google-cloud/datastore';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ClassConstructor } from 'class-transformer';
import path from 'path';
import { EnvironmentConfig } from 'src/config/env.configuration';
import { BaseEntity } from 'src/shared/types/base-entity';
import { Repository } from './repository';

@Injectable()
export class DatabaseService {
  private options: DatastoreOptions = {};
  private datastore: Datastore;

  constructor(
    @Inject(EnvironmentConfig.KEY)
    private readonly env: ConfigType<typeof EnvironmentConfig>,
    private readonly reflector: Reflector,
  ) {
    const { nodeEnv, projectId } = this.env;
    if (nodeEnv === 'local') {
      this.options = {
        keyFilename: path.join(process.cwd(), 'serviceAccountKey.json'),
        projectId,
      };
    }
    this.datastore = new Datastore(this.options);
  }

  getRepository<T extends BaseEntity>(classTarget: ClassConstructor<T>) {
    const kind = this.reflector.get<string>('kind', classTarget);
    const repository = new Repository<T>(this.datastore, kind, classTarget);
    return repository;
  }
}
