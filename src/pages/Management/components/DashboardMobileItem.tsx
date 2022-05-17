import PropTypes from 'prop-types';
import { useMemo } from 'react';
import styled from 'styled-components';

const DashboardMobileItem = ({
  mainValue,
  mainValueDanger,
  MainIcon,
  title,
  subtitle,
  clickable,
  onClick,
}) => {
  const mainDOM = useMemo(() => {
    if (typeof mainValue === 'number' && mainValue >= 0) {
      if (mainValueDanger) {
        return <MainValue danger={true}>{mainValue}</MainValue>;
      } else {
        return <MainValue>{mainValue}</MainValue>;
      }
    } else {
      return (
        <div style={{ height: 49, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <MainIcon />
        </div>
      );
    }
  }, [MainIcon, mainValue, mainValueDanger]);

  return (
    <MainLayout clickable={clickable} onClick={onClick}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Title>{title}</Title>
        <SubTitle>{subtitle}</SubTitle>
      </div>
      {mainDOM}
    </MainLayout>
  );
};

DashboardMobileItem.propTypes = {
  mainValue: PropTypes.number,
  mainValueDanger: PropTypes.bool,
  MainIcon: PropTypes.any,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
};
DashboardMobileItem.defaultProps = {
  mainValue: undefined,
  mainValueDanger: false,
  MainIcon: undefined,
  title: '',
  subtitle: '',
  clickable: false,
};

export default DashboardMobileItem;

interface IMainLayout {
  clickable?: boolean;
}
const MainLayout = styled.div<IMainLayout>`
  height: 100%;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  padding: 8px 4px 8px 4px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
  border-bottom: 1px solid white;
`;

interface IMainValue {
  danger?: boolean;
}
const MainValue = styled.div<IMainValue>`
  font-family: Montserrat;
  font-size: 40px;
  font-weight: bold;
  color: ${(props) => (props.danger ? '#e6007a' : '#23beb9')};
`;

const Title = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  color: white;
`;

const SubTitle = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: bold;
  color: white;
  text-align: center;
  opacity: 0.29;
`;
