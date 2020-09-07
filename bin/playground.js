const { rds, ec2 } = require('./../src')

const run = async () => {
  const rdsAnalysis = await rds.runAnalysis({ region: 'sa-east-1' })
  console.log(JSON.stringify(rdsAnalysis, null, 2))

  const ec2Analysis = await ec2.runAnalysis({ region: 'sa-east-1' })
  console.log(JSON.stringify(ec2Analysis, null, 2))
}

run()
