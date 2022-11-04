export interface Mate {
  _key: string;
  cardNum: number;
  createTime: number;
  deadline?: number;
  stopShare?: number;
  userAvatar: string;
  userName: string;
}
export interface Friend extends Mate {
  unReadNum?: number;
}
