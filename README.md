# MADE BY MAYUR | ClearView.in

Browser-based 4K and 8K AI video upscaler. Everything runs on the device. No video is uploaded.

## Files

```
clearview-app/
├── index.html      # the app, including the ClearView logo
├── sw.js           # service worker: makes the app work offline
├── manifest.json   # lets the app install to the home screen
├── icon-192.png    # home-screen icon
├── icon-512.png    # home-screen icon
└── README.md
```

All files must be in the same folder. Upload all of them to the repository.

## Publish on GitHub Pages

1. Create a new **public** repository on GitHub, for example `clearview-app`.
2. Upload every file above to the repository's main page and commit.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch `main` and folder `/ (root)`, then click **Save**.
5. After about a minute, the app is live at `https://<your-username>.github.io/clearview-app/`.

To update the app, upload the changed files to the same place and commit. Pages redeploys automatically.

## Offline use

- **First visit must be online.** The first visit saves the app and the fonts to the phone or computer.
- After that, the app opens and exports with no internet connection.
- To use it like an app, tap **Add to Home Screen** (iPhone and Android) or **Install** (desktop Chrome and Edge).
- Updates arrive automatically the next time the phone is online.

## Using the app

1. Tap **Choose a video**.
2. Pick 4K or 8K, adjust Sharpen, and choose whether to stabilize shake and keep the original audio.
3. Tap **Start upscale**. The clip plays at real-time speed, so a 10-minute clip takes 10 minutes. Keep the screen on.
4. Tap **Save file** when the export finishes.

## Known limits

- **8K depends on the device.** Many phones cannot encode 8K video. When that happens, the app says so and does not offer a file. Use 4K on those devices.
- Long clips use a lot of memory. Clips over 10 minutes may fail on phones.
- Processing needs the browser to stay open and the screen on.
- Offline use requires the service worker to be supported. It works in current Chrome, Edge, Firefox and Safari.
