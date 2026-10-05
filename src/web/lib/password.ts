const PASSWORD_KEY = "gtr-password";

export function readPassword() {
  try {
    return localStorage.getItem(PASSWORD_KEY);
  } catch {
    return null;
  }
}

export function writePassword(password: string) {
  try {
    localStorage.setItem(PASSWORD_KEY, password);
  } catch {
    return;
  }
}
