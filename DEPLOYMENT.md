# Deployment guide — Shopping Cart

App identifiers and version for the first store release:

| Platform | ID | Version |
|---|---|---|
| Android | `com.smartshoppingcart` | `1.0.0` (versionCode `1`) |
| iOS | `com.smartshoppingcart` | `1.0.0` (build `1`) |

Display name on both platforms: **Shopping Cart**

---

## Google Play — minimum upload checklist

### A. Account & policy (Play Console)

- [ ] Create / pay for a [Google Play Developer account](https://play.google.com/console) ($25 one-time)
- [ ] Complete Play Console account identity verification if prompted
- [ ] Create the app with package name **`com.smartshoppingcart`** (cannot change later)
- [ ] Host a **privacy policy** on a public HTTPS URL (required for Data safety)
- [ ] Add that URL in Store listing **and** App content → Privacy policy

### B. Signing & build (local)

- [ ] Generate upload keystore + `keystore.properties` (see §1.1) — **not in repo yet**
- [ ] Confirm release is **not** using `debug.keystore`
- [ ] Build `bundleRelease` → `.aab` (see §1.2)
- [ ] Install release build on a real device and smoke-test before upload

### C. Store listing assets

| Asset | Required? | Spec | Status in this repo |
|---|---|---|---|
| High-res icon | Yes | 512×512 PNG | ✅ `assets/store/playstore.png` |
| Feature graphic | Yes | **1024×500** JPEG/PNG (no alpha) | ❌ **missing — create this** |
| Phone screenshots | Yes | Min **2** (recommend 4+ at ≥1080px) | ❌ **missing — capture from device** |
| Short description | Yes | ≤80 characters | ❌ write in Play Console |
| Full description | Yes | ≤4000 characters | ❌ write in Play Console |
| App category / tags | Yes | e.g. Finance / Productivity | ❌ set in Play Console |
| Contact email | Yes | Store listing | ❌ set in Play Console |
| Support URL / website | Recommended | Public page | ❌ optional but useful |

### D. App content declarations (Play Console → App content)

- [ ] **Privacy policy** URL
- [ ] **Data safety** form (this app: no data collected/shared; data stays on device)
- [ ] **Content rating** questionnaire
- [ ] **Target audience** (and Children policy if applicable — usually “not primarily for children”)
- [ ] **Ads** declaration → **No** (app has no ads)
- [ ] Other App content items shown for your account (News, COVID, Government, Financial features, etc.) → answer as applicable; most are **No** for this app

### E. Release & review

- [ ] Prefer **Internal testing** first, then Production
- [ ] Enable **Play App Signing** when prompted (required for new apps)
- [ ] Upload `.aab`, add release notes
- [ ] Complete countries / pricing
- [ ] Submit for review

### Files still missing before you can finish the listing

1. `android/app/upload-keystore.jks` — run `./scripts/generate-android-keystore.sh`
2. `android/keystore.properties` — created by that script (gitignored)
3. **Feature graphic** `1024×500` — not in the repo (Play blocks publishing without it)
4. **Phone screenshots** — at least 2 (Home, History, create cart, Settings are good candidates)
5. **Hosted privacy policy page** — draft is in `docs/privacy-policy.html`; publish it to get a public HTTPS URL (see below)

### Host the privacy policy (get a Play Console URL)

1. Open `docs/privacy-policy.html` and replace `REPLACE_WITH_YOUR_EMAIL@example.com` with your real support email.
2. Publish the file somewhere public over HTTPS, for example:
   - GitHub Pages
   - Notion / Google Sites (public link)
   - Your own website
3. Paste that HTTPS URL into Play Console → Store listing / App content → Privacy policy.

Example with GitHub Pages (if this repo is on GitHub): enable Pages for the `docs/` folder, then the URL will look like:

`https://YOUR_GITHUB_USERNAME.github.io/ShoppingCart/privacy-policy.html`


---

## 0. Pre-flight checklist

- [ ] Smoke-test create / edit / delete cart flows on a real device
- [ ] Check History date range + Load more
- [ ] Switch language and currency in Settings
- [ ] Confirm app icon and display name on the home screen
- [ ] Decide final store listing language(s) and screenshots

Bump versions before each new store upload:

- Android: `android/app/build.gradle` → `versionCode` (+1) and `versionName`
- iOS: Xcode target → **Version** (`MARKETING_VERSION`) and **Build** (`CURRENT_PROJECT_VERSION`)
- Keep `package.json` `version` in sync with the marketing version

---

## 1. Android (Google Play)

### 1.1 Create the upload keystore (once)

```bash
chmod +x scripts/generate-android-keystore.sh
./scripts/generate-android-keystore.sh
```

This creates:

- `android/app/upload-keystore.jks` (gitignored)
- `android/keystore.properties` (gitignored)

Back up both files and the password. Losing them means you cannot update the same Play Store listing.

You can also copy `android/keystore.properties.example` and fill it in manually.

### 1.2 Build the Play Bundle (AAB)

```bash
npm run android:bundle
```

Output:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Optional APK for sideload testing:

```bash
npm run android:apk
```

### 1.3 Upload to Google Play Console

1. Create an app at [Google Play Console](https://play.google.com/console)
2. Set package name to `com.smartshoppingcart` (must match; cannot change later)
3. Complete Store listing (title, short/full description, graphics)
4. Use `assets/store/playstore.png` for the high-res icon
5. Add feature graphic (1024×500) and phone screenshots
6. Complete Data safety, Content rating, Target audience, Ads, Privacy policy URL
7. Create an **Internal testing** release first (recommended), upload `app-release.aab`, accept Play App Signing
8. Promote to Production after a successful test install

Privacy note: this app stores data only on-device and does not collect personal data (see About copy / PrivacyInfo).

**Suggested Data safety answers for this app**

- Does the app collect or share user data? → **No**
- Data encrypted in transit? → N/A if no collection (or Yes if you ever add network sync)
- Users can request deletion? → N/A / data is local-only; uninstall removes it

---

## 2. iOS (App Store)

### 2.1 Apple Developer setup

1. Enroll at [Apple Developer](https://developer.apple.com)
2. In [App Store Connect](https://appstoreconnect.apple.com), create an app
3. Bundle ID: `com.smartshoppingcart` (register it in Certificates, Identifiers & Profiles if needed)
4. In Xcode → Signing & Capabilities for the **ShoppingCart** target:
   - Select your Team
   - Enable **Automatically manage signing**

### 2.2 Archive in Xcode

```bash
cd ios
bundle install
bundle exec pod install
cd ..
open ios/ShoppingCart.xcworkspace
```

Then in Xcode:

1. Select scheme **ShoppingCart** and destination **Any iOS Device**
2. Product → Archive
3. Distribute App → App Store Connect → Upload

### 2.3 App Store Connect listing

1. Add screenshots for required device sizes
2. Use `assets/store/appstore.png` for the App Store icon (1024×1024)
3. Fill description, keywords, support URL, privacy policy URL
4. Privacy nutrition labels: no data collected / not used for tracking (matches `PrivacyInfo.xcprivacy`)
5. Submit for review

---

## 3. Useful npm scripts

```bash
npm start                 # Metro
npm run android           # Debug Android
npm run android:release   # Install release build on a device/emulator
npm run android:bundle    # Play Store AAB
npm run android:apk       # Release APK
npm run ios               # Debug iOS
npm test
npm run typecheck
```

---

## 4. Notes

- Android release signing uses `android/keystore.properties` when present; otherwise it falls back to the debug keystore (do **not** ship that to Play).
- ProGuard/R8 minify is enabled for Android release builds.
- Empty iOS location permission string was removed (app does not use location).
- Icons already wired: iOS `AppIcon.appiconset`, Android `mipmap-*`, store icon `assets/store/playstore.png`.
- If you need a different reverse-domain ID (e.g. `com.yourcompany.shoppingcart`), change it in both:
  - `android/app/build.gradle` → `applicationId` / `namespace`
  - `ios/ShoppingCart.xcodeproj` → `PRODUCT_BUNDLE_IDENTIFIER`
  before the first store submission.
