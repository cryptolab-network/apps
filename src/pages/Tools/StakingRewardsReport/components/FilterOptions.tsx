import { useMemo } from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import styled from 'styled-components';
import moment from 'moment';
import { useCallback } from 'react';
import { useState } from 'react';

const FilterOptions = ({ startDate, endDate, currency }) => {
  const [sDate, setSDate] = useState(startDate);
  const handleDateChange = useCallback((date) => {
    setSDate(moment(date).format('YYYY-MM-DD'));
  }, []);
  const filtersDOM = useMemo(() => {
    return (
      <FilterOptionLayout>
        <FiltersTitle>Filters</FiltersTitle>
        <HorizontalBar />
        <AdvancedOption>
          <FilterItem>
            <div style={{ color: 'white' }}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  disableToolbar
                  variant="inline"
                  format="YYYY-MM-DD"
                  margin="normal"
                  id="date-picker-inline"
                  label="Start Date"
                  value={sDate}
                  onChange={handleDateChange}
                />
              </MuiPickersUtilsProvider>
            </div>
          </FilterItem>
        </AdvancedOption>
      </FilterOptionLayout>
    );
  }, [handleDateChange, sDate]);

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
  justify-content: space-between;
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

const HorizontalBar = styled.div`
  width: 100%;
  height: 0;
  margin: 8px 18.7px 0 0;
  border: solid 1px #404952;
`;

const FilterItem = styled.div`
  display: flex;
  flex-direction: row;
`;
