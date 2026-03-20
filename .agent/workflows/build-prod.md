---
description: Build and Deploy the Application for Multi-Platform
---

To build the application for multiple platforms (Web, Android, iOS via PWA):

1. **Test the build locally**:
// turbo
```powershell
npm run build
```

2. **Verify PWA Assets**:
Ensure `pwa-192x192.png` and `pwa-512x512.png` exist in `public/`.

3. **Deploy to Preview (e.g. Vercel/Netlify)**:
Use the standard deployment commands for your hosting provider.

4. **Install on Mobile**:
- **Android**: Open URL in Chrome -> Add to Home Screen.
- **iOS**: Open URL in Safari -> Share -> Add to Home Screen.
