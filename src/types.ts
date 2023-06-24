import { Timestamp } from 'firebase/firestore';
import { ReactNode } from 'react';

export interface Post {
  id: string;
  title: string;
  body: string;
  isPublic: boolean;
  created: Date;
  lastUpdated: Date;
}

export interface FirestorePost {
  id: string;
  title: string;
  body: string;
  isPublic: boolean;
  created: Timestamp;
  lastUpdated: Timestamp;
}

export interface ParamTypes {
  id: string;
}

export interface RichTextEditorProps {
  id: string;
  getDoc: (id: string) => Promise<Post | null>;
  updateDoc: (item: Post) => Promise<void>;
  deleteDoc: (id: string) => Promise<boolean>;
}

export interface InstantMessageProps {
  message: string,
  onClose: () => void,
}

export interface RichTextDisplayProps {
  getApi: (id: string) => Promise<{ title: string, created: string, body: string }>;
}

export interface RichTextEditingData {
  title: string;
  created: string;
  body: string;
}

export interface DataTableProps {
  data: Array<{
    id: string;
    title: string;
    created: Date;
    lastUpdated: Date;
    isPublic: boolean;
  }>;
  togglePublish: (id: string, isPublic: boolean) => Promise<boolean>;
  deleteData: (id: string) => Promise<boolean>;
  editLink: string;
}

export interface DeleteItemDialogProps {
  open: boolean;
  onClose: () => void;
  callback: () => void;
  errorMessage: string;
}

export interface AdminSignInInput {
  email: string;
  password: string;
}

export interface TabPanelProps {
  children: React.ReactNode,
  index: number,
  value: number
}

export interface IUser {
  email: string;
  uid: string;
}

export interface AuthProviderProps {
  children: ReactNode;
}