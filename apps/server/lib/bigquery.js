'use strict'

const { BigQuery } = require('@google-cloud/bigquery')

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'gen-lang-client-0453424159'

// Singleton BigQuery client.
// In Cloud Run the service account attached to the revision provides credentials
// automatically via Application Default Credentials (ADC).
// Locally, set GOOGLE_APPLICATION_CREDENTIALS to a service-account key file.
const bigquery = new BigQuery({ projectId: PROJECT_ID })

module.exports = { bigquery, PROJECT_ID }
