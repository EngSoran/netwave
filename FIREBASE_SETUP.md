# Firebase Setup Guide

## 🔥 Firebase Permissions Error Fix

You're seeing: **"Missing or insufficient permissions"**

This means your Firestore security rules need to be updated.

---

## 🛠️ **Quick Fix: Update Firestore Security Rules**

### **Option 1: Allow Read Access (Recommended for Development)**

Go to [Firebase Console](https://console.firebase.google.com/) → Firestore Database → Rules

Replace your rules with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Services - Public read, admin write
    match /services/{serviceId} {
      allow read: if true;  // Anyone can read services
      allow write: if request.auth != null &&
                      request.auth.token.email in [
                        'engineersoran1@gmail.com'
                        // Add more admin emails here
                      ];
    }

    // Bookings - Authenticated users can create, admins can read/update
    match /bookings/{bookingId} {
      allow create: if request.auth != null;  // Logged-in users can create bookings
      allow read, update: if request.auth != null &&
                             request.auth.token.email in [
                               'engineersoran1@gmail.com'
                               // Add more admin emails here
                             ];
    }
  }
}
```

### **Option 2: Open Access (ONLY for Development/Testing)**

⚠️ **WARNING: This is insecure! Only use temporarily for testing**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ⚠️ INSECURE - Anyone can read/write
    }
  }
}
```

---

## 🔒 **Production-Ready Security Rules**

For production, use these more secure rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.email in [
               'engineersoran1@gmail.com'
               // Add more admin emails
             ];
    }

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Services Collection
    match /services/{serviceId} {
      // Anyone can read services (public)
      allow read: if true;

      // Only admins can create, update, delete services
      allow create, update, delete: if isAdmin();
    }

    // Bookings Collection
    match /bookings/{bookingId} {
      // Users can create their own bookings
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid;

      // Users can read their own bookings
      allow read: if isAuthenticated() &&
                     (resource.data.userId == request.auth.uid || isAdmin());

      // Only admins can update/delete bookings
      allow update, delete: if isAdmin();
    }

    // Users Collection (if you add one later)
    match /users/{userId} {
      // Users can read/write their own data
      allow read, write: if isAuthenticated() && userId == request.auth.uid;

      // Admins can read all user data
      allow read: if isAdmin();
    }
  }
}
```

---

## 📋 **How to Apply Rules**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **netwave-53c33**
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab
5. Paste the rules above
6. Click **Publish**

---

## ✅ **Test Your Rules**

After publishing rules, test:

1. **Public Access Test:**
   - Visit your homepage (should load services)
   - Click on a service (should load service details)

2. **Authenticated Access Test:**
   - Log in with Google
   - Try to create a booking (should work)

3. **Admin Access Test:**
   - Log in as `engineersoran1@gmail.com`
   - Go to `/admin` (should work)
   - Try adding/editing/deleting services (should work)

---

## 🔑 **Admin Emails Management**

Currently, admin emails are hardcoded in two places:

1. **Firestore Rules:** (shown above)
2. **Frontend Code:** `src/lib/admins.ts`

To add a new admin:

1. Update Firestore rules (add email to the list)
2. Update `src/lib/admins.ts`:
   ```typescript
   export const ADMIN_EMAILS = [
     "engineersoran1@gmail.com",
     "newadmin@gmail.com",  // Add here
   ];
   ```

---

## 🚨 **Common Errors & Solutions**

### Error: "Missing or insufficient permissions"
**Solution:** Update Firestore security rules (see above)

### Error: "Permission denied"
**Solution:**
- Make sure you're logged in
- Check that your email is in the admin list
- Verify Firestore rules are published

### Error: "auth/user-not-found"
**Solution:** Enable Google Authentication in Firebase Console

---

## 📖 **Learn More**

- [Firestore Security Rules Docs](https://firebase.google.com/docs/firestore/security/get-started)
- [Common Security Rule Patterns](https://firebase.google.com/docs/firestore/security/rules-conditions)

---

**After updating rules, refresh your app and it should work!** ✅
