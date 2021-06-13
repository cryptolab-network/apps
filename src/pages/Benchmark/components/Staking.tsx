import CardHeader from '../../../components/Card/CardHeader';
import Input from '../../../components/Input';
import DropdownCommon from '../../../components/Dropdown/Common';
import { ReactComponent as BeakerSmall } from '../../../assets/images/beaker-small.svg';
import { ReactComponent as KSMLogo } from '../../../assets/images/ksm-logo.svg';
import styled from 'styled-components';

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
      <HeaderRight></HeaderRight>
    </HeaderLayout>
  );
};

const Staking = () => {
  return (
    <CardHeader Header={StakingHeader}>
      <ContentBlock>
        <ContentBlockLeft>
          <KSMLogo />
          <LogoTitle>KSM</LogoTitle>
        </ContentBlockLeft>
        <ContentBlockRight>
          <Balance>Balance: 23778.50331</Balance>
          <Input style={{ width: '80%' }} />
        </ContentBlockRight>
      </ContentBlock>
      <div style={{ height: 34 }}></div>
      <ContentBlock>
        <ContentBlockLeft>
          <DropdownCommon
            style={{ width: '80%' }}
            options={[
              { label: '1', value: 1 },
              { label: '2', value: 2 },
            ]}
          />
        </ContentBlockLeft>
        <ContentBlockRight>
          <ValueStyle>16.5%</ValueStyle>
        </ContentBlockRight>
      </ContentBlock>
    </CardHeader>
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

type ContentBlockProps = {
  backgroundColor?: string;
};
const ContentBlock = styled.div<ContentBlockProps>`
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : 'white')};
  border-radius: 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 62px;
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
