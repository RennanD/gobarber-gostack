import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        user: appointment.user.name,
        provider: appointment.provider.name,
        date: format(
          parseISO(appointment.date),
          "dd 'de' MMMM', às' HH:mm'h' ",
          {
            locale: ptBR,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
