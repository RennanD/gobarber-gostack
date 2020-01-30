import jwt from 'jsonwebtoken';

// converte promisse para o padrão async await
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Divide em duas partes [ Bearer, 'token' ]
  const [, token] = authHeader.split(' ');

  try {
    // constante retornada por padrão no jw
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // incluir id no req, para poder usar em outras requisições
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
