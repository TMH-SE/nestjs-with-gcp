import { Datastore, Query } from '@google-cloud/datastore';
import { entity as Entity } from '@google-cloud/datastore/build/src/entity';
import { ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer';
import { TRANSFORM_GROUPS } from 'src/shared/constants/transform-options.constant';
import { BaseEntity } from 'src/shared/types/base-entity';
import { v1 as uuidv1 } from 'uuid';

export class Repository<T extends BaseEntity> {
  private datastore: Datastore;
  private kind: string;
  private classTarget: ClassConstructor<T>;

  constructor(datastore: Datastore, kind: string, classTarget: ClassConstructor<T>) {
    this.datastore = datastore;
    this.kind = kind;
    this.classTarget = classTarget;
  }

  get query() {
    return this.datastore.createQuery(this.kind);
  }

  async findById(id: string) {
    try {
      const key = this._key(id);
      const [entity] = await this.datastore.get(key);
      if (!entity) return null;
      return this._transformToTargetClass(entity);
    } catch (err) {
      console.error('ERROR:', err);
      throw err;
    }
  }

  async findByIds(ids: string[]) {
    try {
      const keys = ids.map((id) => this._key(id));
      const response = await this.datastore.get(keys);
      const results = response.map((entity) => {
        if (!entity) return null;
        return this._transformToTargetClass(entity);
      });
      return results;
    } catch (err) {
      console.error('ERROR:', err);
      throw err;
    }
  }

  async find(query: Query) {
    const [entities] = await this.datastore.runQuery(query);
    return entities.map((entity) =>
      plainToInstance(this.classTarget, entity, {
        enableImplicitConversion: true,
        groups: [TRANSFORM_GROUPS.viewDto],
      }),
    );
  }

  async save(data: T) {
    try {
      const entity = this._createEntity(data);
      await this.datastore.save(entity);
      return this.findById(data.id);
    } catch (err) {
      console.error('ERROR:', err);
      throw err;
    }
  }

  async updateOne(entity: T) {
    try {
      await this.datastore.update(this._createEntity(entity, this._key(entity.id)));
      return this.findById(entity.id);
    } catch (err) {
      console.error('ERROR:', err);
      throw err;
    }
  }

  async updateMany(entities: T[]) {
    try {
      const updateEntities = entities.map((entity) => {
        const key = this._key(entity.id);
        return this._createEntity(entity, key);
      });
      await this.datastore.update(updateEntities);
      return this.findByIds(entities.map(({ id }) => id));
    } catch (err) {
      console.error('ERROR:', err);
      throw err;
    }
  }

  async deleteOne(entity: T) {
    try {
      entity.deletedAt = Date.now();
      await this.datastore.update(this._createEntity(entity, this._key(entity.id)));
      return this.findById(entity.id);
    } catch (err) {
      console.error('ERROR:', err);
      throw err;
    }
  }

  async deleteMany(entities: T[]) {
    try {
      const now = Date.now();
      const updateEntities = entities.map((entity) => {
        entity.deletedAt = now;
        const key = this._key(entity.id);
        return this._createEntity(entity, key);
      });
      await this.datastore.update(updateEntities);
      return this.findByIds(entities.map(({ id }) => id));
    } catch (err) {
      console.error('ERROR:', err);
      throw err;
    }
  }

  private _key(id?: string) {
    if (id) {
      return this.datastore.key([this.kind, id]);
    }
    return this.datastore.key([this.kind, uuidv1()]);
  }

  private _transformToTargetClass(plain: any) {
    return plainToInstance(this.classTarget, plain, {
      enableImplicitConversion: true,
      groups: [TRANSFORM_GROUPS.viewDto],
    });
  }

  private _createEntity(data: any, key?: Entity.Key) {
    if (!key) {
      key = this._key();
      data.id = key.name;
    }
    return {
      key,
      data: Object.values(
        instanceToPlain(data, {
          groups: [TRANSFORM_GROUPS.datastore],
          exposeUnsetFields: false,
        }),
      ),
    };
  }
}
