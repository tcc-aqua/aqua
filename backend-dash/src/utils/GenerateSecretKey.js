import crypto from 'crypto';

class SecretKeyGenerator {
  constructor(keyLength = 64) {
    this.keyLength = keyLength;
  }
  generate() {
    return crypto.randomBytes(this.keyLength).toString('hex');
  }
}
const generator = new SecretKeyGenerator();
const secretKey = generator.generate();

console.log("Chave secreta gerada:", secretKey);