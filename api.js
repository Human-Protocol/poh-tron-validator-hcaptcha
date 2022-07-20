const express = require('express');
const ethers = require('ethers')
const {verify} = require('hcaptcha');
const TronWeb = require('tronweb');
const { validatorKey, hcaptchaSecret } = require( './config.js');

const tronWeb = new TronWeb({
  fullNode: 'https://api.trongrid.io',
  solidityNode: 'https://api.trongrid.io',
  eventServer: 'https://api.trongrid.io',
  privateKey: validatorKey.slice(2)
});

const api = express.Router();

const methodNotAllowed = (req, res) => {
  res.sendStatus(405);
};

api
  .route('/proof')
  .post(async (req, res, next) => {
    try {
      const { data, token } = req.body;

      const result = await verify(hcaptchaSecret, token);
      const { success, challenge_ts } = result;
      if (!success) {
        res.sendStatus(400);
        return;
      }

      const timestamp = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(
          Math.floor(new Date(challenge_ts).getTime() / 1000)
        ),
        4
      );

      const hash = ethers.utils.keccak256(
        ethers.utils.hexConcat([data, timestamp])
      );
      const validatorSignature = await tronWeb.trx.sign(hash);

      const proof = ethers.utils.hexConcat([
        data,
        timestamp,
        validatorSignature
      ]);

      res.json({ proof, timestamp: challenge_ts });
    } catch (error) {
      next(error);
    }
  })
  .all(methodNotAllowed);

module.exports = api;
