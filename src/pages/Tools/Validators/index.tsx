import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatBalance } from '@polkadot/util';
import { apiGetSingleValidator, INominator, IValidatorHistory } from '../../../apis/Validator';
import { ReactComponent as PrevArrow } from '../../../assets/images/prev-arrow.svg';
import Account from '../../../components/Account';
import CardHeader from '../../../components/Card/CardHeader';
import { useHistory } from 'react-router-dom';
import { NominatorGrid } from './NominatorGrid';

const ValidatorStatusHeader = ({
  chain,
  validator
}) => {
  const history = useHistory();
  let active = 0;
  let total = 0;
  let nominatorCount = 0;
  let commission = 0;
  if (validator.info.length > 0) {
    active = validator.info[validator.info.length - 1].exposure.total;
    total = validator.info[validator.info.length - 1].nominators.reduce((acc, n) => {
      return acc += n.balance.lockedBalance;
    }, 0);
    nominatorCount = validator.info[validator.info.length - 1].nominatorCount;
    commission = validator.info[validator.info.length - 1].commission;
  }
  const _formatBalance = useCallback((value: any) => {
    if (chain === 'KSM') {
      return (formatBalance(BigInt(value), {
        decimals: 12,
        withUnit: 'KSM'
      }));
    } else if (chain === 'DOT') {
      return (formatBalance(value, {
        decimals: 10,
        withUnit: 'DOT'
      }));
    } else {
      return (formatBalance(value, {
        decimals: 10,
        withUnit: 'Unit'
      }));
    }
  }, [chain]);
  return (
    <HeaderLayout>
      <HeaderLeft>
        <PrevArrowLayout>
          <PrevArrow onClick={() => {
            history.goBack();
          }}/>
        </PrevArrowLayout>
        <HeaderTitle>
          <Title>
            <Account address={validator.id} display={validator.identity.display}/>
          </Title>
          <Subtitle>{validator.id}</Subtitle>
        </HeaderTitle>
      </HeaderLeft>
      <HeaderRight>
        <Exposure>
          <ExposureActive>
            {_formatBalance(active)}
          </ExposureActive>
          <span style={{color: 'white', margin:'0 4px 0 4px'}}>/</span>
          <ExposureTotal>
            {_formatBalance(total)}
          </ExposureTotal>
        </Exposure>
        <Value>
          <ValueTitle>APY:</ValueTitle>
          {(validator.averageApy * 100).toFixed(2)} %
        </Value>
        <Value>
          <ValueTitle>Nominator Count:</ValueTitle>
          {nominatorCount}
        </Value>
        <Value>
          <ValueTitle>Commission:</ValueTitle>
          {commission} %
        </Value>
      </HeaderRight>
    </HeaderLayout>
  );
};

const ValidatorStatus = (props) => {
  const [activeNominators, setActiveNominators] = useState<INominator[]>([]);
  const [nominators, setNominators] = useState<INominator[]>([]);
  const [validator, setValidator] = useState<IValidatorHistory>({
    id: '',
    statusChange: {
      commissionChange: 0
    },
    identity: {
      display: ''
    },
    info: [],
    averageApy: 0
  });
  useEffect(() => {
    async function getValidator() {
      // load stash data from backend
      let validator: IValidatorHistory = await apiGetSingleValidator({ params: `${props.match.params.id}/KSM` });
      // TODO: error handling not yet
      setValidator(validator);
      if (validator.info.length > 0) {
        const _nominators = validator.info[validator.info.length - 1].nominators;
        const active = validator.info[validator.info.length - 1].exposure.others.reduce((acc: INominator[], v) => {
          acc.push({
            address: v.who,
            balance: v.value,
          });
          return acc;
        }, []);
        setActiveNominators(active);
        const inactive = _nominators.filter(({ address: id1 }) => !active.some(({ address: id2 }) => id2 === id1));
        setNominators(inactive);
      }
    }
    getValidator();
  }, [props.match.params.id]);
  return (
    <ValidatorStatusLayout>
      <MainLayout>
        <CardHeader
          Header={() => (
            <ValidatorStatusHeader
              validator={validator}
              chain={props.match.params.chain}
            />
          )}
        >
          <ContentColumnLayout width="100%" justifyContent="flex-start">
              <ContentBlockTitle color="white">Active Nominators</ContentBlockTitle>
              <NominatorGrid
              chain={props.match.params.chain}
              nominators={activeNominators}/>
          </ContentColumnLayout>
          <Space />
          <ContentColumnLayout width="100%" justifyContent="flex-start">
              <ContentBlockTitle color="white">Inactive Nominators</ContentBlockTitle>
              <NominatorGrid
              chain={props.match.params.chain}
              nominators={nominators}/>
          </ContentColumnLayout>
        </CardHeader>
      </MainLayout>
    </ValidatorStatusLayout>
  );
};

export default ValidatorStatus;

const ValidatorStatusLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainLayout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const HeaderLayout = styled.div`
  width: 100%;
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

const PrevArrowLayout = styled.div`
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 18px;
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
  width: 600px;
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
  margin: 8px 0 0 0;
`;

const Exposure = styled.div`
  display: flex;
  flex-direction: row;
  width: 240px;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.42;
  letter-spacing: normal;
  text-align: left;
  color: var(--nav-fg);
  margin: 0 21.4px 0 0;
`;

const ExposureActive = styled.div`
  color: #23beb9;
  margin: 0 4px 0 0;
`;

const ExposureTotal = styled.div`
  color: white;
`;

const Value = styled.div`
  display: flex;
  flex-direction: row;
  width: 160px;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.42;
  letter-spacing: normal;
  text-align: left;
  color: #23beb9;
  margin: 0 21.4px 0 0;
`;

const ValueTitle = styled.div`
  color: white;
  margin: 0 8px 0 0;
`;
type ContentColumnLayoutProps = {
  justifyContent?: string;
  width?: string;
};
const ContentColumnLayout = styled.div<ContentColumnLayoutProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : 'space-between')};
  align-items: flex-start;
  width: ${(props) => (props.width ? props.width : '90%')};
`;
const ContentBlockTitle = styled.div`
  flex: 1;
  color: ${(props) => (props.color ? props.color : '#17222d')};
  min-height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  margin-left: -8px;
`;

const Space = styled.div`
  margin: 40px 0 0 0;
`;