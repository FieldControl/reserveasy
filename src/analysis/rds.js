const aws = require('aws-sdk')

const getActiveReservedDBInstances = async ({ region }) => {
  const rds = new aws.RDS({ apiVersion: '2014-10-31', region })
  const activeReservations = []
  const { ReservedDBInstances } = await rds.describeReservedDBInstances({}).promise()
  for (const reservedDBInstance of ReservedDBInstances) {
    if (reservedDBInstance.State === 'active') {
      for (let i = 0; i < reservedDBInstance.DBInstanceCount; i++) {
        activeReservations.push({
          DBInstanceClass: reservedDBInstance.DBInstanceClass,
          Engine: reservedDBInstance.ProductDescription === 'postgresql' ? 'postgres' : reservedDBInstance.ProductDescription,
          MultiAZ: reservedDBInstance.MultiAZ
        })
      }
    }
  }
  return activeReservations
}

const getRunningDBInstances = async ({ region }) => {
  const rds = new aws.RDS({ apiVersion: '2014-10-31', region })
  const { DBInstances } = await rds.describeDBInstances().promise()
  return DBInstances.filter((dbInstance) => {
    const isNotStopped = dbInstance.DBInstanceStatus !== 'stopped'
    const isNotStopping = dbInstance.DBInstanceStatus !== 'stopping'
    return isNotStopped && isNotStopping
  }).map((dbInstance) => ({
    DBInstanceIdentifier: dbInstance.DBInstanceIdentifier,
    DBName: dbInstance.DBName,
    DBInstanceClass: dbInstance.DBInstanceClass,
    Engine: dbInstance.Engine,
    MultiAZ: dbInstance.MultiAZ
  }))
}

const runAnalysis = async ({ region }) => {
  const reservations = await getActiveReservedDBInstances({ region })
  const instances = await getRunningDBInstances({ region })

  const missingReservations = []
  const allocatedReservations = []
  const unallocatedReservations = []

  const remainingReservations = [
    ...reservations
  ]

  for (const instance of instances) {
    const reservation = remainingReservations.find((reservation) => {
      const matchDBInstanceClass = reservation.DBInstanceClass === instance.DBInstanceClass
      const matchEngine = reservation.Engine === instance.Engine
      const matchMultiAZ = reservation.MultiAZ === instance.MultiAZ
      return matchDBInstanceClass && matchEngine && matchMultiAZ
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
