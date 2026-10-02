Only For You Mausam ❤️.

## Password Recovery Email

Password reset emails use the Resend API. Configure these server environment variables with a verified sender address before deploying:

```env
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=ShowCase Shops <no-reply@your-verified-domain.com>
```

In development, when these variables are not set, the reset URL is written to the server console for local testing. It is never returned by the reset request to the browser.
