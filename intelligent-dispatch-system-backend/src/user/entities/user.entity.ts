import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  // @Column({
  //   length: 50,
  //   comment: '昵称',
  // })
  // nickname: string;
  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    comment: '邮箱',
    length: 50,
  })
  email: string;

  @Column({
    comment: '头像',
    length: 100,
    nullable: true,
  })
  headPic: string;

  @Column({
    comment: '手机号',
    length: 20,
    nullable: true,
  })
  phoneNumber: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
