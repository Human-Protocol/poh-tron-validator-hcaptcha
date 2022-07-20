const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

const { expect } = chai;

chai.use(chaiHttp);

const validProofRequest = {
  data: '0xef9990adc264ccc6e55bd0cfbf8dbef5177760273ee5aa3f65aae4bbb014750f',
  token: '10000000-aaaa-bbbb-cccc-000000000001'
};

const invalidProofRequest = {
  data: '0xef9990adc264ccc6e55bd0cfbf8dbef5177760273ee5aa3f65aae4bbb014750f',
  token: '10000000-xxxx-yyyy-zzzz-000000000001'
};

describe('APIv1', () => {
  it('Should successfully verify valid request', (done) => {
    chai
      .request(server)
      .post('/api/v1/proof')
      .send(validProofRequest)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.keys(['proof', 'timestamp']);
        done();
      });
  });

  it('Should return response code 400 when hCaptcha token is invalid', (done) => {
    chai
      .request(server)
      .post('/api/v1/proof')
      .send(invalidProofRequest)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });
});
