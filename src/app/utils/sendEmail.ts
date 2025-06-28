// import sgMail from '@sendgrid/mail';
// import config from '../config';

// export const sendEmail = async (to: string, html: string) => {
//   sgMail.setApiKey(config.sendgrid_api_key as string);

//   const msg = {
//     to,
//     from: 'mdtanvir7462@gmail.com',
//     subject: 'Password Reset Request',
//     text: 'Change your password within 5 minutes',
//     html,
//   };

//   try {
//     await sgMail.send(msg);
//     return msg;
//   } catch (error) {
//     console.log('error is:', error);
//   }
// };
