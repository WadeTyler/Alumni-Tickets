
export function isValidEmail(email: string) {
  const emailSplit = email.split("@");

  if (email.includes(" ") // Cannot include spaces
    || emailSplit.length !== 2  // Can/must only contain 1 @
    || emailSplit[0].length === 0 // Must not be empty <name>
    || emailSplit[0].length > 64  // <name> cannot be longer than 64 char.
    || emailSplit[1].length === 0 // Must not be empty <domain>
    || emailSplit[1].length > 252 // <domain> cannot be longer than 252 char.
    || !emailSplit[1].includes(".") // <domain> must include an extension so check for "."
  ) {
    return false;
  }

  return true;
}