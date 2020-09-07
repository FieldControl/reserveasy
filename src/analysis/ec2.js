const aws = require('aws-sdk')

const getActiveReservedInstances = async ({ region }) => {
  const ec2 = new aws.EC2({ apiVersion: '2016-11-15', region })
  const reservations = []
  const { ReservedInstances } = await ec2.describeReservedInstances({
    Filters: [{
      Name: 'state',
      Values: ['active']
    }]
  }).promise()
  for (const reservedInstance of ReservedInstances) {
    for (let i = 0; i < reservedInstance.InstanceCount; i++) {
      const isWindows = reservedInstance.ProductDescription.toLowerCase().indexOf('windows') !== -1
      reservations.push({
        InstanceType: reservedInstance.InstanceType,
        Platform: isWindows ? 'windows' : 'linux'
      })
    }
  }
  return reservations
}

const getRunningInstances = async ({ region }) => {
  const ec2 = new aws.EC2({ apiVersion: '2016-11-15', region })
  const instances = []
  const { Reservations } = await ec2.describeInstances({
    Filters: [{
      Name: 'instance-state-name',
      Values: ['running']
    }]
  }).promise()
  for (const reservation of Reservations) {
    for (const instance of reservation.Instances) {
      const tagName = instance.Tags.find((tag) => tag.Key === 'Name')
      instances.push({
        InstanceType: instance.InstanceType,
        Platform: !instance.Platform ? 'linux' : `${instance.Platform}`.toLocaleLowerCase(),
        instanceName: tagName ? tagName.Value : null
      })
    }
  }

  return instances
}

const runAnalysis = async ({ region }) => {
  const reservations = await getActiveReservedInstances({ region })
  const instances = await getRunningInstances({ region })

  const missingReservations = []
  const allocatedReservations = []
  const unallocatedReservations = []

  const remainingReservations = [
    ...reservations
  ]

  for (const instance of instances) {
    const reservation = remainingReservations.find((reservation) => {
      const matchPlatform = reservation.Platform === instance.Platform
      const matchInstanceType = reservation.InstanceType === instance.InstanceType
      return matchPlatform && matchInstanceType
    })

    if (reservation) {
      allocatedReservations.push(reservation)
      remainingReservations.splice(remainingReservations.indexOf(reservation), 1)
    } else {
      missingReservations.push(instance)
    }
  }

  unallocatedReservations.push(...remainingReservations)

  return {
    instances,
    reservations,
    missingReservations,
    allocatedReservations,
    unallocatedReservations
  }
}

module.exports = {
  runAnalysis
}
