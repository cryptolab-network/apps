import Identicon from '@polkadot/react-identicon';
import styled from 'styled-components';

interface IAccount {
  address: string;
  display: string;
  showNominatedInfo?: boolean;
  nominatedCount?: number;
  amount?: number;
}

const Account: React.FC<IAccount> = ({ address, display = address, nominatedCount = 0, amount = 0, showNominatedInfo = false }) => {
  const AmountTag = () => {
    if (showNominatedInfo) {
      return (
        <Amount>{amount}</Amount>
      );
    } else {
      return (<div></div>);
    }
  }
  return (
    <AccountLayout>
      <Identicon value={address} size={32} theme={'polkadot'} />
      <Address>{display}</Address>
      <AmountTag />
    </AccountLayout>
  );
};

export default Account;

const AccountLayout = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Address = styled.div`
  width: 100%;
  color: white;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  margin-left: 7px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Amount = styled.div`
  display: flex;
  justify-content: flex-start;
`;
