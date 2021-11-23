import { useCallback, useState } from 'react';
import styled from 'styled-components';
import Row from './Row';
import { ReactComponent as DashboardIcon } from '../../../../../assets/images/dashboard.svg';
import { ReactComponent as ActiveIcon } from '../../../../../assets/images/active.svg';
import { ReactComponent as InactiveIcon } from '../../../../../assets/images/inactive.svg';
import { ReactComponent as ExpendIcon } from '../../../../../assets/images/expand-arrow.svg';
import dayjs from 'dayjs';
import { balanceUnit } from '../../../../../utils/string';

const OneKvValidCard = ({
  validatorId,
  name,
  commission,
  active,
  nominated,
  nominatedAt,
  order,
  selfStake,
  rank,
  inclusion,
  chain,
}) => {
  const [isExpend, setIsExpend] = useState(false);

  const _formatBalance = useCallback(
    (value: any) => {
      return <span>{balanceUnit(chain, value, true, true)}</span>;
    },
    [chain]
  );

  return (
    <MainLayout>
      <CardLayout>
        <Row
          label="Dashboard"
          value={
            <DashboardIcon
              onClick={() => {
                console.log(`dashboard of validator ${validatorId} has been clicked`);
                // onClickDashboard(validatorId);
              }}
            />
          }
        />
        <Row label="Name" value={<div>{name}</div>} />
        <Row label="Commission" value={<div>{commission / 10000000}%</div>} />
        <div style={{ maxHeight: isExpend ? 500 : 0, overflow: 'hidden' }}>
          <Row label="Active" value={active > 0 ? <ActiveIcon /> : <InactiveIcon />} />
          <Row
            label="1KV Nominated"
            value={
              nominated === true ? (
                <ActiveIcon />
              ) : (
                <OneKVNominated>
                  <InactiveIcon />
                  <LastNominationDate>({dayjs(nominatedAt).format('MM/DD')})</LastNominationDate>
                </OneKVNominated>
              )
            }
          />
          <Row label="Nomination Order" value={<div>{order}</div>} />
          <Row label="Self Stake" value={<div>{_formatBalance(selfStake)}</div>} />
          <Row label="Rank" value={<div>{rank}</div>} />
          <Row label="Inclusion" value={<div>{(inclusion * 100).toFixed(2)}%</div>} />
        </div>
        <ExpendArrow
          onClick={() => {
            setIsExpend((prev) => !prev);
          }}
        >
          <ExpendIcon
            style={{
              transform: isExpend ? 'rotate(180deg)' : 'none',
              transitionDuration: '0.2s',
              stroke: isExpend ? '#23beb9' : '#17222d',
            }}
          />
        </ExpendArrow>
      </CardLayout>
    </MainLayout>
  );
};

export default OneKvValidCard;

const MainLayout = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
`;

const CardLayout = styled.div`
  box-sizing: border-box;
  width: 100%;
  border-radius: 8px;
  padding: 18px 12px 0px 12px;
  background-color: #2f3842;
  color: white;
`;

const OneKVNominated = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LastNominationDate = styled.div`
  margin: 0 0 0 4px;
  justify-content: center;
  align-items: center;
`;

const ExpendArrow = styled.div`
  min-height: 28px;
  box-sizing: border-box;
  width: 100%;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
