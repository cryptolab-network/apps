import { useEffect, useMemo, useState, useContext } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { ReactComponent as MonitorIcon } from '../../../../assets/images/monitor.svg';
import { ReactComponent as Search } from '../../../../assets/images/search.svg';

import CardHeader from '../../../../components/Card/CardHeader';
import IconInput from '../../../../components/Input/IconInput';
import { useAppSelector } from '../../../../hooks';
import { ApiContext } from '../../../../components/Api';

import { apiGetAllOneKVValidator, IOneKVInvalidValidator, IOneKVValidator, IOneKVValidators } from '../../../../apis/OneKV/validator';
import { apiGetOneKVNominators, IOneKVNominators } from '../../../../apis/OneKV/nominator';
import ValidatorTable from './oneKVValidTable';
import Button from '../../../../components/Button';
import { useCallback } from 'react';
import InvalidValidatorTable from './oneKVInvalidTable';

const OneKVHeader = ({onSeeValidClicked, seeValid}) => {
  const onClickSeeInvalid = useCallback(() => {
    onSeeValidClicked(seeValid);
  }, [onSeeValidClicked, seeValid]);
  const ValidityButton = useCallback(() => {
    if(seeValid) {
      return (<Button 
        title={'See Invalid'}
        onClick={onClickSeeInvalid} />);
    } else {
      return (<Button 
        title={'See Valid'}
        onClick={onClickSeeInvalid} />);
    }
  }, [onClickSeeInvalid, seeValid]);
  return (
    <HeaderLayout>
      <HeaderLeft>
        <MonitorIcon />
        <HeaderTitle>
          <Title>One Thousand Validator Monitor</Title>
          <Subtitle>Nomination order and data of all One Thousand Validators</Subtitle>
        </HeaderTitle>
      </HeaderLeft>
      <HeaderRight>
        <ValidityButton/>
      </HeaderRight>
    </HeaderLayout>
  );
};

const ValNomContent = ({ valid, chain, validators, activeEra, validValidators, activeValidators, electedValidators, lastUpdatedTime}) => {
  const [filters, setFilters] = useState({
    stashId: '',
  });
  const handleFilterChange = (name) => (e) => {
    // TODO: input validator, limit
    switch (name) {
      case 'stashId':
        setFilters((prev) => ({ ...prev, stashId: e.target.value }));
        break;
      default:
        break;
    }
  };
  const ValidatorTableComponent = useMemo(() => {
    if (valid) {
      return (
      <ValidatorTable
        filter={filters}
        chain={chain}
        validators={validators}
      />);
    } else {
      return (
        <InvalidValidatorTable
          filter={filters}
          chain={chain}
          validators={validators}
        />);
    }
  }, [chain, filters, valid, validators]);

  return (
    <div>
      <OptionBar>
        <HeaderLayout>
          <HeaderLeft>
            <IconInput
              Icon={Search}
              iconSize="16px"
              placeholder="Polkadot/Kusama Stash ID or Name"
              inputLength={256}
              value={filters.stashId}
              onChange={handleFilterChange('stashId')}
            />
          </HeaderLeft>
          <HeaderRight>
            <HeaderItem>
              Era: <span style={{color: '#23b3b9', margin:'0 4px 0 4px'}}>{activeEra}</span>
            </HeaderItem>
            <HeaderItem>
              Valid Validators: <span style={{color: '#23b3b9', margin:'0 4px 0 4px'}}>{validValidators}</span>
            </HeaderItem>
            <HeaderItem>
              Active Validators: <span style={{color: '#23b3b9', margin:'0 4px 0 4px'}}>{activeValidators}</span>
            </HeaderItem>
            <HeaderItem>
              1KV Elected Validators: <span style={{color: '#23b3b9', margin:'0 4px 0 4px'}}>{electedValidators}</span>
            </HeaderItem>
            <HeaderItem>
              Last Updated Time: <span style={{color: '#23b3b9', margin:'0 4px 0 4px'}}>{lastUpdatedTime}</span>
            </HeaderItem>
          </HeaderRight>
        </HeaderLayout>
      </OptionBar>
      {ValidatorTableComponent}
    </div>
  );
};

