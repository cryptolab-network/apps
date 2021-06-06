import styled from 'styled-components';
import { ReactComponent as CryptoLabLogo } from '../../../../assets/images/main-vertical-color-logo.svg';
import './index.css';

const Slogan = () => {
  return (
    <SloganLayout>
      <CryptoLabLogo id="slogan" />
      <SloganTitle>Built to maximize staking yield</SloganTitle>
      <SloganDetail>
        CryptoLab is a portfolio management platform for NPoS (nominated proof-of-stake) networks like Kusama
        and Polkadot. We aim to simplify portfolio management to make yield optimization easier and more
        accessible, for technical and non-technical users alike.
      </SloganDetail>
    </SloganLayout>
  );
};

export default Slogan;

const SloganLayout = styled.div`
  max-width: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 12px;
`;

const SloganTitle = styled.div`
  color: white;
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  margin-top: 22px;
`;

const SloganDetail = styled.div`
  color: white;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 500;
  margin-top: 17px;
`;
