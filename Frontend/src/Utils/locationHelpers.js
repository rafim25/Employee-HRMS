/**
 * Helpers for candidate location fields stored as "State Name, City Name".
 */

export const parseLocationString = (value = '') => {
  if (!value || typeof value !== 'string') {
    return { stateName: '', cityName: '' };
  }
  const parts = value.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return { stateName: '', cityName: '' };
  if (parts.length === 1) return { stateName: parts[0], cityName: '' };
  return {
    stateName: parts[0],
    cityName: parts.slice(1).join(', '),
  };
};

export const findStateMatch = (states = [], stateNameOrCode = '') => {
  if (!stateNameOrCode) return null;
  const key = String(stateNameOrCode).trim().toLowerCase();
  return (
    states.find((s) => String(s.iso2 || s.code || '').toLowerCase() === key) ||
    states.find((s) => String(s.name || '').toLowerCase() === key) ||
    null
  );
};

export const findCityMatch = (cities = [], cityNameOrId = '') => {
  if (cityNameOrId === '' || cityNameOrId == null) return null;
  const asString = String(cityNameOrId).trim();
  const byId = cities.find((c) => String(c.id) === asString);
  if (byId) return byId;
  const key = asString.toLowerCase();
  return cities.find((c) => String(c.name || '').toLowerCase() === key) || null;
};

export const formatLocation = (stateName = '', cityName = '') => {
  const state = String(stateName || '').trim();
  const city = String(cityName || '').trim();
  if (state && city) return `${state}, ${city}`;
  return state || city || '';
};

export const emptyLocation = () => ({
  state: '',
  stateName: '',
  city: '',
  cityName: '',
  manual: false,
});
