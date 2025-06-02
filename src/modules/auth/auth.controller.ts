import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthLoginDto,
  CreateAuthRegisterDto,
} from './dto/create-auth.dto';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() createAuthRegisterDto: CreateAuthRegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token } = await this.authService.register(createAuthRegisterDto);
    console.log(token);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1.1 * 60 * 60 * 1000, // ~1 hour
      secure: true,
      sameSite: 'strict',
    });

    return token;
  }

  @Public()
  @Post('login')
  async login(
    @Body() createAuthLoginDto: CreateAuthLoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const message = await this.authService.login(createAuthLoginDto);

    res.cookie('token', message.token, {
      httpOnly: true,
      maxAge: 1.1 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'strict',
    });

    return message;
  }

  // @Post(':id')
  // forgotPassword(@Param('id') id: string) {
  //   return this.authService.forgotPassword(+id);
  // }

  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = req.userId;
    console.log(`User #${userId} logged out`);

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { message: 'Successfully logged out' };
  }
}
