import React, { useState, useEffect, useMemo } from 'react';
import { parseISO, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { MdNotifications } from 'react-icons/md';

import {
  Container,
  Badge,
  NotificationList,
  Notification,
  Scroll,
} from './styles';

import api from '~/services/api';

export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notificatons, setNotifications] = useState([]);

  const hasUnread = useMemo(
    () => !!notificatons.find(notification => notification.read === false),
    [notificatons]
  );

  useEffect(() => {
    async function loadNotifications() {
      const response = await api.get('/notifications');
      const data = response.data.map(notificaton => ({
        ...notificaton,
        timeDistance: formatDistance(
          parseISO(notificaton.createdAt),
          new Date(),
          {
            addSuffix: true,
            locale: ptBR,
          }
        ),
      }));
      setNotifications(data);
    }
    loadNotifications();
  }, []);

  function handleToggleVisible() {
    setVisible(!visible);
  }
  async function handleReadNotification(id) {
    await api.put(`/notifications/${id}`);

    setNotifications(
      notificatons.map(notificaton =>
        notificaton._id === id ? { ...notificaton, read: true } : notificaton
      )
    );
  }

  return (
    <Container>
      <Badge hasUnread={hasUnread} onClick={handleToggleVisible}>
        <MdNotifications color="#7159c1" size={20} />
      </Badge>
      <NotificationList visible={visible}>
        <Scroll>
          {notificatons.map(notificaton => (
            <Notification key={notificaton._id} unRead={!notificaton.read}>
              <p>{notificaton.content}</p>
              <time>{notificaton.timeDistance}</time>
              {!notificaton.read && (
                <button
                  type="button"
                  onClick={() => handleReadNotification(notificaton._id)}
                >
                  Marcar como lida
                </button>
              )}
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
