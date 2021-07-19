import styled from 'styled-components';
import Identicon from '@polkadot/react-identicon';
import ReactTooltip from 'react-tooltip';
import { ReactComponent as FavoriteIcon } from '../../assets/images/favorite-selected.svg';
import { ReactComponent as FavoriteUnselectedIcon } from '../../assets/images/favorite-unselected.svg';
import { ReactComponent as UnclaimedPayoutsIcon } from '../../assets/images/unclaimed-payouts.svg';
import '../../css/ToolTip.css';
import { IStatusChange } from '../../instance/CryptoLabHandler';
import { shortenStashId } from '../../utils/string';
import { useCallback, useState } from 'react';

export interface IValidNominator {
  address: string;
  name: string;
  activeAmount: string;
  totalAmount: string;
  apy: string;
  count: number;
  commission: number;
  statusChange: IStatusChange;
  unclaimedPayouts: number;
  favorite: boolean;
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
  statusChange,
  unclaimedPayouts,
  favorite,
  onClick,
}) => {

  const Favorite = ({ address }) => {
    const [favorite, setFavoriteIcon] = useState(false);
    const setFavorite = useCallback(() => {
      let str = localStorage.getItem('favorite-validators');
      let validators: string[] = [];
      if (str === null) {
        validators = [];
      } else {
        validators = JSON.parse(str);
      }
      validators.push(address);
      localStorage.setItem('favorite-validators', JSON.stringify(validators));
    }, [address]);
    const unsetFavorite = useCallback(() => {
      let str = localStorage.getItem("favorite-validators");
      let validators: string[] = [];
      if (str === null) {
        validators = [];
      } else {
        validators = JSON.parse(str);
      }
      const idx = validators.indexOf(address)
      if (idx >= 0) {
        validators.splice(idx, 1);
      }
      localStorage.setItem('favorite-validators', JSON.stringify(validators));
    }, [address]);
    if (favorite) {
      return (<FavoriteIcon 
        onClick={() => {
          unsetFavorite();
          setFavoriteIcon(false);
        }} />);
    } else {
      return (<FavoriteUnselectedIcon 
        onClick={() => {
          setFavorite();
          setFavoriteIcon(true);
        }
        } />);
    }
  }

  const Status = () => {
    if (unclaimedPayouts >= 20) {
      return (<UnclaimedPayoutsIcon />);
    } else {
      return (<div></div>);
    }
  };

  const shortenName = shortenStashId(name);
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
        <FavoriteLayout>
          <Favorite 
          address={address}/>
        </FavoriteLayout>
        <StatusLayout>
          <Status />
        </StatusLayout>
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
            Average APY：
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
  justify-content: center;
`;

const FavoriteLayout = styled.div`
  flex: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: -80px 48px 0 0;
`;

const StatusLayout = styled.div`
  flex: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: -20px 48px 0 0;
`;
