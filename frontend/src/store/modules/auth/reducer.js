import { produce } from 'immer';

const INITIAL_STATE = {
  token: null,
  signed: false,
  loading: false,
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@auth/SING_IN_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@auth/SING_IN_SUCCESS': {
        draft.token = action.payload.token;
        draft.signed = true;
        draft.loading = false;
        break;
      }
      case '@auth/SING_OUT': {
        draft.signed = false;
        draft.token = null;
        break;
      }
      case '@auth/SING_FAILURE': {
        draft.loading = false;
        break;
      }
      default:
    }
  });
}
