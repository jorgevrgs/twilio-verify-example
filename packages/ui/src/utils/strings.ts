export const hidePartOfString = (str: string, start = 4, end = 11) =>
  str.replace(str.substring(start, end), '*******');
