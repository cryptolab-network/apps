import styled from 'styled-components';
import Identicon from '@polkadot/react-identicon';
import ReactTooltip from 'react-tooltip';
import { ReactComponent as FavoriteIcon } from '../../assets/images/favorite-selected.svg';
import { ReactComponent as FavoriteUnselectedIcon } from '../../assets/images/favorite-unselected.svg';
import { ReactComponent as UnclaimedPayoutsIcon } from '../../assets/images/unclaimed-payouts.svg';
import { ReactComponent as ActiveBannerIcon } from '../../assets/images/active-banner.svg';
import { ReactComponent as CommissionUpIcon } from '../../assets/images/commission_up.svg';
import { ReactComponent as CommissionDownIcon } from '../../assets/images/commission_down.svg';
import '../../css/ToolTip.css';
import { shortenStashId } from '../../utils/string';
import { useMemo, useState } from 'react';
import { lsSetFavorite, lsUnsetFavorite } from '../../utils/localStorage';
import { IStatusChange } from '../../apis/Validator';

import { useTranslation } from 'react-i18next';

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

const Favorite = ({ address, _favorite }) => {
  const { t } = useTranslation();
  const [favorite, setFavoriteIcon] = useState(_favorite);
  if (favorite) {
    return (
      <div>
        <ReactTooltip
          id="unfavorite"
          place="bottom"
          effect="solid"
          backgroundColor="#18232f"
          textColor="#21aca8"
        />
        <EnhanceValue data-for="unfavorite" data-tip={t('tools.valnom.unfavorite')}>
          <FavoriteIcon
            onClick={() => {
              lsUnsetFavorite(address);
              setFavoriteIcon(false);
            }}
          />
        </EnhanceValue>
      </div>
    );
  } else {
    return (
      <div>
        <ReactTooltip
          id="favorite"
          place="bottom"
          effect="solid"
          backgroundColor="#18232f"
          textColor="#21aca8"
        />
        <EnhanceValue data-for="favorite" data-tip={t('tools.valnom.favorite')}>
          <FavoriteUnselectedIcon
            onClick={() => {
              lsSetFavorite(address);
              setFavoriteIcon(true);
            }}
          />
        </EnhanceValue>
      </div>
    );
  }
};
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
  const { t } = useTranslation();

  const Status = useMemo(() => {
    if (unclaimedPayouts >= 20) {
      return (
        <div>
          <ReactTooltip
            id="unclaimed-payouts"
            place="bottom"
            effect="solid"
            backgroundColor="#18232f"
            textColor="#21aca8"
          />
          <EnhanceValue data-for="favorite" data-tip={t('tools.valnom.tips.tooManyUnclaimedPayouts')}>
            <UnclaimedPayoutsIcon />
          </EnhanceValue>
        </div>
      );
    } else {
      return <div></div>;
    }
  }, [t, unclaimedPayouts]);

  const activeBanner = useMemo(() => {
    return (
      <ActiveBannerLayout>
        {parseFloat(activeAmount) > 0 ? <ActiveBannerIcon /> : <div></div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <StatusLayout
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {Status}
          </StatusLayout>
          <FavoriteLayout
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Favorite address={address} _favorite={favorite} />
          </FavoriteLayout>
        </div>
      </ActiveBannerLayout>
    );
  }, [Status, activeAmount, address, favorite]);

  const Commission = useMemo(() => {
    if (statusChange.commission === 1) {
      return (
        <ValuePart>
            {t('tools.valnom.tips.commission')}:<EnhanceValue>{commission}%</EnhanceValue>
            <CommissionUpIcon />
        </ValuePart>
      );
    }
    if (statusChange.commission === 2) {
      return (
        <ValuePart>
            {t('tools.valnom.tips.commission')}:<EnhanceValue>{commission}%</EnhanceValue>
            <CommissionDownIcon />
        </ValuePart>
      );
    }
    return (
      <ValuePart>
          {t('tools.valnom.tips.commission')}:<EnhanceValue>{commission}%</EnhanceValue>
      </ValuePart>
    );
  }, [commission, statusChange.commission, t]);

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
        <div style={{ width: '100%' }}>{activeBanner}</div>

        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Identicon value={address} size={35} theme={'polkadot'} />
        </div>
        <Name>{shortenName}</Name>
        <ValuePart>
          <EnhanceValue data-for="activeAmount" data-tip={t('tools.valnom.tips.activeAmounts')}>
            {activeAmount}
          </EnhanceValue>{' '}
          /{' '}
          <span data-for="totalAmount" data-tip={t('tools.valnom.tips.totalAmounts')}>
            {totalAmount}
          </span>
          <div data-for="apy" data-tip={t('tools.valnom.tips.apy')}>
            {t('tools.valnom.tips.averageApy')}
            <EnhanceValue>{apy}%</EnhanceValue>
          </div>
        </ValuePart>
      </MainInfo>
      <SubInfo>
        <ValuePart>
          {t('tools.valnom.tips.nominatorCount')}:<EnhanceValue>{count}</EnhanceValue>
        </ValuePart>
        {Commission}
      </SubInfo>
    </ValidNominatorLayout>
  );
};

export default ValidNominator;

const ValidNominatorLayout = styled.div`
  width: 224px;
  height: 270px;
  box-sizing: border-box;
  padding: 20px 1px 15px;
  /* margin: 4px; */
  border-radius: 8px;
  background-color: #2f3842;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  &:hover {
    border: solid 1px #23beb9;
    padding: 19px 0px 14px 0px;
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
  word-wrap: break-word;
  width: 90%;
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
  margin-right: 16px;
`;

const ActiveBannerLayout = styled.div`
  flex: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 0 0;
`;

const StatusLayout = styled.div`
  flex: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;
