## Express Main(Cors、Session)
https://github.com/typeneko/tangobox-lagacy/blob/main/server/src/index.ts

## Third-party Login
#### Frontend
```javascript
const responseFacebook = (response) => {} 

const responseGoogle = (response) => {} 
```
https://github.com/typeneko/tangobox-lagacy/blob/main/client/src/components/LoginPage/index.tsx
#### Backend
```javascript
router.post("/google", async (req, res) => {}

router.post("/facebook", async (req, res) => {}
```
https://github.com/typeneko/tangobox-lagacy/blob/main/server/src/routers/user.ts

## ECPAY
https://github.com/typeneko/tangobox-lagacy/blob/main/server/src/routers/subscribe.ts
