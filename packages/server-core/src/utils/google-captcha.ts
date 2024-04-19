import { GoogleCaptcha } from '@kazura/googleapis';

export const googleCaptcha = () =>
  new GoogleCaptcha(process.env.GOOGLE_RECAPTCHA_SECRET);
