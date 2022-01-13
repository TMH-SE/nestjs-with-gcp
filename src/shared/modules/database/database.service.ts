import { Injectable } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { TRANSFORM_GROUPS } from 'src/shared/constants/transform-options.constant';
import FirestoreCollection from 'src/shared/enums/firestore-collection.enum';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class DatabaseService {
  constructor(private readonly firebase: FirebaseService) {}

  getRepository<T>(
    collectionPath: FirestoreCollection,
    EntityTarget: ClassConstructor<T>,
  ) {
    const db = this.firebase.firestore;
    db.settings({
      ignoreUndefinedProperties: true,
    });
    return db.collection(collectionPath).withConverter({
      toFirestore: (data: T): DocumentData => {
        return Object.assign({}, data);
      },
      fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
        const id = snapshot.id;
        const data = snapshot.data();
        return plainToInstance(
          EntityTarget,
          { id, ...data },
          {
            enableImplicitConversion: true,
            groups: [TRANSFORM_GROUPS.viewDto],
          },
        );
      },
    });
  }
}