export const OneKVStatus = () => {
  // const networkName = useAppSelector(state => state.network.name);
  const { network: networkName } = useContext(ApiContext);
  const chain = (networkName === 'Polkadot') ? "DOT" : "KSM";
  const [validators, setValidators] = useState<IOneKVValidator[]>([]);
  const [invalidValidators, setInvalidValidators] = useState<IOneKVInvalidValidator[]>([]);
  const [activeEra, setActiveEra] = useState<number>(0);
  const [validValidators, setValidValidators] = useState<number>(0);
  const [activeValidators, setActiveValidators] = useState<number>(0);
  const [electedValidators, setElectedValidators] = useState<number>(0);
  const [lastUpdatedTime, setlastUpdatedTime] = useState<string>('N/A');
  useEffect(() => {
    const mergeOneKVData = (oneKV: IOneKVValidators, oneKVNominators: IOneKVNominators) => {
      oneKV.valid = oneKV.valid.map((v) => {
        v.elected = false;
        // eslint-disable-next-line array-callback-return
        oneKVNominators.nominators.map((n) => {
          // eslint-disable-next-line array-callback-return
          n.current.map((p) => {
            if (p.stash === v.stash) {
              v.elected = true;
            }
          });
        });
        return v;
      });
      return oneKV;
    };
    async function getValidators() {
      try {
        let oneKV = await apiGetAllOneKVValidator({ params: chain});
        setActiveEra(oneKV.activeEra);
        setValidValidators(oneKV.validatorCount);
        setActiveValidators(oneKV.electedCount);
        const oneKVNominators = await apiGetOneKVNominators({ params: chain });
        setElectedValidators(oneKVNominators.nominators.reduce((acc, n) => {
          acc += n.current.length;
          return acc;
        }, 0));
        oneKV = mergeOneKVData(oneKV, oneKVNominators);
        setValidators(oneKV.valid);
        setInvalidValidators(oneKV.invalid);
        setlastUpdatedTime(moment(oneKV.modifiedTime * 1000).toLocaleString());
      } catch (err) {
        console.error(err);
      }
    };
    getValidators();
  }, [chain]);
  const [seeValid, setSeeValid] = useState(true);

  const onSeeValidClicked = useCallback((value) => {
    if (value === true) {
      value = false;
    } else {
      value = true;
    }
    setSeeValid(value);
  }, []);
  const OneKVTable = ({ seeValid }) => {
    if (seeValid === true) {
      return (<ValNomContent
        valid={true}
        chain={chain}
        validators={validators}
        activeEra={activeEra}
        validValidators={validValidators}
        activeValidators={activeValidators}
        electedValidators={electedValidators}
        lastUpdatedTime={lastUpdatedTime}
      />);
    } else {
      return (<ValNomContent
        valid={false}
        chain={chain}
        validators={invalidValidators}
        activeEra={activeEra}
        validValidators={validValidators}
        activeValidators={activeValidators}
        electedValidators={electedValidators}
        lastUpdatedTime={lastUpdatedTime}
      />);
    }
  };
  return (
    <CardHeader
      Header={() => (
        <OneKVHeader
        onSeeValidClicked={onSeeValidClicked}
        seeValid={seeValid}/>
      )}
    >
    <OneKVTable
      seeValid={seeValid}
    />  
    </CardHeader>
  );
};

const HeaderLayout = styled.div`
  width: 80vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const HeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const HeaderTitle = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 18px;
`;

const Title = styled.div`
  max-width: 800px;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
`;

const Subtitle = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.55;
`;

const OptionBar = styled.div`
  width: 100%;
  height: 62px;
  padding: 12px 0px 0px 13.8px;
  border-radius: 6px;
  background-color: #2f3842;
`;

const HeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.42;
  letter-spacing: normal;
  text-align: left;
  color: white;
  margin: 0 20px 0 20px;
  align-item: center;
`;