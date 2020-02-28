import { all, takeLatest, call, put } from 'redux-saga/effects';

import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';
import { singInSuccess, singFailure } from './actions';

export function* singIn({ payload }) {
  const { email, password } = payload;

  try {
    const response = yield call(api.post, '/sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (!user.provider) {
      toast.error('User is not provider');
      return;
    }
    console.tron.log(token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    yield put(singInSuccess(token, user));

    history.push('/dashboard');
  } catch ({ response }) {
    yield put(singFailure());
    toast.error(response.data.error);
  }
}

export function* singUP({ payload }) {
  const { name, email, password } = payload;
  try {
    yield call(api.post, '/users', { name, email, password, provider: true });
    toast.success('User registered successful');
    history.push('/');
  } catch ({ response }) {
    toast.error(response.data.error);
    yield put(singFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) {
    return;
  }
  const { token } = payload.auth;
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SING_IN_REQUEST', singIn),
  takeLatest('@auth/SING_UP_REQUEST', singUP),
]);
