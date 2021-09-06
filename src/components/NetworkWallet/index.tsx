import styled from 'styled-components';
import WalletSelect from '../WalletSelect';
import NetworkSelect from '../NetworkSelect';

const NetworkWallet: React.FC = () => {
  return (
    <Layout>
      <NetworkSelect />
      <WalletSelect />
    </Layout>
  );
};

export default NetworkWallet;

const Layout = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
