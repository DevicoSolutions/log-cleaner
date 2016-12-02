import fs from 'fs'
import childProcess from 'child_process'

const oldLogRegex = new RegExp('\\.([\\d]+)(\\.gz)?$')

export function createLogService() {

  function listFiles(folder) {
    const output = childProcess.execSync(`ls -A -F -w 1 ${folder}`).toString()
    return output
      .split('\n')
      .map(file => file.indexOf('/') != -1 
        ? ({
          type: 'folder',
          name: file,
          files: listFiles(folder + '/' + file)
        })
        : ({
          type: 'file',
          name: file
        })
      )
  }

  function detectGroups(files, minCount) {
    const groups = new Map
    for(const file of files) {
      if (file.type === 'file') {
        const cleanName = file.name.replace(oldLogRegex, '')
        if (!groups.has(cleanName)) {
          groups.set(cleanName, new Map)
        }
        let number = 0
        if (oldLogRegex.test(file.name)) {
          const [,chunk] = file.name.match(oldLogRegex)
          number = parseInt(chunk)
        }
        groups.get(cleanName).set(number, file.name)
      } else {
        const folderGroups = detectGroups(file.files, minCount)
        for (const [name, files] of folderGroups) {
          const fullName = file.name + name
          groups.set(fullName, new Map)
          for (const [number, path] of files) {
            groups.get(fullName).set(number, file.name + path)
          }
        }
      }
    }
    const result = new Map
    for (const [name, files] of groups) {
      if (files.size > minCount) {
        result.set(name, files)
      }
    }
    return result
  }

  return {
    listFiles,
    clearOldLogsInFoler(folder, leaveCount) {
      const files = listFiles(folder)
      const groups = detectGroups(files, leaveCount)
      for (const [name, files] of groups) {
        console.log(`Working on ${name} logs. Count to remove ${files.size - leaveCount}`)
        const keys = Array.from(files.keys()).sort((a, b) => a > b ? 1 : -1)
        for (let i = 0; i < leaveCount; i++) {
          keys.shift()
        }
        for (const key of keys) {
          const fullPath = folder + '/' + files.get(key)
          fs.unlinkSync(fullPath)
        }
      }
    }
  }
}