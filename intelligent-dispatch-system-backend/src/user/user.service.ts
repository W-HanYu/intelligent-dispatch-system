import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVO } from './vo/login-user.vo';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject(RedisService)
  private redisService: RedisService;

  async initData() {
    const user1 = new User();
    user1.username = 'taotao';
    user1.password = md5('taotao');
    user1.email = '1453300745@qq.com';
    user1.phoneNumber = '13289529920';

    const user2 = new User();
    user2.username = 'nannan';
    user2.password = md5('nannan');
    user2.email = 'wangtao1629626@163.com';
    user2.phoneNumber = '13259626265';

    await this.userRepository.save([user1, user2]);
  }

  async register(user: RegisterUserDto) {
    console.log('user.email', user.email);
    const captcha = await this.redisService.get(`captcha_${user.email}`);
    console.log('captcha', captcha);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    // newUser.nickname = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return 'register success';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'register failed';
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
      },
    });

    if (!user) {
      throw new HttpException(
        'This user is not registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVO();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      headPic: user.headPic,
      createTime: user.createTime,
      updateTime: user.updateTime,
    };

    return vo;
  }

  async findUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return {
      id: user.id,
      username: user.username,
      // email: user.email,
      // phoneNumber: user.phoneNumber,
      // createTime: user.createTime,
    };
  }
}
