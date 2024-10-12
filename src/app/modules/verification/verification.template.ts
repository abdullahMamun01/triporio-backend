const emailOtpTemplate = (otp: string) => {
  return `<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td style="padding: 20px 0; text-align: center; background-color: #3498db;">
                Triporio
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td style="padding-bottom: 20px; text-align: center;">
                            <h1 style="margin: 0; font-size: 24px; color: #333333;">Your One-Time Password (OTP)</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px; text-align: center;">
                            <p style="margin: 0; font-size: 16px; color: #666666;">Use the following OTP to complete your action:</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 30px; text-align: center;">
                            <div style="display: inline-block; padding: 15px 30px; font-size: 36px; font-weight: bold; color: #ffffff; background-color: #3498db; border-radius: 5px;">
                                ${otp}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="margin: 0; font-size: 16px; color: #666666;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="margin: 0; font-size: 16px; color: #666666;">If you didn't request this OTP, please ignore this email or contact our support team.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 30px; background-color: #f0f0f0; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #888888;">© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #888888;">
                    <a href="#" style="color: #3498db; text-decoration: none;">Privacy Policy</a> | 
                    <a href="#" style="color: #3498db; text-decoration: none;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</body>`;
};

export { emailOtpTemplate };
