import PropTypes from 'prop-types';
import styled from 'styled-components';

const CardContent = ({ Icon, title = '', detail = '', className = '', onClick = () => {} }) => {
  return (
    <CardContentLayout className={className} onClick={onClick}>
      <HalfUp>
        <IconLayout>
          <Icon style={{ height: '60px' }} />
        </IconLayout>
        <TitleLayout>{title}</TitleLayout>
      </HalfUp>
      <HalfDown>
        <DetailLayout>{detail}</DetailLayout>
      </HalfDown>
    </CardContentLayout>
  );
};

CardContent.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string,
  detail: PropTypes.string,
  className: PropTypes.string,
};
CardContent.defaultProps = {
  icon: null,
  title: '',
  detail: '',
  className: '',
};

const CardContentLayout = styled.div`
  width: 280px;
  height: 244px;
  margin-left: 24px;
  margin-right: 24px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 28px;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  :hover {
    background-color: #21ada9;
    border: solid 1px #23beb9;
    -webkit-transition: background-color 300ms ease-out;
    -moz-transition: background-color 300ms ease-out;
    -o-transition: background-color 300ms ease-out;
    transition: background-color 300ms ease-out;
  }
  @media (max-width: 360px) {
    width: 90%;
  }
`;

const HalfUp = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconLayout = styled.div`
  flex-grow: 1;
  width: 100%;
  max-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleLayout = styled.div`
  width: 90%;
  min-height: 60px;
  line-height: 30px;
  display: inline;
  margin-top: 12px;
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  text-align: center;
  color: white;
`;

const HalfDown = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const DetailLayout = styled.div`
  padding-top: 16px;
  color: white;
`;

export default CardContent;
