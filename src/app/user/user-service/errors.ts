export class BadCredentialsError extends Error {
  constructor() {
    super('Username or password is wrong.');
  }
}

export class UnknownError extends Error {
  constructor(public internalError?: any) {
    super('Sorry, unknown error occured!');
  }
}

export class ServerLogicError extends Error {
  constructor(message?: string) {
    super('Wrong server response. ' + message);
  }
}
