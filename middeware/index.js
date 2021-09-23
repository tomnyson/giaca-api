import CacheService from "../helper/cache";

export const setCache = (key, object) => {
  return CacheService.set(key, JSON.stringify(object));
};

export const getCache = (key) => {
  const data = CacheService.get(key);
  if (data !== undefined) {
    return JSON.parse(data);
  }
  return undefined;
};
export const isExistCache = (key) => {
  return CacheService.has(key);
};
export const clearCache = (key) => {
  return CacheService.del(key);
};

export const getCacheServer = (req, res, next) => {
  if (isExistCache("price")) {
    return res.json(getCache("price"));
  }
  next();
};
