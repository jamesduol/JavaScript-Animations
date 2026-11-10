/* eslint-disable no-use-before-define */
/* eslint-disable no-empty */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, 'env') })

const fetch = require('node-fetch')
const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT || 3000

const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')
const { application } = require('express')
const UAParser = require('ua-parser-js')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(errorHandler())
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch
  })
}

const handleLinkResolver = doc => {
  if (doc.type === 'work') {
    return '/work'
  }

  if (doc.type === 'study') {
    return `/case/${doc.uid}`
  }

  if (doc.type === 'contact') {
    return '/contact'
  }

  if (doc.type === 'about') {
    return '/about'
  }

  // Default to homepage
  return '/'
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  res.locals.Link = handleLinkResolver

  res.locals.PrismicH = PrismicH

  next()
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.locals.basedir = app.get('views')

const handleRequest = async (api) => {
  const [work, study, preloader, navigation, meta, home, contact, about] =
    await Promise.all([
      api.getSingle('work'),
      api.getSingle('study'),
      api.getSingle('preloader'),
      api.getSingle('navigation'),
      api.getSingle('meta'),
      api.getSingle('home'),
      api.getSingle('contact'),
      api.getSingle('about')
    ])

  // console.log(about, contact, home, study)

  const assets = []

  home.data.gallery.forEach(item => {
    // console.log(item)
    assets.push(item.image.url)
  })

  // about.data.gallery.forEach((item) => {
  //   assets.push(section.primary.image.url)
  // })

  about.data.body.forEach(section => {
    if (section.slice_type === 'media') {
      // console.log(about.data.body)
      assets.push(section.primary.image.url)
    }
  })

  contact.data.body.forEach(section => {
    if (section.slice_type === 'leaders') {
      // console.log(contact.data.body)
      assets.push(section.primary.image.url)
    }
  })

  // study.data.body.forEach((media) => {
  //   assets.push(media.image.url)
  // })

  study.data.body.forEach(section => {
    if (section.slice_type === 'large') {
      // console.log(study.data.body)
      assets.push(section.primary.image.url)
    }
  })

  study.data.body.forEach(section => {
    if (section.slice_type === 'highlight') {
      section.items.forEach(media => {
        // console.log(study.data.body)
        assets.push(media.image.url)
      })
    }
  })

  study.data.body.forEach(section => {
    if (section.slice_type === 'projects') {
      section.items.forEach(media => {
        // console.log(study.data.body)
        assets.push(media.related_image.url)
      })
    }
  })

  work.data.body.forEach(section => {
    if (section.slice_type === 'large') {
      // console.log(work.data.body)
      assets.push(section.primary.image.url)
    }
  })

  work.data.body.forEach(section => {
    if (section.slice_type === 'study') {
      section.items.forEach(media => {
        // console.log(work.data.body)
        assets.push(media.image.url)
      })
    }
  })

  return {
    about,
    assets,
    contact,
    home,
    meta,
    navigation,
    preloader,
    study,
    work
  }
}

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('base', {
    ...defaults
  })
})

// Deconstructing the backend data
app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('base', {
    ...defaults
  })
})

app.get('/case/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  const study = await api.getByUID('study', req.params.uid, {
    fetchLinks: 'home.title'
  })

  // console.log(study.data.body)

  res.render('base', {
    ...defaults,
    study
  })
})

app.get('/contact', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('base', {
    ...defaults
  })
})

// Deconstructing the backend data
app.get('/work', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('base', {
    ...defaults
  })
})

app.listen(port, () => {
  console.log(`App Server listening at http://localhost:${port}`)
})
