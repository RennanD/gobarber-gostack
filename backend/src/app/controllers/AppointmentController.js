import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class AppointmentController {
  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
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
      provider_id: Yup.number().required('You need inform provider'),
      date: Yup.date('Oops, this is not a date').required(
        'You need inform provider'
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
          .json({ error: 'You can only creare appointment with providers' });
      }

      // check if hour start has not past
      const hourStart = startOfHour(parseISO(date));

      if (isBefore(hourStart, new Date())) {
        return res.status(401).json({ error: 'Past date are not permited' });
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

      return res.json(appointment);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }
}

export default new AppointmentController();
