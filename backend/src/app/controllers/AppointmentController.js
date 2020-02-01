import * as Yup from 'yup';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
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

      const appointment = await Appointment.create({
        user_id: req.userId,
        provider_id,
        date,
      });

      return res.json(appointment);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }
}

export default new AppointmentController();
