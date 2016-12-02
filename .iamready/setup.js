import config from '../src/config'

export function attachConfig(config, serverName, appName) {
  config.servers[serverName].config = {
    ...config.servers[serverName].config,
    service: {
      ...(config.servers[serverName].config.service || {}),
      create: {
        ...(config.servers[serverName].config.service && config.servers[serverName].config.service.create || {}),
        'cleaner.service': {
          Unit: {
            Description: 'Clean logs and notify users about disk usage'
          },
          Service: {
            ExecStart: `/opt/iamready/${appName}/current/src/index.js`,
            Environment: [
              `SPACE_TRIGGER=${config.space.SPACE_TRIGGER}`
            ]
          }
        },
        'cleaner.timer': {
          Unit: {
            Description: 'Run cleaner every day and on boot'
          },
          Timer: {
            OnBootSec: '15min',
            OnUnitActiveSec: '1d'
          }
        }
      }
    }
  }
  config.apps[appName].start = {
    ...(config.apps[appName].start || {}),
    service = {
      ...(config.apps[appName].start && config.apps[appName].start.service || {}),
      enable: [...(config.apps[appName].start && config.apps[appName].start.service && config.apps[appName].start.service.enable || []), 'cleaner.timer'],
      start: [...(config.apps[appName].start && config.apps[appName].start.service && config.apps[appName].start.service.start || []), 'cleaner.timer']
    }
  }
  config.apps[appName].stop = {
    ...(config.apps[appName].stop || {}),
    service = {
      ...(config.apps[appName].stop && config.apps[appName].stop.service || {}),
      disable: [...(config.apps[appName].stop && config.apps[appName].stop.service && config.apps[appName].stop.service.disable || []), 'cleaner.timer'],
      stop: [...(config.apps[appName].stop && config.apps[appName].stop.service && config.apps[appName].stop.service.stop || []), 'cleaner.timer']
    }
  }

  return config
}