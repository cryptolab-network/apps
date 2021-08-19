import { useMemo, useCallback, useState } from 'react';
import Button from '../../../../components/Button';
import { createTheme } from '@material-ui/core/styles';
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';
import { ThemeProvider } from '@material-ui/styles';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import styled from 'styled-components';
import moment from 'moment';

import './FilterOptions.css';
import DropdownCommon from '../../../../components/Dropdown/Common';
import Input from '../../../../components/Input';

type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};

declare module '@material-ui/core/styles/overrides' {
  export interface ComponentNameToClassKey extends overridesNameToClassKey {}
}

export const filterOptions = ['USD', 'TWD', 'JPY'];

export const filterOptionDropdownList = filterOptions.map((o, idx) => {
  return {
    label: o,
    value: idx + 1,
  };
});

const FilterOptions = ({
  startDate,
  endDate,
  currency,
  startBalance,
  onStartDateChange,
  onEndDateChange,
  onCurrencyChange,
  onStartBalanceChange,
  onCancel,
  onConfirm,
}) => {
  const [sDate, setSDate] = useState(startDate);
  const [eDate, setEDate] = useState(endDate);
  const [_currency, setCurrency] = useState(currency);
  const [_startBalance, setStartBalance] = useState(startBalance);
  const handleStartDateChange = useCallback(
    (date) => {
      setSDate(moment(date).format('YYYY-MM-DD'));
      onStartDateChange(moment(date).format('YYYY-MM-DD'));
    },
    [onStartDateChange]
  );
  const handleEndDateChange = useCallback(
    (date) => {
      setEDate(moment(date).format('YYYY-MM-DD'));
      onEndDateChange(moment(date).format('YYYY-MM-DD'));
    },
    [onEndDateChange]
  );
  const handleCurrencyChange = useCallback(
    (e) => {
      setCurrency(e.label);
      onCurrencyChange(e.label);
    },
    [onCurrencyChange]
  );
  const handleStartBalanceChange = useCallback(
    (e) => {
      setStartBalance(e.label);
      onStartBalanceChange(e.label);
    },
    [onStartBalanceChange]
  );
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

  const filtersDOM = useMemo(() => {
    return (
      <FilterOptionLayout>
        <FiltersTitle>Filters</FiltersTitle>
        <AdvancedOption>
          <FilterItem>
            <div style={{ color: 'white' }}>
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
            <div style={{ color: 'white' }}>
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
          <FilterItem>
            <div style={{ color: 'white' }}>
              <DropdownCommon
                style={{ flex: 1, width: '200px' }}
                options={filterOptionDropdownList}
                value={_currency}
                onChange={handleCurrencyChange}
                theme="dark"
              />
            </div>
          </FilterItem>
          <FilterItem>
            <div style={{ color: 'white' }}>
              Start Balance
              <Input style={{ width: '80%' }} onChange={handleStartBalanceChange} value={_startBalance} />
            </div>
          </FilterItem>
        </AdvancedOption>

        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 32 }}>
          <Button title="cancel" onClick={onCancel} />
          <Button title="confirm" onClick={onConfirm} />
        </div>
      </FilterOptionLayout>
    );
  }, [
    _currency,
    _startBalance,
    eDate,
    handleCurrencyChange,
    handleEndDateChange,
    handleStartBalanceChange,
    handleStartDateChange,
    materialTheme,
    sDate,
  ]);

  return <div>{filtersDOM}</div>;
};

export default FilterOptions;

const FilterOptionLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const AdvancedOption = styled.div`
  margin-top: 4px;
  margin-bottom: 4px;
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
`;
