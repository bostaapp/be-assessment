import { getAuth } from 'firebase-admin/auth';

export const createUser = async (firebaseUser: ICreateFirebaseUser): Promise<Record<string, any>> => {
  const { email, password } = firebaseUser;
  const { uid } = await getAuth().createUser({
    email,
    password,
    emailVerified: false,
  });

  const link = await getAuth().generateEmailVerificationLink(email);
  return { uid, link };
};
