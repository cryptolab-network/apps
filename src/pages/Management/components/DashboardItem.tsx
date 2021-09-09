import PropTypes from 'prop-types';
import { useMemo } from 'react';
import styled from 'styled-components';

const DashboardItem = ({ mainValue, mainValueDanger, MainIcon, title, subtitle, clickable }) => {
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
    <MainLayout
      clickable={clickable}
      onClick={() => {
        if (clickable) {
          console.log('click');
        }
      }}
    >
      {mainDOM}
      <Title>{title}</Title>
      <SubTitle>{subtitle}</SubTitle>
    </MainLayout>
  );
};

DashboardItem.propTypes = {
  mainValue: PropTypes.number,
  mainValueDanger: PropTypes.bool,
  MainIcon: PropTypes.any,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  clickable: PropTypes.bool,
};
DashboardItem.defaultProps = {
  mainValue: undefined,
  mainValueDanger: false,
  MainIcon: undefined,
  title: '',
  subtitle: '',
  clickable: false,
};

export default DashboardItem;

interface IMainLayout {
  clickable?: boolean;
}
const MainLayout = styled.div<IMainLayout>`
  height: 100%;
  width: 100%;
  max-width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
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
