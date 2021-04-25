/**
 * Cast keys as strings for semi-automatic type inference
 *
 * Credits go to Matt McCutchen. More info at:
 * https://stackoverflow.com/a/52157355/4980568
 */
export const asStrings = <T extends Record<string, string>>(arg: T): T => arg
