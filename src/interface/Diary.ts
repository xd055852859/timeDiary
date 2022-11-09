import { Person, User } from "./User";
export interface Diary {
  _key: string;
  title?: string;
  summary?: string;
  cover?: string;
  content?: any;
  userKey: string;
  createTime: string;
  storyTime: string;
  isPublic: boolean;
  shareTo: string[];
  diaryDate?: number[];
  dateShow?: boolean;
  diaryDateText?: string;
  weather?: string;
  location?: string;
  imageList?: string[];
  sharers?: {
    userAvatar: string;
    userName: string;
    _key: string;
    hasRead: boolean;
  }[];
}
export interface Comment {
  cardKey: string;
  content: string;
  createTime: number;
  creatorInfo: User;
  userKey: string;
  _key: string;
  targetCommentKey: null | string;
  targetContent: null | string;
  targetUser: null | string;
  targetUserInfo: null | User;
}
