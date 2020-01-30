import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    // shcema de validação dos dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    const { email } = req.body;

    // verirfica se os dados de entrada são válidos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email } });

    if (userExists)
      return res.status(401).json({ error: 'User already exists' });

    const { id, name, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    // shcema de validação dos dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPass, field) =>
          oldPass ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (pass, field) =>
        pass ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // verirfica se os dados de entrada são válidos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user = await User.findByPk(req.userId);

    // verifica se o e-mail repassado é diferente do e-mail atual
    if (email && email !== user.email) {
      // veririfa se já existe um usuário com o mesmo e-mail cadastrado
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(401).json({ error: 'User already exists' });
      }
    }

    // só verifica se a senha confere se a senha atual for repassada
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
