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
## Database Schema
[server/prisma/schema.prisma](https://github.com/typeneko/tangobox-lagacy/blob/main/server/prisma/schema.prisma)
```
model User {
  id          Int        @default(autoincrement()) @id
  email       String     @unique
  uuid        String     @unique
  password    String?
  role        Int        @default(0)
  due         DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Trade {
  id          Int        @default(autoincrement()) @id
  userId      Int        
  subId       String     @unique
  rtncode     Int?
  rtnmsg      String? 
  tradeNo     String?
  tradeamt    Int?
  paymentDate String?
  paymentType String?
  tradeDate   String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Subrecord {
  id          Int        @default(autoincrement()) @id
  userId      Int
  subId       String
  rtncode     Int
  rtnmsg      String 
  periodType  String
  frequency   Int
  execTimes   Int
  amount      Int
  gwsr        Int
  time        String
  authcode    String
  firstAmount Int
  totalTimes  Int
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

