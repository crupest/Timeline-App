export class BadCredentialsError extends Error {
  constructor() {
    super('Username or password is wrong.');
    Object.setPrototypeOf(this, BadCredentialsError.prototype);
  }
}

export class UnknownError extends Error {
  constructor(public internalError?: any) {
    super('Sorry, unknown error occured!');
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}

export class ServerLogicError extends Error {
  constructor(message?: string) {
    super('Wrong server response. ' + message);
    Object.setPrototypeOf(this, ServerLogicError.prototype);
  }
}
