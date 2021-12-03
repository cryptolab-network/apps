import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { ReactComponent as DashboardIcon } from '../../../../../assets/images/dashboard.svg';
import { ReactComponent as ExpendIcon } from '../../../../../assets/images/expand-arrow.svg';
import Row from './Row';
import Reason from './Reason';

const OneKvInvalidCard = ({ validatorId, name, reason, chain }) => {
  const [isExpend, setIsExpend] = useState(false);
  const history = useHistory();

  const onClickDashboard = useCallback(
    (id: string) => {
      history.push(`/validator/${id}/${chain}`);
    },
    [chain, history]
  );

  return (
    <MainLayout>
      <CardLayout>
        <Row
          label="Dashboard"
          value={
            <DashboardIcon
              onClick={() => {
                onClickDashboard(validatorId);
              }}
            />
          }
        />
        <Row label="Name" value={<div>{name}</div>} />
        <div style={{ maxHeight: isExpend ? 500 : 0, overflow: 'hidden' }}>
          <Reason label="Reason" value={reason} />
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

export default OneKvInvalidCard;

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

const ExpendArrow = styled.div`
  min-height: 28px;
  box-sizing: border-box;
  width: 100%;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
