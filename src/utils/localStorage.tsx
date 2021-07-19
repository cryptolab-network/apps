
export function lsSetFavorite(address: string) {
  let str = localStorage.getItem('favorite-validators');
  let validators: string[] = [];
  if (str === null) {
    validators = [];
  } else {
    validators = JSON.parse(str);
  }
  validators.push(address);
  localStorage.setItem('favorite-validators', JSON.stringify(validators));
};

export function lsUnsetFavorite(address: string) {
  let str = localStorage.getItem("favorite-validators");
  let validators: string[] = [];
  if (str === null) {
    validators = [];
  } else {
    validators = JSON.parse(str);
  }
  const idx = validators.indexOf(address)
  if (idx >= 0) {
    validators.splice(idx, 1);
  }
  localStorage.setItem('favorite-validators', JSON.stringify(validators));
}

export function lsGetFavorites(): string[] {
  let str = localStorage.getItem("favorite-validators");
  if (str !== null) {
    return JSON.parse(str);
  }
  return [];
}