'use strict'

/**
 * Loads secrets from GCP Secret Manager at startup (used in Cloud Run).
 * When running locally the values are already present in the environment
 * via a .env file, so this module is a no-op in that case.
 */

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager')

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'gen-lang-client-0453424159'
const client = new SecretManagerServiceClient()

/**
 * Fetches the latest version of a secret and returns its string value.
 * Returns null on error (secret not found, permission denied, etc.).
 */
async function getSecret(secretName) {
  try {
    const name = `projects/${PROJECT_ID}/secrets/${secretName}/versions/latest`
    const [version] = await client.accessSecretVersion({ name })
    return version.payload.data.toString('utf8')
  } catch (err) {
    console.warn(`[secrets] Could not load secret '${secretName}': ${err.message}`)
    return null
  }
}

/**
 * Loads required secrets into process.env when running in Cloud Run
 * (identified by the K_SERVICE environment variable being set).
 * Does nothing when K_SERVICE is absent (local dev).
 */
async function loadSecrets() {
  if (!process.env.K_SERVICE) {
    console.log('[secrets] Local environment detected — skipping Secret Manager.')
    return
  }

  console.log('[secrets] Cloud Run detected — loading secrets from Secret Manager...')

  const secretMap = {
    GOOGLE_CLIENT_ID: 'google-oauth-client-id',
    GOOGLE_CLIENT_SECRET: 'google-oauth-client-secret',
  }

  for (const [envKey, secretName] of Object.entries(secretMap)) {
    if (!process.env[envKey]) {
      const value = await getSecret(secretName)
      if (value) {
        process.env[envKey] = value
        console.log(`[secrets] Loaded ${envKey} from Secret Manager.`)
      }
    } else {
      console.log(`[secrets] ${envKey} already set in environment — skipping.`)
    }
  }
}

module.exports = { loadSecrets, getSecret }
