# Email Setup Instructions for Password Reset System

## Gmail Setup (Recommended for Development)

### Step 1: Create a Dedicated Gmail Account
1. Create a new Gmail account specifically for your application (e.g., `your-app-name@gmail.com`)
2. Enable 2-factor authentication for security

### Step 2: Generate App Password
1. Go to your Google Account settings
2. Navigate to "Security" > "2-Step Verification" (enable if not already)
3. Under "2-Step Verification," find "App passwords"
4. Generate a new app password for "Mail"
5. Copy the generated 16-character password

### Step 3: Configure Environment Variables
Add the following environment variables to your `.env` file in the backend directory:

```
EMAIL_USER=your-app-name@gmail.com
EMAIL_PASSWORD=your-generated-app-password
EMAIL_FROM=CryptoConnect Support <your-app-name@gmail.com>
EMAIL_SERVICE=gmail
FRONTEND_URL=http://localhost:3000
```

### Step 4: Test the Configuration
1. Restart your backend server
2. Test the password reset functionality
3. Check the console logs for email sending status

## Alternative Email Services

### SendGrid (Recommended for Production)
1. Create a SendGrid account
2. Verify your domain or single sender
3. Get your API key
4. Update environment variables:
```
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=your-verified-email@yourdomain.com
```

### Mailgun
1. Create a Mailgun account
2. Verify your domain
3. Get your API credentials
4. Update environment variables:
```
EMAIL_SERVICE=mailgun
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_USER` | Email service username | `your-app@gmail.com` or `apikey` |
| `EMAIL_PASSWORD` | Email service password/API key | `your-app-password` |
| `EMAIL_FROM` | Sender email address | `Support <support@yourdomain.com>` |
| `EMAIL_SERVICE` | Email service provider | `gmail`, `sendgrid`, `mailgun` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |

## Testing Without Real Email

For development, the system will work in mock mode without email credentials:
- Emails are logged to console instead of being sent
- Reset tokens are generated and stored normally
- Password reset functionality works end-to-end

## Security Notes

1. **Never commit your email credentials** to version control
2. Use environment variables for all sensitive data
3. Consider using a dedicated email service for production
4. Regularly rotate your app passwords/API keys
5. Monitor email sending limits and quotas

## Troubleshooting

### Common Issues:
1. **Authentication failed**: Check your app password is correct
2. **Rate limiting**: Wait before sending multiple emails
3. **SPF/DKIM issues**: Properly configure your domain's email authentication
4. **Email in spam**: Ensure proper email content and authentication

### Gmail Specific:
- Make sure "Less secure app access" is NOT enabled (use app passwords instead)
- Check that 2-factor authentication is enabled
- Verify the app password was generated for "Mail" specifically

For production deployment, consider using a transactional email service like SendGrid, Mailgun, or Amazon SES for better deliverability and scalability.
