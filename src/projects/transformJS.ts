import { obfuscate, ObfuscatorOptions } from "javascript-obfuscator";

const options: ObfuscatorOptions = {
  domainLock: process.env.DOMAINS.split(","),
  domainLockRedirectUrl: "https://piman.dev",
  identifierNamesGenerator: "mangled-shuffled",
  splitStrings: true,
};

/**
 * Transforms JS to make it harder to copy
 * @param {string} data The JS file to transform
 * @returns {string} Transformed JS file
 */
export function transformJS(data: string): string {
  //While these transformations won't stop a dedicated attacker, it is more than enough to stop script kiddies.

  const mangled = obfuscate(data, options).getObfuscatedCode();

  return mangled;
}
