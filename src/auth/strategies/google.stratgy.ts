import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { GoogleUserDto } from "../dtos/google-user.dto";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super(
      {
        clientID: configService.get('GOOGLE_CLIENT_ID'),
        clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
        callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
        scope: ['email', 'profile']
      }
    );
  }

  async validate(_accessToken: string, _refreshToken: string,
                 profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails } = profile;
    const user: GoogleUserDto = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      emailConfirmed: true
    }
    done(null, user)
  }
}