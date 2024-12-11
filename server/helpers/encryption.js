const cryptoJS = require("crypto-js");
const forge = require("node-forge");
const fs = require('fs');

const rsaPrivateKeyPath = "./privateKey.pem";  // Replace with your actual file path
/**
 * @author Heena
 * @param {*} dataToEncr 
 *          Holds the data that need to encrypt
 * @param {*} publicKey
 *          Holds the public key that is being user to encrypt data (Key format: PEM)
 * @description
 *          This function is used to encrypt the data using RSA algorith
 */
const rsa_encr = (dataToEncr, publicKeyPEM) => {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPEM);
    const encrypted = publicKey.encrypt(dataToEncr);
    return forge.util.encode64(encrypted);
}

/**
 * @author Heena
 * @param {*} dataToDecr 
 *          Holds the that needs to decrypt
 * @param {*} privateKey 
 *          Holds the private key that is being used to decrypt the data (Key format: PEM)
 * @desciption
 *          This function is used to decrypt the data which was encrypted using RSA and public key
 */
const rsa_decr = (dataToDecr, privateKeyPEM) => {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPEM);
    const decodeText = forge.util.decode64(dataToDecr);
    return privateKey.decrypt(decodeText);
}

/**
 * @author Heena
 * @param {*} dataToEncr 
 *          Holds the data that needs to encrypt
 * @param {*} key
 *          Holds the key to encrypt the data
 * @description
 *          This function is used to encrypt the data using AES algorithm. 
 */
const aes_encr = (dataToEncr, key) => {
    return cryptoJS.AES.encrypt(JSON.stringify(dataToEncr), key).toString();
}

/**
 * @author Heena
 * @param {*} dataToDecr 
 *          Holds the data that needs to decrypt
 * @param {*} key 
 *          Holds the key which was used to encrypt the data
 * @description
 *          This function is used to decrypt the data which was encrypted using AES algorithm
 */
const aes_decr = (dataToDecr, key) => {
    const bytes = cryptoJS.AES.decrypt(dataToDecr, key);
    return bytes.toString(cryptoJS.enc.Utf8);
}

// USed to decrypt request body here body is object with two props key(AES encr key ecrypted with RSA) 
// and data (actual request payload encrypted with AES).
const decryptRequestBody = (body) => {
    // first decrypt the key using RSA algo as it was encrypted by app using RSA
    const rsaPrivateKey = fs.readFileSync(rsaPrivateKeyPath, "utf8");
    const aesKey = rsa_decr(body.key, rsaPrivateKey);
    const decryptedData = aes_decr(body.data, aesKey);
    return JSON.parse(decryptedData);
}

const encryptResponseBody = (body, key) => {
    // first decrypt the key using RSA algo as it was encrypted by app using RSA
    const rsaPrivateKey = fs.readFileSync(rsaPrivateKeyPath, "utf8");
    const aesKey = rsa_decr(key, rsaPrivateKey);
    return aes_encr(body, aesKey);
}

module.exports = {
    rsa_encr,
    rsa_decr,
    aes_decr,
    aes_encr,
    decryptRequestBody,
    encryptResponseBody
}