const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const generateUniqueBase62Id = (length: number = 6): string => {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += BASE62[Math.floor(Math.random() * 62)];
  }
  return id;
}; 