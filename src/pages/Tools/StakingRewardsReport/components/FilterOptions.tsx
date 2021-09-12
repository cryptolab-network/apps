import { useMemo, useCallback, useState, useContext } from 'react';
import Button from '../../../../components/Button';
import { DataContext } from '../../components/Data';
import { networkCapitalCodeName } from '../../../../utils/parser';
import { createTheme } from '@material-ui/core/styles';
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';
import { ThemeProvider } from '@material-ui/styles';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import styled from 'styled-components';
import dayjs from 'dayjs';

import './FilterOptions.css';
import DropdownCommon from '../../../../components/Dropdown/Common';
import Input from '../../../../components/Input';

type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};

declare module '@material-ui/core/styles/overrides' {
  export interface ComponentNameToClassKey extends overridesNameToClassKey {}
}

export const filterOptions = [
  'usd',
  'aed',
  'ars',
  'aud',
  'bdt',
  'bhd',
  'bmd',
  'brl',
  'cad',
  'chf',
  'clp',
  'cny',
  'czk',
  'dkk',
  'eur',
  'gbp',
  'hkd',
  'huf',
  'idr',
  'ils',
  'inr',
  'jpy',
  'krw',
  'kwd',
  'lkr',
  'mmk',
  'mxn',
  'myr',
  'ngn',
  'nok',
  'nzd',
  'php',
  'pkr',
  'pln',
  'rub',
  'sar',
  'sek',
  'sgd',
  'thb',
  'try',
  'twd',
  'uah',
  'vef',
  'vnd',
  'zar',
];

export const filterOptionDropdownList = filterOptions.map((o, idx) => {
  return {
    label: o.toUpperCase(),
    value: idx,
  };
});

const FilterOptions = ({ startDate, endDate, currency, startBalance, onCancel, onConfirm }) => {
  let { network: networkName } = useContext(DataContext);
  const [sDate, setSDate] = useState(startDate);
  const [eDate, setEDate] = useState(endDate);
  const [_currency, setCurrency] = useState(currency);
  const [_startBalance, setStartBalance] = useState(startBalance);
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    value: number;
  }>({
    label: 'USD',
    value: 0,
  });
  const handleStartDateChange = useCallback((date) => {
    setSDate(dayjs(date).format('YYYY-MM-DD'));
  }, []);
  const handleEndDateChange = useCallback((date) => {
    setEDate(dayjs(date).format('YYYY-MM-DD'));
  }, []);
  const handleCurrencyChange = useCallback((e) => {
    setCurrency(e.label);
    setSelectedOption({
      label: e.label,
      value: e.value,
    });
  }, []);
  const handleStartBalanceChange = useCallback((e) => {
    setStartBalance(e.target.value);
  }, []);
  const materialTheme = createTheme({
    overrides: {
      MuiPickersDay: {
        day: {
          color: 'black',
        },
        daySelected: {
          backgroundColor: '#21aca8',
          color: 'white',
          '&:hover': {
            backgroundColor: '#2ee6e0',
          },
        },
        dayDisabled: {
          color: 'gray',
        },
        current: {
          color: '#21aca8',
        },
      },
    },
  });
  const _onConfirm = useCallback(() => {
    onConfirm(sDate, eDate, _currency, _startBalance);
  }, [_currency, _startBalance, eDate, onConfirm, sDate]);

  const filtersDOM = useMemo(() => {
    return (
      <FilterOptionLayout>
        <FiltersTitle>Filters</FiltersTitle>
        <AdvancedOption>
          <FilterItem>
            <div style={{ color: 'white', width: '100%' }}>
              <ThemeProvider theme={materialTheme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    disableToolbar
                    format="YYYY-MM-DD"
                    margin="normal"
                    id="date-picker-inline"
                    label="Start Date"
                    value={sDate}
                    onChange={handleStartDateChange}
                  />
                </MuiPickersUtilsProvider>
              </ThemeProvider>
            </div>
          </FilterItem>
          <FilterItem>
            <div style={{ color: 'white', width: '100%' }}>
              <ThemeProvider theme={materialTheme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    disableToolbar
                    format="YYYY-MM-DD"
                    margin="normal"
                    id="date-picker-inline"
                    label="End Date"
                    value={eDate}
                    onChange={handleEndDateChange}
                  />
                </MuiPickersUtilsProvider>
              </ThemeProvider>
            </div>
          </FilterItem>
          <div style={{ marginTop: '16px' }}></div>
          <FilterItem>
            <div style={{ color: 'white', width: '100%' }}>
              <div
                style={{
                  color: '#535a62',
                  fontSize: '13px',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  marginBottom: 6,
                }}
              >
                Currency
              </div>
              <DropdownCommon
                style={{ flex: 1, width: '100%' }}
                borderBottom="1px solid rgba(215, 216, 217, 0.42)"
                options={filterOptionDropdownList}
                value={selectedOption}
                onChange={handleCurrencyChange}
                theme="dark"
              />
            </div>
          </FilterItem>
          <div style={{ marginTop: '16px' }}></div>
          <FilterItem>
            <div style={{ color: 'white', width: '100%' }}>
              <span
                style={{
                  color: '#535a62',
                  fontSize: '13px',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                Start Balance
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Input
                  style={{ width: '80%', borderBottom: '1px solid rgba(215, 216, 217, 0.42)' }}
                  onChange={handleStartBalanceChange}
                  value={_startBalance}
                />
                <span style={{ color: '#23beb9', fontSize: 20 }}>{networkCapitalCodeName(networkName)}</span>
              </div>
            </div>
          </FilterItem>
        </AdvancedOption>

        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 32 }}>
          <Button title="cancel" onClick={onCancel} />
          <Button title="confirm" onClick={_onConfirm} />
        </div>
      </FilterOptionLayout>
    );
  }, [
    _onConfirm,
    _startBalance,
    eDate,
    handleCurrencyChange,
    handleEndDateChange,
    handleStartBalanceChange,
    handleStartDateChange,
    materialTheme,
    networkName,
    onCancel,
    sDate,
    selectedOption,
  ]);

  return <div>{filtersDOM}</div>;
};

export default FilterOptions;

const FilterOptionLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
`;

const AdvancedOption = styled.div`
  margin-top: 4px;
  margin-bottom: 4px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: #23beb9;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
`;

const FiltersTitle = styled.div`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: white;
`;

// const HorizontalBar = styled.div`
//   width: 100%;
//   height: 0;
//   margin: 8px 18.7px 0 0;
//   border: solid 1px #d7d8d9;
// `;

const FilterItem = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
