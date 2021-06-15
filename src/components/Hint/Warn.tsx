import styled from 'styled-components';
import { ReactComponent as WarnIcon } from '../../assets/images/warn-icon.svg';

const Warning = ({ msg }) => {
  return (
    <WarnLayout>
      <WarnIconLayout>
        <WarnIcon />
      </WarnIconLayout>
      <Msg>{msg}</Msg>
    </WarnLayout>
  );
};

export default Warning;

const WarnLayout = styled.div`
  display: inline-box;
  padding-left: 5px;
  padding-right: 5px;
`;

const WarnIconLayout = styled.div`
  padding: 5px;
`;

const Msg = styled.div`
  padding: 5px;
  color: white;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
`;
