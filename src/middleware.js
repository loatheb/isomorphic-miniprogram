const changeDirPrefix = () => {
  return async (ctx, next) => {
    return await next()
  }
}

function notifyError(socket) {
  return async (ctx, next) => {
    if (!socket || ctx.request.headers['x-remote']) return await next()
    try {
      await next()
    } catch(e) {
      console.log(e)
      socket.send({
        type: 'error',
        msg: e.message
      })
    }
  }
}

module.exports = {
  changeDirPrefix,
  notifyError,
}