export interface IValidatorFilter {
  favorite: boolean;
  commission: boolean;
  apy: boolean;
  cryptoLab: boolean;
  status: boolean;
  stashId: string;
  alphabetical: boolean;
}


export const filterOptions = [
  'Default',
  'Alphabetical',
  'APY'
];

export const filterOptionDropdownList = filterOptions.map((o, idx) => {
  return {
    label: o,
    value: idx + 1,
  };
});

export interface FilterState {
  stashId: string
  strategy: string
}

export function toValidatorFilter(state: FilterState): IValidatorFilter {
  if (state.stashId.length > 0) {
    return  {
      favorite: false,
      commission: false,
      apy: false,
      cryptoLab: false,
      status: false,
      stashId: state.stashId,
      alphabetical: false,
    };
  }
  if (state.strategy === filterOptions[1]) {
    return {
      favorite: false,
      commission: false,
      apy: false,
      cryptoLab: false,
      status: false,
      stashId: '',
      alphabetical: true,
    };
  }
  if (state.strategy === filterOptions[2]) {
    return {
      favorite: false,
      commission: false,
      apy: true,
      cryptoLab: false,
      status: false,
      stashId: '',
      alphabetical: false,
    };
  }
  return {
    favorite: true,
    commission: false,
    apy: false,
    cryptoLab: true,
    status: true,
    stashId: '',
    alphabetical: false,
  };
}
