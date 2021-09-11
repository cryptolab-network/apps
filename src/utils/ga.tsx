import GA4React from 'ga-4-react';
import keys from '../config/keys';

const ga4react = new GA4React(keys.gaTrackingId);
let ga4;

export const initGA = async () => {
  try {
    ga4 = await ga4react.initialize();
  } catch (err) {
    // console.error(err);
  }
}

export const sendPageView = (location) => {
  try {
    const path = location.pathname + location.search;
    ga4.pageview(path);  
  } catch (err) {
    // console.error(err);
  }
} 


