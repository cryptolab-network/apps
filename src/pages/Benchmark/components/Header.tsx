import styled from 'styled-components';
import { useMemo } from 'react';
import Tooltip from '../../../components/Tooltip';
import Switch from '../../../components/Switch';
import { ReactComponent as OptionIcon } from '../../../assets/images/option-icon.svg';
import { ReactComponent as BeakerSmall } from '../../../assets/images/beaker-small.svg';

const StakingHeader = ({ advancedOption, optionToggle, onChange }) => {
  const advancedDOM = useMemo(() => {
    return (
      <AdvancedOptionLayout>
        <AdvancedOption>
          <span style={{ color: advancedOption.advanced ? '#23beb9' : '#fff' }}>Advanced</span>
          <div style={{ marginLeft: 16 }}>
            <Switch checked={advancedOption.advanced} onChange={onChange('advanced')} />
          </div>
        </AdvancedOption>
        <AdvancedOption>
          <span style={{ color: advancedOption.supportus ? '#23beb9' : '#fff' }}>Support us</span>
          <div style={{ marginLeft: 16 }}>
            <Switch checked={advancedOption.supportus} onChange={onChange('supportus')} />
          </div>
        </AdvancedOption>
      </AdvancedOptionLayout>
    );
  }, [advancedOption.advanced, advancedOption.supportus, onChange]);

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
        <Tooltip content={advancedDOM} visible={advancedOption.toggle} tooltipToggle={optionToggle}>
          <OptionIcon />
        </Tooltip>
      </HeaderRight>
    </HeaderLayout>
  );
};

export default StakingHeader;

const AdvancedOptionLayout = styled.div`
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
