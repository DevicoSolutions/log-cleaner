import {createDeviceStatusService} from './service/createDriveStatusService'
import {createLogService} from './service/createLogService'
import config from './config'

const driveStatus = createDeviceStatusService()
const freeSpaceStats = driveStatus.getFreeSpaceInfo()
for (const mountPoint in freeSpaceStats) {
  const stats = freeSpaceStats[mountPoint]
  if (stats.usedPercentage > config.space.triggerOn) {
    console.log(`${mountPoint} in user more than ${config.space.triggerOn}%. Usage statistic:`)
    console.log(`  Device:    ${stats.fs}`)
    console.log(`  Size:      ${stats.size}`)
    console.log(`  Used:      ${stats.used}`)
    console.log(`  Available: ${stats.available}`)
  }
}
console.log('Clearing old logs...')
const logService = createLogService()
logService.clearOldLogsInFoler('/var/log', 2)
