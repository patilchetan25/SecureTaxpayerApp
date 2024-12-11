const encryption = require("../helpers/encryption");
/**
 * custom httpResponse log setup
 */
exports = module.exports = (app) => {
    app.use((req, res, next) => {
        try {
            var oldSend = res.send;
            var encrKey;
            if (req.body.key) {
                encrKey = req.body.key;
            }
            res.send = function (responseData) {
                if (req.method.toLowerCase() === 'post' && res.statusCode.toString() === '200' && encrKey) {
                    if (responseData.data) {
                        responseData.data = encryption.encryptResponseBody(responseData.data, encrKey);
                    }
                }
                oldSend.call(this, responseData);
            }
        } catch (error) {
            console.error(`Error on httpResponse middleware Error: ${error}`);
        }
        next();
    });
};