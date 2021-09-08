import ReactGA from 'react-ga';
import keys from '../config/keys';

export const initGA = () => {
  ReactGA.initialize(keys.gaTrackingId);
}

export const sendPageView = (location) => {
  const path = location.pathname + location.search;
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
}


