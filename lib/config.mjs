export const REPOSITORY = 'https://github.com/polyakovin/boss-fight-atlas';
export const SITE_ORIGIN = 'https://polyakovin.github.io';
export const BASE_PATH = process.env.BASE_PATH ?? '/boss-fight-atlas/';
export const AUTHOR = Object.freeze({
  name: 'Igor Polyakov',
  github: 'https://github.com/polyakovin',
  website: 'https://polyakovin.ru',
  telegram: 'https://t.me/polyakovin',
  linkedin: 'https://www.linkedin.com/in/polyakovin/',
  email: 'mailto:web@polyakovin.ru',
});
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(BASE_PATH))
  throw new Error('BASE_PATH must start and end with / and contain safe path segments.');
export const link = (path = '') => BASE_PATH + path;
export const canonical = (path = '') => SITE_ORIGIN + link(path);
