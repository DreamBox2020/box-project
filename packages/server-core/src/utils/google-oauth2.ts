import { GoogleOAuth2 } from '@kazura/googleapis';

export const googleOAuth2 = () =>
  new GoogleOAuth2({
    clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
  });
