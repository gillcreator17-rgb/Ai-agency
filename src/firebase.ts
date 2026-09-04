import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { ServiceInquiry, SavedModel, UserProfile } from './types';

// Initialize Firebase app safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Must use firebaseConfig.firestoreDatabaseId as instructed
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection on boot as required by Firebase skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    return false;
  }
}

// Google Sign-In using popup
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Sync or create user profile document
    if (result.user) {
      const userRef = doc(db, 'users', result.user.uid);
      const userProfile: UserProfile = {
        userId: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || 'Client',
        photoURL: result.user.photoURL || '',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, userProfile, { merge: true });
    }
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  await fbSignOut(auth);
}

// Service Inquiry Firestore Operations
export async function saveServiceInquiry(inquiry: ServiceInquiry): Promise<void> {
  if (!auth.currentUser) throw new Error('User must be signed in to submit an inquiry.');
  const inquiryPath = `users/${auth.currentUser.uid}/inquiries/${inquiry.id}`;
  try {
    const ref = doc(db, 'users', auth.currentUser.uid, 'inquiries', inquiry.id);
    await setDoc(ref, inquiry);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, inquiryPath);
  }
}

export function subscribeToUserInquiries(
  userId: string,
  onData: (inquiries: ServiceInquiry[]) => void,
  onError?: (err: any) => void
) {
  const collectionPath = `users/${userId}/inquiries`;
  try {
    const q = query(collection(db, 'users', userId, 'inquiries'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => d.data() as ServiceInquiry);
        // sort by newest
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
    return () => {};
  }
}

// Saved Chatbot Models Favorites Operations
export async function toggleSaveModel(model: { id: string; name: string; category: string; price: number }): Promise<boolean> {
  if (!auth.currentUser) throw new Error('User must be signed in to bookmark models.');
  const userId = auth.currentUser.uid;
  const docPath = `users/${userId}/savedModels/${model.id}`;
  const ref = doc(db, 'users', userId, 'savedModels', model.id);

  try {
    const savedRecord: SavedModel = {
      id: model.id,
      userId,
      modelId: model.id,
      modelName: model.name,
      category: model.category,
      priceMonthly: model.price,
      savedAt: new Date().toISOString(),
    };
    await setDoc(ref, savedRecord);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    return false;
  }
}

export async function removeSavedModel(modelId: string): Promise<void> {
  if (!auth.currentUser) return;
  const userId = auth.currentUser.uid;
  const docPath = `users/${userId}/savedModels/${modelId}`;
  try {
    const ref = doc(db, 'users', userId, 'savedModels', modelId);
    await deleteDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export function subscribeToSavedModels(
  userId: string,
  onData: (models: SavedModel[]) => void,
  onError?: (err: any) => void
) {
  const collectionPath = `users/${userId}/savedModels`;
  try {
    const q = query(collection(db, 'users', userId, 'savedModels'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => d.data() as SavedModel);
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
    return () => {};
  }
}
