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
  padding: 0 16px 0 16px;
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
  height: 77.1px;
  margin: 0 0.4px 150px 0;
`;

export default GrantCardContent;
