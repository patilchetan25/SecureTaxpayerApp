const encryption = require("../helpers/encryption");

module.exports = (app) => {
    app.use((req, res, next) => {
        if (req.method.toLowerCase() === 'post' && req.body.key && req.body.data) {
            req.body = encryption.decryptRequestBody(req.body);
        }
        next();
    })
}