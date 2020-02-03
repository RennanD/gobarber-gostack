import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required('You need inform provider.'),
      date: Yup.date('Oops, this is not a date.').required(
        'You need inform date.'
      ),
    });

    try {
      await schema.validate(req.body);

      const { provider_id, date } = req.body;

      // Check if provider_id is a provider
      const isProvider = await User.findOne({
        where: { id: provider_id, provider: true },
      });

      if (!isProvider) {
        return res
          .status(401)
          .json({ error: 'You can only creare appointment with providers.' });
      }

      // check if hour start has not past
      const hourStart = startOfHour(parseISO(date));

      if (isBefore(hourStart, new Date())) {
        return res.status(401).json({ error: 'Past date are not permited.' });
      }

      // check date availability
      const checkBusy = await Appointment.findOne({
        where: { provider_id, canceled_at: null, date: hourStart },
      });

      if (checkBusy) {
        return res
          .status(401)
          .json({ error: 'Appointment date is not available' });
      }

      const appointment = await Appointment.create({
        user_id: req.userId,
        provider_id,
        date: hourStart,
      });

      // Notify appointment provider
      const user = await User.findByPk(req.userId);
      const formatedDate = format(hourStart, "dd 'de' MMMM', às' HH:mm'h' ", {
        locale: ptBR,
      });
      await Notification.create({
        content: `Novo agendamento de ${user.name} para ${formatedDate}`,
        user: provider_id,
      });

      return res.json(appointment);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    // If user is not owner appontiment

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    // Check if the appointment is more than two hours away

    const dateWithSubs = subHours(appointment.date, 2);

    if (isBefore(dateWithSubs, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointements 2 hours in advance.',
      });
    }

    // Format date
    const formatedDate = format(
      appointment.date,
      "dd 'de' MMMM', às' HH:mm'h' ",
      {
        locale: ptBR,
      }
    );

    appointment.canceled_at = new Date();

    await appointment.save();

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        user: appointment.user.name,
        provider: appointment.provider.name,
        date: formatedDate,
      },
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
