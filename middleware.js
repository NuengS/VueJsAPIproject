const getTokenFrom = (request) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

exports.sign = (user, secretkey) => {
  const jwt = require('jsonwebtoken')

  try {
    return jwt.sign(user, secretkey)
  } catch (e) {
    return res.status(401).send()
  }
}

exports.verify = (req, res, next) => {
  const jwt = require('jsonwebtoken')
  const secretkey = process.env.SECRET

  let accessToken = getTokenFrom(req)

  if (!accessToken) {
    return res.status(403).send()
  }

  let payload

  try {
    jwt.verify(accessToken, secretkey, (err, authData) => {
      if (err) {
        console.log('401')
        return res.status(401).send()
      } else {
        console.log('err')
      }
    })

    next()
  } catch (e) {
    return res.status(401).send()
  }
}
