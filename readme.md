## Express Main(Cors、Session)
[server/src/index.ts](https://github.com/typeneko/tangobox-lagacy/blob/main/server/src/index.ts)

## Third-party Login
#### Frontend
```javascript
const responseFacebook = (response) => {} 

const responseGoogle = (response) => {} 
```
[client/src/components/LoginPage/index.tsx](https://github.com/typeneko/tangobox-lagacy/blob/main/client/src/components/LoginPage/index.tsx)
#### Backend
```javascript
router.post("/google", async (req, res) => {}

router.post("/facebook", async (req, res) => {}
```
[server/src/routers/user.ts](https://github.com/typeneko/tangobox-lagacy/blob/main/server/src/routers/user.ts)

## ECPAY
[server/src/routers/subscribe.ts](https://github.com/typeneko/tangobox-lagacy/blob/main/server/src/routers/subscribe.ts)
