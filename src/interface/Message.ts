export interface Message {
  _key: string;
  createTime: number;
  fromUserInfo: { userAvatar: string; userName: string; _key: string };
  log: string;
  needReply: number;
  status: number;
  type: string;
}
