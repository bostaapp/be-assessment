import sgMail from '@sendgrid/mail';

import { SENDGRID_CONFIG } from '../config/config';

export const sendEmail = async (to: MailPerson, from: MailPerson, subject: string, html: string): Promise<any> => {
  sgMail.setApiKey(SENDGRID_CONFIG.apiKey);

  const sendMailData: sgMail.MailDataRequired = {
    to,
    from,
    subject,
    html,
  };
  return sgMail.send(sendMailData);
};
