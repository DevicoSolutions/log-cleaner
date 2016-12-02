# Simple Log Cleaner and hard drive information

## Example of output

```
/home in user more than 70%. Usage statistic:
  Device:    /dev/mapper/fedora-home
  Size:      798G
  Used:      687G
  Available: 111G
Clearing old logs...
Working on alternatives.log logs. Count to remove 5
Working on apport.log logs. Count to remove 6
Working on apt/history.log logs. Count to remove 5
Working on apt/term.log logs. Count to remove 5
Working on auth.log logs. Count to remove 3
Working on cups/access_log logs. Count to remove 6
Working on cups/error_log logs. Count to remove 2
Working on dpkg.log logs. Count to remove 5
Working on kern.log logs. Count to remove 3
Working on mysql/error.log logs. Count to remove 6
Working on php7.0-fpm.log logs. Count to remove 11
Working on syslog logs. Count to remove 6
Working on unattended-upgrades/unattended-upgrades-dpkg.log logs. Count to remove 4
Working on unattended-upgrades/unattended-upgrades.log logs. Count to remove 4
```

It's detect old grouped logs in /var/log and remove it by config