export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    try {
      return decodeURIComponent(parts.pop().split(';').shift());
    } catch (err) {
      console.error(`Error decoding cookie "${name}":`, err);
    }
  }
  return null;
}