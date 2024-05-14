import { Controller, Get, Post, Body, Inject, Query } from '@nestjs/common';
import { UserService } from './user.service';

import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { requireLogin } from 'src/custom.decorator';

@Controller('user')
@requireLogin()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  /**
   * 生成访问令牌
   * @param user 用户信息
   */
  private async generateAccessToken(
    user: Omit<User, 'password'>,
  ): Promise<string> {
    return this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
  }

  /**
   * 生成刷新令牌
   * @param user 用户信息
   */
  private async generateRefreshToken(
    user: Omit<User, 'password'>,
  ): Promise<string> {
    return this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 60 * 5);
    await this.emailService.sendMail({
      to: address,
      subject: '用户注册验证码',
      html: `<p>你的注册验证码是 <b> ${code}</b></p>`,
    });

    return 'send success';
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const vo = await this.userService.login(loginUserDto);
    vo.accessToken = await this.generateAccessToken(vo.userInfo);
    vo.refreshToken = await this.generateRefreshToken(vo.userInfo);
    return vo;
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId);
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expires_time') || '30m',
        },
      );
      return {
        access_token,
        refresh_token,
      };
    } catch (e) {}
  }

  //初始化数据
  @Get('init_data')
  async initData() {
    await this.userService.initData();
    return 'init_data success';
  }
}
