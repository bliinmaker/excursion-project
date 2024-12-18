import Fastify from 'fastify'
import AutoLoad from '@fastify/autoload'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import 'dotenv/config'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import AdminJSFastify from '@adminjs/fastify'
import AdminJS from 'adminjs'
import * as AdminJSMongoose from '@adminjs/mongoose'
import MongoStore from 'connect-mongo'
import Excursion from './models/excursion.model.js'
import Order from './models/order.model.js'
import Comment from './models/comment.model.js'
import User from './models/user.model.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const connectMongoOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

const runAdminJs = async function (fastify)  {
  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  })

  const authenticate = async (email, password) => {
    try {
      const user = await User.findOne({ email }).select(["password", "role", "firstName", "lastName"])
  
      if (!user) {
        return { error: "User not found." }
      }
  
      const isMatch = await user.comparePassword(password)
  
      if (!isMatch) {
        return { error: "Incorrect password." }
      }
  
      if (user && user?.role === 'Admin') {
        return Promise.resolve(user)
      }
    } catch (error) {
      return null
    }
  }

  const cookieSecret = 'sieL67H7GbkzJ4XCoH0IHcmO1hGBSiG5'
  const admin = new AdminJS({
    rootPath: '/admin',
    resources: [Excursion, Comment, Order, User],
  })

  const sessionStore = MongoStore.create({
    client: mongoose.connection.getClient(),
    collectionName: 'sessions',
    stringify: false,
    autoRemove: 'interval',
    autoRemoveInterval: 1
  })

  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: cookieSecret,
      cookieName: 'adminjs',
    },
    fastify,
    {
      store: sessionStore,
      saveUninitialized: true,
      secret: cookieSecret,
      cookie: {
        httpOnly: false,
        secure: false,
      },
    }
  )
}

const buildApp = async function (fastify, opts) {
  try {
    await mongoose.connect(
      process.env.API_MONGODB_URI,
      connectMongoOptions
    )
  } catch (e) {
    fastify.log.error(e)
  }

  await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
  })

  await runAdminJs(fastify)

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'uploads', 'images'),
  })

  fastify.get('/uploads/images/:imageName', (req, reply) => {
    reply.sendFile(req.params.imageName)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts),
  })

  fastify.addHook('onClose', async () => {
    await mongoose.connection.close()
  })

  return fastify
}

export default buildApp