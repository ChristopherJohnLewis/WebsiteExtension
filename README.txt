Requirements:
Windows 11
Npm v 10.8.2
node v 20.16.0


Steps to make and run:
npm install
verify firebase and rollup have been added to the node_modules directory
npm run build
verify code has been generated into dist/bundle.js


You can now run the extension manually in firefox or, if you have web-ext installed, run:
web-ext run




This extension is just used to quickly send user entered info to my Google Firebase realtime Database. I will be the only one using it most likely and it's just so I can collect data to display on a blog-like website. I needed to rollup so I can use the Firebase SDK easily. 