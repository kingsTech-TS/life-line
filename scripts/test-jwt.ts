import jwt from 'jsonwebtoken';
import * as jose from 'jose';

const JWT_SECRET = 'e2ccaded983510010a621c3ca3377f5f6968eac2fd90b7d3b2ad310fbc5a855cd1bd4808f7598ec07738926ae4db18caf322d5902e5c9ba53f718d58b201671b';
const secret = new TextEncoder().encode(JWT_SECRET);

async function test() {
  try {
    // Sign with jsonwebtoken
    const payload = { id: 'test_id', username: 'admin', role: 'admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    console.log('Token signed by jsonwebtoken');

    // Verify with jose
    try {
      await jose.jwtVerify(token, secret);
      console.log('Verification with jose: SUCCESS');
    } catch (err) {
      console.error('Verification with jose: FAILED');
      console.error(err);
    }
  } catch (error) {
    console.error('Signing error:', error);
  }
}

test();
