'use strict'

const { Firestore } = require('@google-cloud/firestore')

const db = new Firestore({
  projectId: process.env.GCP_PROJECT_ID || 'gen-lang-client-0453424159',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
})

module.exports = { db }
