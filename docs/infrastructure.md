# Admin
The admin app is depending on CKEditor5 which is accessing the browser window attribute directly, so for now, the Admin app has to be built separately as a pure SPA application that gets served by the `render` application's SSR to avoid the transparent server transition in Angular .
