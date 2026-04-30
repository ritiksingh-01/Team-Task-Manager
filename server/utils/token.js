import jwt from 'jsonwebtoken';

export const createToken = (user) => {
  const secret = process.env.JWT_SECRET || '99e55dfa12f9e0d921fae3364d2ea61361edc4a59f42a716c66ce0990a0d3380';
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role
    },
    secret,
    { expiresIn: '7d' }
  );
};
