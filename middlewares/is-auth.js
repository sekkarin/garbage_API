const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if(!authHeader){
        const error = new Error('Not authenticated')
        error.statusCode = 401
        throw error
    }
    const token = authHeader.split(' ')[1]
    // console.log(token);
    let decodeTotken
    try {
        decodeTotken = jwt.verify(token, 'Hello world')
       console.log("is-auth",decodeTotken);
    } catch (error) {
        error.statusCode = 500
        throw error
    }
    if (!decodeTotken) {
        const error = new Error('Not authentication')
        error.statusCode = 401
        throw error
    }
    // console.log(decodeTotken.userId);
    // console.log(req);
    req.userId = decodeTotken.userId
    next()
    // http://localhost:3000/
}