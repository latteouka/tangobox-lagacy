import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/addbox50h', async (req, res) => {
  if (req.session.userId) {
    const { content } = req.body
    let newCard = 0
    if (content.cat === '休閒') {
      newCard = 3
    } else if (content.cat === '普通') {
      newCard = 5
    } else if (content.cat === '激進') {
      newCard = 10
    } else {
      newCard = 5
    }
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.session.userId) },
    })
    if (!user) {
      res.send(false)
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(req.session.userId),
      },
      data: {
        active: [...user!.active, '五十音 平假名'],
        dailyNew50h: newCard,
      },
    })
    res.send({
      user: {
        email: updatedUser!.email,
        uuid: updatedUser!.uuid,
        dailyNew: updatedUser!.dailyNew,
        dailyNew50h: updatedUser!.dailyNew50h,
        dailyNew50k: updatedUser!.dailyNew50k,
        active: updatedUser!.active,
        role: updatedUser!.role,
        due: updatedUser!.due,
      },
    })
  } else {
    res.send(false)
  }
})

router.post('/addbox50k', async (req, res) => {
  if (req.session.userId) {
    const { content } = req.body
    let newCard = 0
    if (content.cat === '休閒') {
      newCard = 3
    } else if (content.cat === '普通') {
      newCard = 5
    } else if (content.cat === '激進') {
      newCard = 10
    } else {
      newCard = 5
    }
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.session.userId) },
    })
    if (!user) {
      res.send(false)
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(req.session.userId),
      },
      data: {
        active: [...user!.active, '五十音 片假名'],
        dailyNew50k: newCard,
      },
    })
    res.send({
      user: {
        email: updatedUser!.email,
        uuid: updatedUser!.uuid,
        dailyNew: updatedUser!.dailyNew,
        dailyNew50h: updatedUser!.dailyNew50h,
        dailyNew50k: updatedUser!.dailyNew50k,
        active: updatedUser!.active,
        role: updatedUser!.role,
        due: updatedUser!.due,
      },
    })
  } else {
    res.send(false)
  }
})

router.post('/addbox', async (req, res) => {
  if (req.session.userId) {
    const { content } = req.body
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.session.userId) },
    })
    if (!user) {
      res.send(false)
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(req.session.userId),
      },
      data: {
        active: [...user!.active, content.cat],
      },
    })
    res.send({
      user: {
        email: updatedUser!.email,
        uuid: updatedUser!.uuid,
        dailyNew: updatedUser!.dailyNew,
        dailyNew50h: updatedUser!.dailyNew50h,
        dailyNew50k: updatedUser!.dailyNew50k,
        active: updatedUser!.active,
        role: updatedUser!.role,
        due: updatedUser!.due,
      },
    })
  } else {
    res.send(false)
  }
})

export default router
