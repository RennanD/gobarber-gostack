export function singInRequest(email, password) {
  return {
    type: '@auth/SING_IN_REQUEST',
    payload: { email, password },
  };
}

export function singUpRequest(name, email, password) {
  return {
    type: '@auth/SING_UP_REQUEST',
    payload: { name, email, password },
  };
}

export function singInSuccess(token, user) {
  return {
    type: '@auth/SING_IN_SUCCESS',
    payload: { token, user },
  };
}

export function singFailure() {
  return {
    type: '@auth/SING_FAILURE',
  };
}

export function singOut() {
  return {
    type: '@auth/SING_OUT',
  };
}
