import * as command from './wechat/command'

window.addEventListener('message', ({
  data = {},
}) => {
  const { cmd, msg } = data

  if (data.to == null || data.to === 'contentscript' || /^devtools/.test(data.to)) return
  if (cmd === 'EXEC_JSSDK') {
    return
  }

  if (cmd === 'TO_APP_SERVICE') {
    delete data.command
    return
  }

  if (cmd === 'COMMAND_FROM_ASJS') {
    const { sdkName } = data
    if (command.hasOwnProperty(sdkName)) {
      return command[sdkName](data)
    }
    return console.warn(`Method ${sdkName} not implemented for command!`)
  }

  if (cmd === 'PULLDOWN_REFRESH') {
    return command['PULLDOWN_REFRESH'](data)
  }

  if (cmd === 'WEBVIEW_READY') {
    // TODO figure out WTF is this
    return
  }

  console.warn(`Command ${cmd} not recognized!`)
})
