# Nghia Blog

---

## Backend

### Server

- Config
[] dotenv
[] nodemon
[] lodash

- framework
[] express

- Middleware
[] morgan: Log hệ thống
[] body-parser: Chuyển dữ liệu từ body sang object
[] cookie-parser: Chức năng quản lý cookie
[] cors

- Auth
[] jsonwebtoken
[] express-jwt

- Lib support
[] express-validation: Kiểm tra dữ liệu đầu vào từ frontend
[] slugify: chuyển cụnm từ thành chuỗi từ với mỗi từ cách nhau bằng dấu '='
[] nanoid: Tạo id duy nhất

### Database

[] mongoose: Thao tác với database mongodb

---

## frontend

- framework
[] nextjs

- HTTP
[] isomorphic-fetch: So sánh với axios

- Lib support
[] js-cookie
[] query-string ~ vd: ?limit=20&skip=100 

- Design
[] bootstrap 5
[] nprogress: thanh progress thể hiện load page
[] import css from node_modules (nextjs v12): 
    - Global import vào /pages/_app.js
    - Có thể import bất kỳ ở đâu ngoại trừ màn /pages/_document.js

## Task

[x] handle Update blog
  [x] Write api
  [x] Write frontend
[x] Write route get photo of blog
[x] Create Page List Blog
  [x] list blog
  [x] show photo of image
  [x] show all categories and tags
  [x] Learn SEO 
    - https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls?hl=vi
    - https://www.tutorialspoint.com/seo/seo-tactics-methods.htm
    - [Meta Open Graph](https://developers.facebook.com/docs/sharing/webmasters/)
  [x] Load More
[x] Detail blog
  [x] show detail blog
  [x] show relate blog
[x] remove blog
[x] List blogs of category
[x] List blogs of tag
[x] search blog
  [] (Cải tiến)[https://www.w3schools.com/howto/howto_js_autocomplete.asp]
[] Public user profile
[] Private user profile
[] show comment of detail blog
[] user blog CRUD
[] contact form
[] forgot/reset password
[] email confirmation on signup
[] login with google
[] deploy

## Research
- _code highlight_
  - [prismjs](https://prismjs.com/)
  - [elementor](https://elementor.com/help/code-highlight-pro/)
  - [howto_syntax_highlight](https://www.w3schools.com/howto/howto_syntax_highlight.asp)
  - [hilite](http://hilite.me/)
- Store Image
  - [cloudinary](https://cloudinary.com/)

- End : 11. - 20.

## Architecture

https://nx.dev/l/r/getting-started/intro

https://www.hygen.io/docs/quick-start

https://redux-toolkit.js.org/
