# Email Troubleshooting Guide

## Problem: OTP Email Not Arriving

The backend logs show "OTP email sent successfully" but the email is not in your inbox.

### Common Causes:

#### 1. **Incorrect Gmail App Password** (Most Common)
Gmail app passwords have **16 characters** and show with spaces for readability:
- **Display format**: `vsxu eryr jvnu ojhi`
- **Actual format**: `vsxueryrjvnuojhi` (NO SPACES)

✅ **Fix**: Update `application.properties`:
```properties
spring.mail.password=vsxueryrjvnuojhi
```

#### 2. **2FA Not Enabled**
If 2FA is NOT enabled on your Gmail account, you may need to enable "Less Secure Apps".

✅ **Steps**:
1. Go to https://myaccount.google.com/
2. Click "Security" in the left menu
3. Enable "2-Step Verification" (if not already enabled)
4. Create an App Password:
   - Go back to Security
   - Select "App passwords"
   - Choose Mail and Windows Computer
   - Copy the 16-character password (remove spaces)

#### 3. **Email in Spam/Trash**
Check your Gmail spam and trash folders for the OTP email.

#### 4. **Firewall/Network Issue**
Port 587 (SMTP with TLS) might be blocked.

### Troubleshooting Steps:

**Step 1**: Remove spaces from password
```properties
# WRONG:
spring.mail.password=vsxu eryr jvnu ojhi

# CORRECT:
spring.mail.password=vsxueryrjvnuojhi
```

**Step 2**: Rebuild and restart backend
```bash
cd e:\final_project\AI-Gym-Trainer\backend
mvn clean install
mvn spring-boot:run
```

**Step 3**: Try sending OTP again
- Go to login page → "Forgot password?"
- Enter email and check logs

**Step 4**: Check logs for SMTP errors
Look for lines like:
```
DEBUG com.sun.mail.smtp
```

### SMTP Configuration Verified ✅

Current setup in `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=sauravkumar973532@gmail.com
spring.mail.password=vsxueryrjvnuojhi  # (NO SPACES)
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.debug=true
```

### If Still Not Working:

**Option 1**: Generate new App Password
1. https://myaccount.google.com/security
2. App passwords
3. Generate new 16-char password
4. Update `application.properties`

**Option 2**: Use Less Secure App Access (if 2FA not used)
1. https://myaccount.google.com/security
2. "Less secure app access" → ON
3. Use regular Gmail password

**Option 3**: Test with simple email first
Add this to check if SMTP connection works at all.

## Email Service Architecture:

1. **Frontend**: User enters email → Calls `/api/users/forgot-password`
2. **Backend**: Generates 6-digit OTP → Saves to DB → Calls EmailService
3. **EmailService**: Connects to Gmail SMTP → Sends HTML email
4. **Gmail**: Should receive and route to user's inbox

## What the Logs Should Show:

✅ **Success path:**
```
Processing forgot password request for email: sauravkumar973532@gmail.com
Generated OTP for user sauravkumar973532@gmail.com: XXXXXX
OTP saved to database with 1 minute expiry for user: sauravkumar973532@gmail.com
Sending OTP email to: sauravkumar973532@gmail.com
Attempting to send OTP email to: sauravkumar973532@gmail.com
OTP email sent successfully to: sauravkumar973532@gmail.com
```

❌ **Error path** (would show exception details)

## Next Steps:

1. **Fix password** (remove spaces) ← DO THIS FIRST
2. Rebuild backend
3. Test again
4. Check Gmail inbox and spam folder
5. If still failing, share the full SMTP error logs
