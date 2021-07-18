import styled from 'styled-components';
import Identicon from '@polkadot/react-identicon';
import ReactTooltip from 'react-tooltip';
import '../../css/ToolTip.css';

export interface IValidNominator {
  address: string;
  name: string;
  activeAmount: number;
  totalAmount: number;
  apy: number;
  count: number;
  commission: number;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const ValidNomiator: React.FC<IValidNominator> = ({
  address,
  name,
  activeAmount,
  totalAmount,
  apy,
  count,
  commission,
  onClick,
}) => {
  return (
    <ValidNomiatorLayout onClick={onClick}>
      <ReactTooltip
        id="activeAmount"
        place="bottom"
        effect="solid"
        backgroundColor="#18232f"
        textColor="#21aca8"
      />
      <ReactTooltip
        id="totalAmount"
        place="bottom"
        effect="solid"
        backgroundColor="#18232f"
        textColor="#21aca8"
      />
      <ReactTooltip id="apy" place="bottom" effect="solid" backgroundColor="#18232f" textColor="#21aca8" />
      <MainInfo>
        <Identicon value={address} size={35} theme={'polkadot'} />
        <Name>{name}</Name>
        <ValuePart>
          <EnhanceValue data-for="activeAmount" data-tip="active amount">
            {activeAmount} KSM
          </EnhanceValue>{' '}
          /{' '}
          <span data-for="totalAmount" data-tip="total amount">
            {totalAmount} KSM
          </span>
          <div data-for="apy" data-tip="Annual Percentage Yield">
            APY：
            <EnhanceValue>{apy}%</EnhanceValue>
          </div>
        </ValuePart>
      </MainInfo>
      <SubInfo>
        <ValuePart>
          Nominator Count：<EnhanceValue>{count}</EnhanceValue>
        </ValuePart>
        <ValuePart>
          Commission：<EnhanceValue>{commission}%</EnhanceValue>
        </ValuePart>
      </SubInfo>
    </ValidNomiatorLayout>
  );
};

export default ValidNomiator;

const ValidNomiatorLayout = styled.div`
  width: 174px;
  height: 199px;
  box-sizing: border-box;
  padding: 20px 2px 15px;
  margin: 4px;
  border-radius: 8px;
  background-color: #2f3842;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  &:hover {
    border: solid 1px #23beb9;
    padding: 19px 0px 14px;
  }
`;

const MainInfo = styled.div`
  flex: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const Name = styled.div`
  font-family: Montserrat;
  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  text-align: center;
  color: white;
`;
const ValuePart = styled.div`
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  text-align: center;
  color: white;
`;
const EnhanceValue = styled.span`
  color: #21aca8;
`;

const SubInfo = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
