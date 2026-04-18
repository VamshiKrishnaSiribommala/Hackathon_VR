export const loadGoogleMapsApi = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (!apiKey) {
      return reject(new Error('Google Maps API key is missing. Define VITE_GOOGLE_MAPS_API_KEY in frontend/.env.'));
    }

    if (window.google && window.google.maps) {
      return resolve(window.google);
    }

    const existingScript = document.querySelector('script[data-google-maps]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps script')));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-maps', 'true');
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
};
