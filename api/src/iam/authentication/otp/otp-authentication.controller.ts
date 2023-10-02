import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { ActiveUser } from '../../decorators/active-user.decorator';
import { ActiveUserData } from '../../interface/active-user-data.interface';
import { Auth } from '../decorators/auth.decorator';
import { FPHash } from '../decorators/fingerprint-hash.decorator';
import { Enable2faDto } from '../dto/enable-2fa.dto';
import { Provide2faCodeDto } from '../dto/provide-2fa-code.dto';
import { AuthType } from '../enum/auth-type.enum';
import { OtpAuthenticationService } from './otp-authentication.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CookiesService } from '../cookies.service';

@ApiBearerAuth()
@ApiTags('2fa')
@Controller('authentication/2fa')
export class OtpAuthenticationController {
  constructor(
    private readonly otpAuthService: OtpAuthenticationService,
    private readonly cookiesService: CookiesService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() response: Response,
  ) {
    const { uri } = await this.otpAuthService.generateSecret(activeUser);
    response.type('png');
    return toFileStream(response, uri);
  }

  @HttpCode(HttpStatus.OK)
  @Post('enable')
  async enable2FA(
    @FPHash() fingerPrintHash: string,
    @ActiveUser() activeUser: ActiveUserData,
    @Body() enable2faDto: Enable2faDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.otpAuthService.enableTfaForUser(activeUser, {
      code: enable2faDto.tfaCode,
      fpHash: fingerPrintHash,
    });
    this.cookiesService.setCookies(response, tokens);
    return { success: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('disable')
  async disable2FA(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() disable2faDto: Enable2faDto,
  ) {
    return this.otpAuthService.disableTfaForUser(
      activeUser,
      disable2faDto.tfaCode,
    );
  }

  @Auth(AuthType.BearerWithou2fa)
  @HttpCode(HttpStatus.OK)
  @Post('code')
  async provide2faCode(
    @FPHash() fingerPrintHash: string,
    @ActiveUser() activeUser: ActiveUserData,
    @Body() provide2faCodeDto: Provide2faCodeDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.otpAuthService.provide2faCode(
      activeUser,
      provide2faCodeDto,
      fingerPrintHash,
    );
    this.cookiesService.setCookies(response, tokens);
    return { success: true };
  }
}
