export function formatString(str: string, values: Record<string, any>) {
  let res = str;
  Object.keys(values).forEach((key) => {
    const reg = new RegExp(`$\{${key}}`, 'g');
    res = res.replace(reg, values[key]);
  });
  return res;
}
