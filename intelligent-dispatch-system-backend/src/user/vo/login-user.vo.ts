interface UserInfo {
  id: number;
  username: string;
  email: string;
  headPic: string;
  phoneNumber: string;
  createTime: Date;
  updateTime: Date;
}

export class LoginUserVO {
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}
