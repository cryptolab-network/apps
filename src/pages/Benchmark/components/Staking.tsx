import { useEffect, useState } from 'react';
import CardHeader from '../../../components/Card/CardHeader';
import Input from '../../../components/Input';
import DropdownCommon from '../../../components/Dropdown/Common';
import Node from '../../../components/Node';
import Warning from '../../../components/Hint/Warn';
import TimeCircle from '../../../components/Time/Circle';
import { ReactComponent as BeakerSmall } from '../../../assets/images/beaker-small.svg';
import { ReactComponent as KSMLogo } from '../../../assets/images/ksm-logo.svg';
import { ReactComponent as OptionIcon } from '../../../assets/images/option-icon.svg';
import { ReactComponent as GreenArrow } from '../../../assets/images/green-arrow.svg';
import styled from 'styled-components';
import _ from 'lodash';
import Button from '../../../components/Button';

const StakingHeader = () => {
  return (
    <HeaderLayout>
      <HeaderLeft>
        <BeakerSmall />
        <HeaderTitle>
          <Title>Staking</Title>
          <Subtitle>Select the preferred type for evaluation</Subtitle>
        </HeaderTitle>
      </HeaderLeft>
      <HeaderRight>
        <OptionIcon />
      </HeaderRight>
    </HeaderLayout>
  );
};

interface iOption {
  label: string;
  value: number;
}

const Staking = () => {
  const [inputData, setInputData] = useState({ stakeAmount: 0, strategy: {}, rewardDestination: null });
  const [strategyOptions, setStrategyOptions] = useState<iOption[]>([]);

  useEffect(() => {
    // get strategy options
    const result = [
      { label: 'General', value: 1 },
      { label: 'Aggressive', value: 2 },
      { label: 'High frenquency ', value: 3 },
    ];

    setStrategyOptions(result);
    setInputData((prev) => {
      if (_.isEmpty(prev.strategy)) {
        return { ...prev, strategy: result[0] };
      } else {
        return { ...prev };
      }
    });
  }, []);

  const handleInputChange = (name) => (e) => {
    let tmpValue;
    switch (name) {
      case 'stakeAmount':
        if (!isNaN(e.target.value)) {
          tmpValue = e.target.value;
          // TODO: deal with input number format and range
        } else {
          // not a number
          return;
        }
        break;
      case 'strategy':
        tmpValue = e;
        break;
      case 'rewardDestination':
        tmpValue = e;
        break;
      default:
        // stakeAmount
        tmpValue = e.target.value;
        break;
    }
    setInputData((prev) => ({ ...prev, [name]: tmpValue }));
  };

  return (
    <>
      <CardHeader Header={StakingHeader}>
        <ContentBlock>
          <ContentBlockLeft>
            <KSMLogo />
            <LogoTitle>KSM</LogoTitle>
          </ContentBlockLeft>
          <ContentBlockRight>
            <Balance>Balance: 23778.50331</Balance>
            <Input
              style={{ width: '80%' }}
              onChange={handleInputChange('stakeAmount')}
              value={inputData.stakeAmount}
            />
          </ContentBlockRight>
        </ContentBlock>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 4 }}>
          <GreenArrow />
        </div>
        <ContentBlock>
          <ContentBlockLeft>
            <ContentColumnLayout>
              <ContentBlockTitle>Strategy</ContentBlockTitle>
              <DropdownCommon
                style={{ flex: 1, width: '90%' }}
                options={strategyOptions}
                value={inputData.strategy}
                onChange={handleInputChange('strategy')}
              />
              <ContentBlockFooter />
            </ContentColumnLayout>
          </ContentBlockLeft>
          <ContentBlockRight>
            <ValueStyle>16.5%</ValueStyle>
          </ContentBlockRight>
        </ContentBlock>
        <div style={{ height: 17 }}></div>
        <ContentBlock style={{ backgroundColor: '#2E3843', height: 'auto' }}>
          <ContentColumnLayout width="100%" justifyContent="flex-start">
            <ContentBlockTitle color="white">Reward Destination</ContentBlockTitle>
            <DropdownCommon
              style={{ flex: 1, width: '100%' }}
              options={[
                { label: 'Specified payment account', value: 0, isDisabled: true },
                { label: 'wallet 001', value: 1 },
                { label: 'wallet 002', value: 2 },
              ]}
              value={inputData.rewardDestination}
              onChange={handleInputChange('rewardDestination')}
              theme="dark"
            />
            <Node title="CONTROLLER-HSINCHU" address="GiCAS2RKmFajjJNvc39rMRc83hMhg0BgT…" />
            <ContentBlockFooter style={{ minHeight: 50 }} />
          </ContentColumnLayout>
        </ContentBlock>
        <FooterLayout>
          <div style={{ marginBottom: 12 }}>
            <Button
              title="Nominate"
              onClick={() => {
                console.log('Nominate');
              }}
              style={{ width: 220 }}
            />
          </div>
          <Warning msg="There is currently an ongoing election for new validator candidates. As such staking operations are not permitted." />
        </FooterLayout>
      </CardHeader>
      <DashboardLayout>
        <TimeCircle />
        <TimeCircle />
      </DashboardLayout>
    </>
  );
};

export default Staking;

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

const HeaderTitle = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 18px;
`;

const Title = styled.div`
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

const ContentBlock = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
`;

const ContentBlockLeft = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const LogoTitle = styled.div`
  padding-left: 18px;
  display: flex;
  flex-shrink: 1;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
`;

const Balance = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
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

type ContentBlockFooterProps = {
  minHeight?: string;
};
const ContentBlockFooter = styled.div<ContentBlockFooterProps>`
  flex-grow: 1;
  color: blue;
  width: 100%;
  min-height: ${(props) => (props.minHeight ? props.minHeight : '16px')};
`;

const ContentBlockRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
`;

const ValueStyle = styled.div`
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  color: #23beb9;
`;

const FooterLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 40.5px;
`;

const DashboardLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 32px;
`;
