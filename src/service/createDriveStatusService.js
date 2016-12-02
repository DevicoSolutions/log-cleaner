import childProcess from 'child_process'

const duLineRegex = new RegExp('^([\\d]+)[\\s]+\\.\\/(.+)')
const dfLineRegex = new RegExp('^([\\w\\/\\-\\.]+)[\\s]+([\\d\\,]+\\w?)[\\s]+([\\d\\,]+\\w?)[\\s]+([\\d\\,]+\\w?)[\\s]+([\\d]+)\\%[\\s]+([\\w\\/\\-\\.]+)')

function deepPropertyVal(target, path, value) {
  if (path.length == 1) {
    const key = path.shift()
    target[key] = {
      ...(target[key] || {}),
      ...value
    }
    return target
  } else {
    const key = path.shift()
    if (!target.hasOwnProperty(key)) {
      target[key] = {}
    }
    deepPropertyVal(target[key], path, value)
    return target
  }
}

export function createDeviceStatusService() {

  return {
    getFreeSpaceInfo(mountPoint) {
      const output = childProcess.execSync(
        mountPoint ? `df -h ${mountPoint}`: 'df -h'
      ).toString()
      return output.split('\n').reduce((target, line) => {
        if (!dfLineRegex.test(line)) {
          return target
        }
        const [, fs, size, used, available, usedPercentage, mounted] = line.match(dfLineRegex)
        return {
          ...target,
          [mounted]: {
            fs,
            size,
            used,
            available,
            usedPercentage: parseInt(usedPercentage)
          }
        }
      }, {})
    },
    getFolderSizeInfo(path) {
      const output = childProcess.execSync(
        'du -c',
        {
          cwd: path
        }
      ).toString()
      return output.split('\n').reduce((target, line) => {
        if (line.indexOf('total') !== -1) {
          target.total = parseInt(line.split('\t').shift())
          return target
        } else if (duLineRegex.test(line)) {
          const [, size, path] = line.match(duLineRegex)
          if (!path) {
            return target
          }
          return deepPropertyVal(target, path.split('/'), {
            size: parseInt(size)
          })
        } else {
          return target
        }
      }, {})
    }
  }
}