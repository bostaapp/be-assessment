import { initializeApp, cert } from 'firebase-admin/app';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';

import { FIREBASE_CONFIG } from '../config/config';

export const firebaseApp = initializeApp({
  credential: cert({
    projectId: FIREBASE_CONFIG.projectId,
    clientEmail: FIREBASE_CONFIG.clientEmail,
    privateKey: FIREBASE_CONFIG.privateKey.replace(/\\n/g, '\n'),
  }),
});

export const verifyAuthoken = (token: string): Promise<DecodedIdToken> => {
  return getAuth(firebaseApp).verifyIdToken(token);
};
