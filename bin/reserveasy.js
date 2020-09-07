#!/usr/bin/env node

const configs = require('./../config.json')
const { rds, ec2 } = require('../src')

const run = async () => {
  const outputAnalysis = {}
  for (const { region } of configs) {
    outputAnalysis[region] = {
      ec2: await ec2.runAnalysis({ region }),
      rds: await rds.runAnalysis({ region })
    }
  }
  console.log(JSON.stringify(outputAnalysis, null, 2))
  process.exit(0)
}

run()
