import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ReactComponent as CryptoLabIcon } from '../../../../assets/images/cryptolab-logo.svg';
import { ReactComponent as XIcon } from '../../../../assets/images/x.svg';
import { ReactComponent as Web3BadgeIcon } from '../../../../assets/images/badge-black.svg';

const GrantCardContent = ({ className = '' }) => {
  return (
    <CardContentLayout className={className}>
        <IconLayout>
          <CryptoLabIconLayout>
            <CryptoLabIcon/>
          </CryptoLabIconLayout>
          <XIconLayout>
            <XIcon/>
          </XIconLayout>
          <Web3BadgeIconLayout>
            <Web3BadgeIcon/>
          </Web3BadgeIconLayout>
          <RectangleLayout>
            <GrantLayout>
            CryptoLab Network 
            <GrantLayoutSmall>Supported by </GrantLayoutSmall>
            Web3 Foundation Grant 
            </GrantLayout>
          </RectangleLayout>
        </IconLayout>
    </CardContentLayout>
  );
};

GrantCardContent.propTypes = {
  icon: PropTypes.any,
  className: PropTypes.string,
};
GrantCardContent.defaultProps = {
  icon: null,
  className: '',
};

const CardContentLayout = styled.div`
  width: 516.6px;
  height: 77.1px;
  margin: 0 0.4px 150px 0;
  padding: 0 0 0 14px;
  opacity: 1;
  border-radius: 6px;
  border: solid 1px #1faaa6;
  background-color: #141b26;
`;

const IconLayout = styled.div`
  object-fit: contain;
  display: flex;
  flex-direction: row;
`

const CryptoLabIconLayout = styled.div`
  width: 108px;
  height: 40px;
  margin: 22.5px 12px 14.6px 0;
  object-fit: contain;
`

const XIconLayout = styled.div`
  width: 24px;
  height: 24px;
  margin: 31px 15.1px 22.1px 12px;
  object-fit: contain;
`

const Web3BadgeIconLayout = styled.div`
  width: 107.7px;
  height: 36.9px;
  margin: 22.5px 25.1px 17.7px 15.1px;
  object-fit: contain;
`

const RectangleLayout = styled.div`
  width: 210.6px;
  height: 77.1px;
  margin: 0 0 0 0;
  opacity: 1;
  background-color: #1faaa6;
`

const GrantLayout = styled.div`
  width: 199px;
  height: 51px;
  margin: 13.5px 0px 12.6px 12.5px;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.27;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
`

const GrantLayoutSmall = styled.div`
  font-size: 10px;
  font-weight: 500;
`

export default GrantCardContent;
