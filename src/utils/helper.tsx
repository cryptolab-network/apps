export const hasValues = (obj) => Object.values(obj).some(v => v!==null && typeof v!== 'undefined');
export const isEmpty = (obj) => Object.keys(obj).length === 0;
