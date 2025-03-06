/**
 * Retrieves the decoded data from a JWT in base64 format.
 *
 * @param str The JWT to decode.
 * @returns The decoded data in base64 format.
 */
const decoded = (str: string): string =>
  Buffer.from(str, "base64").toString("binary");

/**
 * Retrieves an object with the expiry time in seconds from a JSON Web Token.
 *
 * @param {string} token - The JSON Web Token to parse.
 * @returns {Object} An object with the expiry time in seconds.
 */
const parseJwt = (
  token: string
): {
  sub: string;
  exp: number;
  sid: string;
  act: { sub: string };
} => {
  try {
    return JSON.parse(decoded(token.split(".")[1]));
  } catch {
    return {
      sub: "",
      exp: 0,
      sid: "",
      act: { sub: "" }
    };
  }
};

export default parseJwt;
