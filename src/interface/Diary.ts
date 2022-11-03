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
}
