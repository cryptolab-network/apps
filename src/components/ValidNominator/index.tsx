import styled from 'styled-components';
import Identicon from '@polkadot/react-identicon';
import ReactTooltip from 'react-tooltip';
import '../../css/ToolTip.css';

export interface IValidNominator {
  address: string;
  name: string;
  activeAmount: string;
  totalAmount: string;
  apy: string;
  count: number;
  commission: number;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const ValidNominator: React.FC<IValidNominator> = ({
  address,
  name,
  activeAmount,
  totalAmount,
  apy,
  count,
  commission,
  onClick,
}) => {
  let shortenName = name;
  if (shortenName.length > 35) {
    shortenName = shortenName.substring(0, 5) + '...' + shortenName.substring(shortenName.length - 5);
  }
  return (
    <ValidNominatorLayout onClick={onClick}>
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
        <Name>{shortenName}</Name>
        <ValuePart>
          <EnhanceValue data-for="activeAmount" data-tip="active amount">
            {activeAmount}
          </EnhanceValue>{' '}
          /{' '}
          <span data-for="totalAmount" data-tip="total amount">
            {totalAmount}
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
    </ValidNominatorLayout>
  );
};

export default ValidNominator;

const ValidNominatorLayout = styled.div`
  width: 224px;
  height: 270px;
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
