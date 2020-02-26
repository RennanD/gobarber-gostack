import { all, takeLatest, call, put } from 'redux-saga/effects';

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

    console.tron.log(response);
    const { token, user } = response.data;

    if (!user.provider) return;

    yield put(singInSuccess(token, user));

    history.push('/dashboard');
  } catch (error) {
    yield put(singFailure());
  }
}

export default all([takeLatest('@auth/SING_IN_REQUEST', singIn)]);
