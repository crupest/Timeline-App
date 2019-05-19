export class BadCredentialsError extends Error {
  public constructor() {
    super('Username or password is wrong.');
    // uncomment next line when targeting es5, the same to following error classes
    // Object.setPrototypeOf(this, BadCredentialsError.prototype);
  }
}

export class BadServerResponseError extends Error {
  public constructor(message?: string) {
    super('Server responsed a bad data. ' + message);
  }
}

export class AlreadyLoginError extends Error {
  public constructor() {
    super('You have already login.');
  }
}

export class NoLoginError extends Error {
  public constructor() {
    super('You can\'t do that unless you login.');
  }
}
