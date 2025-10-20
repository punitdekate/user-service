// const getOtp = otp => `<!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <title>Password Reset OTP</title>
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   </head>
//   <body
//     style="
//       margin: 0;
//       padding: 0;
//       background-color: #f0f4f8;
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
//         margin: 40px auto;
//         background-color: #ffffff;
//         border-radius: 10px;
//         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         overflow: hidden;
//       "
//     >
//       <!-- Header -->
//       <tr>
//         <td
//           align="center"
//           bgcolor="#004080"
//           style="padding: 30px 20px; color: #ffffff"
//         >
//           <h1 style="margin: 0; font-size: 24px">Reset Your Password</h1>
//         </td>
//       </tr>

//       <!-- OTP Body -->
//       <tr>
//         <td style="padding: 40px 30px; text-align: center; color: #333333">
//           <p style="font-size: 16px; margin-bottom: 24px">
//             We received a request to reset your password.
//           </p>

//           <p
//             style="
//               font-size: 20px;
//               font-weight: bold;
//               color: #004080;
//               margin: 0;
//             "
//           >
//             Your OTP Code:
//           </p>
//           <div
//             style="
//               font-size: 32px;
//               font-weight: bold;
//               color: #0077cc;
//               background-color: #f0f8ff;
//               padding: 15px 30px;
//               border-radius: 8px;
//               display: inline-block;
//               letter-spacing: 2px;
//               margin: 16px 0;
//             "
//           >
//             ${otp}
//           </div>

//           <p style="font-size: 15px; margin: 0 0 20px">
//             This OTP is valid for <strong>5 minutes</strong>. If you didn’t make
//             this request, you can safely ignore this email.
//           </p>
//         </td>
//       </tr>

//       <!-- Footer -->
//       <tr>
//         <td
//           bgcolor="#f7f7f7"
//           style="
//             padding: 20px 30px;
//             text-align: center;
//             font-size: 14px;
//             color: #666;
//           "
//         >
//           <p style="margin: 0">
//             Need help? Contact us at
//             <a
//               href="mailto:support@example.com"
//               style="color: #004080; text-decoration: none"
//               >support@example.com</a
//             >
//           </p>
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>
// `;

const getOtp = otp => `
🔐 Ecommerce ACCOUNT VERIFICATION

We received a request to verify your account.

Your One-Time Password (OTP) is:

👉 OTP: ${otp}

This code is valid for the next 10 minutes.
Please do not share this OTP with anyone for security reasons.

If you didn’t request this, please ignore this email or contact our support team immediately at support@example.com.

Warm regards,
The Codenest Team
https://yourwebsite.com

`;

module.exports = getOtp;
