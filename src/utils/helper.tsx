export const hasValues = (obj) => Object.values(obj).some(v => v!==null && typeof v!== 'undefined');
