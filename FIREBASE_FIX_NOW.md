# 🔥 Fix Firebase Permissions - STEP BY STEP

## ⚡ Quick Fix (2 Minutes)

### **Step 1: Open Firebase Console**
1. Go to: https://console.firebase.google.com/
2. Click on your project: **netwave-53c33**

### **Step 2: Navigate to Firestore Rules**
1. In the left sidebar, click **"Firestore Database"**
2. Click the **"Rules"** tab at the top

### **Step 3: Copy the Rules**
I've created the file `firestore.rules` in your project.

**Copy this exact code:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.email in [
               'engineersoran1@gmail.com'
             ];
    }

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Services Collection - Public read, admin write
    match /services/{serviceId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Bookings Collection
    match /bookings/{bookingId} {
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() &&
                     (resource.data.userId == request.auth.uid || isAdmin());
      allow update, delete: if isAdmin();
    }

    // Users Collection (future use)
    match /users/{userId} {
      allow read, write: if isAuthenticated() && userId == request.auth.uid;
      allow read: if isAdmin();
    }
  }
}
```

### **Step 4: Paste and Publish**
1. **DELETE** all existing rules in the Firebase console
2. **PASTE** the rules above
3. Click **"Publish"** button (top right)
4. Wait for confirmation message

### **Step 5: Test Your App**
1. Refresh your website
2. The Firebase permissions error should be gone! ✅

---

## 📋 What These Rules Do

### ✅ **Services (Your Network Services)**
- **Public Read:** Anyone can view services on your website
- **Admin Only Write:** Only you can add/edit/delete services

### ✅ **Bookings (Customer Requests)**
- **Authenticated Create:** Logged-in users can create bookings
- **Owner/Admin Read:** Users see their own bookings, you see all
- **Admin Only Update:** Only you can update booking status

### ✅ **Security**
- ✅ Public can browse services without login
- ✅ Users must log in to book
- ✅ Only admin can manage everything
- ✅ Users can't see each other's bookings

---

## 🚨 Troubleshooting

### Still seeing "Permission denied"?

**Check:**
1. Did you click "Publish" in Firebase Console?
2. Did you hard refresh your browser (Ctrl+Shift+R)?
3. Is your email `engineersoran1@gmail.com` logged in?

### Need to add another admin?

Edit the rules and add more emails:
```javascript
function isAdmin() {
  return request.auth != null &&
         request.auth.token.email in [
           'engineersoran1@gmail.com',
           'another-admin@gmail.com',  // Add here
           'third-admin@gmail.com'      // Add here
         ];
}
```

---

## ✅ After Publishing Rules

Your app will have:
- ✅ Working homepage with services
- ✅ Working service detail pages
- ✅ Working booking form (for logged-in users)
- ✅ Working admin panel (for you)
- ✅ No more Firebase errors!

---

**That's it! Your Firebase is now properly configured.** 🎉

Run your app:
```bash
npm run dev
```

Open: http://localhost:9002

Everything should work now! ✨
