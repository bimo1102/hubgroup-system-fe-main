## start project

1. chạy general ( app host ): cd ./hubgroup-general-system-fe -> npm install && npm start

....

-   chạy đơn lẻ các project khác ( app remote ) : cd vào folder muốn chạy -> npm install && npm start
-   các link gọi app remote: trong file src/environments/environment.ts của general

2. config remotes / exposes module trong file federation.config.js
