import express from 'express'
import { PrismaClient } from '@prisma/client'
import uniqid from 'uniqid'
import ECPAY from 'ecpay_aio_nodejs'
import axios from 'axios'
import timestamp from 'unix-timestamp'
import qs from 'qs'

const router = express.Router()
const prisma = new PrismaClient()

function getTimeString(time: Date) {
  return (
    time.getFullYear() +
    '/' +
    `${time.getMonth() + 1}`.padStart(2, '0') +
    '/' +
    `${time.getDate()}`.padStart(2, '0') +
    ' ' +
    ('0' + time.getHours()).slice(-2) +
    ':' +
    ('0' + time.getMinutes()).slice(-2) +
    ':' +
    ('0' + time.getSeconds()).slice(-2)
  )
}

router.use(express.urlencoded({ extended: true }))

router.get('/new', async (req, res) => {
  if (req.session.userId) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.session.userId) },
    })
    if (!user) {
      res.send(false)
      return
    }

    const subId = uniqid('tbid')
    const timeNow = new Date()
    const timeString = getTimeString(timeNow)

    await prisma.trade.create({
      data: { userId: parseInt(req.session.userId), subId },
    })

    let baseParams: any = {
      // edit
      MerchantID: '3261765',
      MerchantTradeNo: subId,
      MerchantTradeDate: timeString,
      PaymentType: 'aio',
      TotalAmount: '60',
      TradeDesc: 'TangoBox訂閱',
      ItemName: 'TangoBox訂閱',
      ReturnURL: 'https://api.tangobox.app/subscribe/finish',
      ChoosePayment: 'Credit',
      ClientBackURL: 'https://tangobox.app/settings',
      EncryptType: '1',
    }
    const invParams = {}
    const periodParams = {
      PeriodAmount: '60',
      PeriodType: 'M',
      Frequency: '1',
      ExecTimes: '12',
      PeriodReturnURL: 'https://api.tangobox.app/subscribe/period',
    }

    const options = {
      OperationMode: 'Production',
      MercProfile: {
        MerchantID: '3261765',
        HashKey: 'hnjoBsBpazpuMOG2',
        HashIV: 'm4CbzmMGcdqQi8Ku',
      },
      IgnorePayment: ['WebATM', 'ATM', 'CVS', 'BARCODE', 'AndroidPay'],
      IsProjectContractor: false,
    }
    const transaction = new ECPAY(options)
    const html = transaction.payment_client.aio_check_out_credit_period(
      periodParams,
      baseParams,
      invParams
    )
    res.send(html)
  } else {
    res.send(false)
    return
  }
})

router.post('/period', async (req, res) => {
  const { body } = req
  console.log(body)

  const options = {
    OperationMode: 'Production',
    MercProfile: {
      MerchantID: '3261765',
      HashKey: 'hnjoBsBpazpuMOG2',
      HashIV: 'm4CbzmMGcdqQi8Ku',
    },
  }
  const transaction = new ECPAY(options)
  const bodyChecksum = body['CheckMacValue']
  delete body['CheckMacValue']
  const check = transaction.payment_client.helper.gen_chk_mac_value(body)
  const valid = check === bodyChecksum
  console.log(valid)

  if (!valid) {
    res.send('sorry')
    return
  }

  console.log('valid')
  const record = await prisma.trade.findFirst({
    where: { subId: body.MerchantTradeNo },
  })

  const subrecord = await prisma.subrecord.create({
    data: {
      userId: record!.userId,
      subId: body.MerchantTradeNo,
      rtncode: parseInt(body.RtnCode),
      rtnmsg: body.RtnMsg,
      periodType: body.PeriodType,
      frequency: parseInt(body.Frequency),
      execTimes: parseInt(body.ExecTimes),
      amount: parseInt(body.Amount),
      gwsr: parseInt(body.Gwsr),
      time: body.ProcessDate,
      authcode: body.AuthCode,
      firstAmount: parseInt(body.FirstAuthAmount),
      totalTimes: parseInt(body.TotalSuccessTimes),
    },
  })
  console.log(subrecord)
  if (!subrecord) {
    res.send('no record')
  }

  if (subrecord.rtncode === 1) {
    await prisma.user.update({
      where: { id: subrecord.userId },
      data: {
        role: 1,
        due: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
    })
  }

  res.send('1|OK')
})

router.post('/finish', async (req, res) => {
  const { body } = req
  console.log(body)

  const options = {
    OperationMode: 'Production',
    MercProfile: {
      MerchantID: '3261765',
      HashKey: 'hnjoBsBpazpuMOG2',
      HashIV: 'm4CbzmMGcdqQi8Ku',
    },
  }
  const transaction = new ECPAY(options)
  const bodyChecksum = body['CheckMacValue']
  delete body['CheckMacValue']
  const check = transaction.payment_client.helper.gen_chk_mac_value(body)
  const valid = check === bodyChecksum
  console.log(valid)

  if (!valid) {
    res.send('sorry')
    return
  }

  console.log('valid')
  const record = await prisma.trade.update({
    where: { subId: body.MerchantTradeNo },
    data: {
      rtncode: parseInt(body.RtnCode),
      rtnmsg: body.RtnMsg,
      tradeNo: body.TradeNo,
      tradeamt: parseInt(body.TradeAmt),
      paymentDate: body.PaymentDate,
      paymentType: body.PaymentType,
      tradeDate: body.TradeDate,
    },
  })

  console.log(record)
  if (!record) {
    res.send('no record')
  }
  if (record.rtncode === 1) {
    await prisma.user.update({
      where: { id: record.userId },
      data: {
        role: 1,
        due: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
    })
  }

  res.send('1|OK')
})

router.get('/stop', async (req, res) => {
  if (req.session.userId) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.session.userId) },
    })
    if (!user) {
      res.send(false)
      return
    }

    const trade = await prisma.trade.findMany({
      where: { userId: parseInt(req.session.userId), rtncode: 1 },
      orderBy: { id: 'desc' },
    })

    if (trade.length === 0) {
      res.send(false)
      return
    }

    const options = {
      OperationMode: 'Production',
      MercProfile: {
        MerchantID: '3261765',
        HashKey: 'hnjoBsBpazpuMOG2',
        HashIV: 'm4CbzmMGcdqQi8Ku',
      },
    }

    const stopParams = {
      Action: 'Cancel',
      MerchantID: '3261765',
      MerchantTradeNo: trade[0].subId,
      TimeStamp: parseInt(timestamp.now()).toString(),
    }

    const transaction = new ECPAY(options)
    const checksum =
      transaction.payment_client.helper.gen_chk_mac_value(stopParams)

    stopParams['CheckMacValue'] = checksum
    const query = qs.stringify(stopParams)

    const response = await axios.post(
      'https://payment.ecpay.com.tw/Cashier/CreditCardPeriodAction',
      query,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    console.log(response)
    const result = qs.parse(response.data)
    console.log(result)

    if (result.RtnCode === '1') {
      const updateUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: 0,
        },
      })
      res.send({ user: updateUser })
    } else {
      res.send(false)
    }
  } else {
    res.send(false)
  }
})

router.get('/allrecord', async (_, res) => {
  const records = await prisma.trade.findMany()
  res.send(records)
})

router.get('/allsubrecord', async (_, res) => {
  const records = await prisma.subrecord.findMany()
  res.send(records)
})
export default router
