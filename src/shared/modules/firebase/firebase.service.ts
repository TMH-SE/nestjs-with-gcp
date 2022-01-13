import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  App,
  applicationDefault,
  cert,
  initializeApp,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { EnvironmentConfig } from 'src/config/env.configuration';

@Injectable()
export class FirebaseService {
  private readonly app: App;
  constructor(
    @Inject(EnvironmentConfig.KEY)
    private readonly env: ConfigType<typeof EnvironmentConfig>,
  ) {
    if (!this.app) {
      const nodeEnv = this.env.nodeEnv;
      if (nodeEnv === 'local') {
        this.app = initializeApp({
          credential: cert('serviceAccountKey.json'),
        });
      } else {
        this.app = initializeApp({
          credential: applicationDefault(),
        });
      }
    }
  }

  get firestore() {
    return getFirestore(this.app);
  }
}
