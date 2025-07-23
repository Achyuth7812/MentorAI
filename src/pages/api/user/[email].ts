// src/pages/api/user/[email].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    const hashed = await hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    return res.status(201).json(user);
  }

  // GET by email
  const { email } = req.query;
  const user = await User.findOne({ email });
  return res.status(200).json(user);
}
