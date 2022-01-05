import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ReactComponent as CryptoLabIcon } from '../../../../assets/images/cryptolab-logo.svg';
import { ReactComponent as XIcon } from '../../../../assets/images/x.svg';
import { ReactComponent as Web3BadgeIcon } from '../../../../assets/images/badge-black.svg';

const GrantCardContent = ({ className = '', mobile = false }) => {
  if (!mobile) {
    return (
      <GrantCardContentLayout className={className}>
        <BadgeLayout>
          <CryptoLabIcon />
          <XIcon />
          <Web3BadgeIcon />
        </BadgeLayout>
        <GrantLayout>
          <GrantTitle>CryptoLab Network</GrantTitle>
          <GrantSubTitle>Supported by </GrantSubTitle>
          <GrantTitle>Web3 Foundation Grant</GrantTitle>
        </GrantLayout>
      </GrantCardContentLayout>
    );
  } else {
    return (
      <GrantCardMobileContentLayout className={className}>
        <BadgeMobileLayout>
          <CryptoLabIcon />
          <XIcon />
          <Web3BadgeIcon />
        </BadgeMobileLayout>
        <GrantMobileLayout>
          <GrantTitle>CryptoLab Network</GrantTitle>
          <GrantSubTitle>Supported by </GrantSubTitle>
          <GrantTitle>Web3 Foundation Grant</GrantTitle>
        </GrantMobileLayout>
      </GrantCardMobileContentLayout>
    );
  }
};

GrantCardContent.propTypes = {
  icon: PropTypes.any,
  className: PropTypes.string,
};
GrantCardContent.defaultProps = {
  icon: null,
  className: '',
};

const GrantCardContentLayout = styled.div`
  display: flex;
  width: 530px;
  height: 77.1px;
  margin: 0 0.4px 150px 0;
`;

const BadgeLayout = styled.div`
  flex: 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 14px 16px 14px;
`;

const BadgeMobileLayout = styled.div`
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 14px 16px 14px;
`;

const GrantLayout = styled.div`
  flex: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 8px 0 8px;
  background-color: #23beb9;
  border: solid 0.5px #23beb9;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const GrantMobileLayout = styled.div`
  box-sizing: border-box;
  flex: 2;
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 9px 14px 9px 14px;
  background-color: #23beb9;
  border: solid 1px #23beb9;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  @media (max-width: 360px) {
    width: 299px;
  }
`;

const GrantTitle = styled.div`
  text-align: left;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  color: white;
`;
const GrantSubTitle = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: white;
`;

const GrantCardMobileContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  margin: 0 0.4px 150px 0;
  @media (max-width: 360px) {
    width: 299px;
  }
`;

export default GrantCardContent;
