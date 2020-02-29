import { all, takeLatest, call, put } from 'redux-saga/effects';

import { toast } from 'react-toastify';
import api from '~/services/api';
import { updateProfileFailure, updateProfileSuccess } from './actions';

export function* updateProfile({ payload }) {
  const { avatar_id, name, email, ...rest } = payload.data;

  try {
    const profile = {
      avatar_id,
      name,
      email,
      ...(rest.oldPassword ? rest : {}),
    };
    const response = yield call(api.put, '/users', profile);
    toast.success('Change data successful ');
    yield put(updateProfileSuccess(response.data));
  } catch ({ response }) {
    toast.error(response.data.error);
    yield put(updateProfileFailure());
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
