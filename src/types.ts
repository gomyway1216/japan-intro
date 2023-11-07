import { Timestamp } from 'firebase/firestore';
import { ReactNode } from 'react';

// Interface that stores the post object to be displayed on the page
export interface Post {
  id: string;
  title: string;
  body: string;
  isPublic: boolean;
  created: Date;
  lastUpdated: Date;
  category: string;
  image: string | undefined;
}

export interface PostListItemProps extends Post {
  handleClick: (id: string, category: string) => void;
};

export interface PartialPost {
  id: string;
  title: string;
  body: string;
  created: Date;
  lastUpdated: Date;
  category: string;
}

// Interface that stores the post data stored in Firestore
export interface FirestorePost {
  title: string;
  body: string;
  isPublic: boolean;
  created: Timestamp;
  lastUpdated: Timestamp;
  image: string | undefined;
}

export interface ParamTypes {
  id: string;
}

export interface PostEditorProps {
  postId: string | undefined;
  category: string | undefined;
  getPost: (id: string, category: string) => Promise<Post | null>;
  createPost: (post: Post) => Promise<string>;
  updatePost: (post: Post) => Promise<void>;
  deletePost: (id: string, category: string) => Promise<boolean>;
}

export interface RichTextEditorProps {
  postId: string | undefined;
  category: string | undefined;
  getPost: (id: string, category: string) => Promise<Post | null>;
  createPost: (post: Post) => Promise<string>;
  updatePost: (post: Post) => Promise<void>;
  deletePost: (id: string, category: string) => Promise<boolean>;
}

export interface InstantMessageProps {
  message: string,
  onClose: () => void,
}

export interface RichTextDisplayProps {
  post: Post;
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
    category: string;
  }>;
  togglePublish: (id: string, category: string, isPublic: boolean) => Promise<boolean>;
  deleteData: (id: string, category: string) => Promise<boolean>;
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
export interface ImageUploadProps {
  originalImageUrl: string | undefined;
  handleImageUrl: (url: string) => void;
}

export interface Filters {
  category?: string;
  isPublic?: boolean;
  [key: string]: string | number | boolean | undefined;  // other possible filters
}

export interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}