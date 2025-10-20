// const registeredUser = user => `<!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <title>Welcome Email</title>
//   </head>
//   <body
//     style="
//       margin: 0;
//       padding: 0;
//       background-color: #f9f9f9;
//       font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//     "
//   >
//     <table
//       width="100%"
//       cellpadding="0"
//       cellspacing="0"
//       border="0"
//       style="
//         max-width: 500px;
//         margin: 0 auto;
//         background-color: #ffffff;
//         border-radius: 10px;
//         box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//         overflow: hidden;
//       "
//     >
//       <!-- Header -->
//       <tr>
//         <td align="center" bgcolor="#084078" style="padding: 25px">
//           <h1 style="color: #ffffff; margin: 0; font-size: 26px">
//             🎉 Welcome To Codenest!
//           </h1>
//         </td>
//       </tr>

//       <!-- Body Content -->
//       <tr>
//         <td style="padding: 30px 40px; color: #333333; text-align: center">
//           <p style="font-size: 18px; margin-bottom: 20px">
//             Hello <strong>${user.name}</strong>,
//           </p>
//           <p style="font-size: 16px; margin-bottom: 20px">
//             Thank you for registering with us. Your account has been
//             successfully created!
//           </p>
//           <p style="font-size: 16px; margin-bottom: 30px">
//             Click below to log in and start exploring our services.
//           </p>
//           <a
//             href="https://yourwebsite.com/login"
//             target="_blank"
//             style="
//               display: inline-block;
//               background-color: #28a745;
//               color: #ffffff;
//               padding: 12px 28px;
//               text-decoration: none;
//               font-size: 16px;
//               border-radius: 5px;
//             "
//             >Login to Account</a
//           >
//         </td>
//       </tr>

//       <!-- Footer -->
//       <tr>
//         <td bgcolor="#f1f1f1" style="padding: 20px 30px; text-align: center">
//           <p style="margin: 0; font-size: 14px; color: #555">
//             Need help? Contact our support at
//             <a
//               href="mailto:support@example.com"
//               style="color: #6a5acd; text-decoration: none"
//               >support@example.com</a
//             >
//           </p>
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>`;

const registeredUser = user => `
🎉 WELCOME TO Ecommerce!

Hello ${user.name},

Thank you for registering with us. Your account has been successfully created!

Click below to log in and start exploring our services:

👉 Login to your account: https://yourwebsite.com/login

Need help? Contact our support team at support@example.com

Warm regards,
The Codenest Team
`;

module.exports = registeredUser;
