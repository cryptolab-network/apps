import styled from 'styled-components';
import { ReactComponent as WalletGuide } from '../../../assets/images/guide-wallet.svg';
import { ReactComponent as StakingGuide } from '../../../assets/images/guide-staking.svg';

const GraphicalGuide = () => {
  return (
    <GraphicalGuideLayout>
      <WalletGuide />
      <StakingGuide />
    </GraphicalGuideLayout>
  );
};

export default GraphicalGuide;

const GraphicalGuideLayout = styled.div`
  padding: 17.5px 17px 24.2px 16px;
  border-radius: 10px;
  background-color: #17212d;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
