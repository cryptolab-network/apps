import styled from 'styled-components';
import Slogan from './components/Slogan';
import CardContent from './components/CardContent';
import { ReactComponent as MicroScopeIcon } from '../../assets/images/microscope.svg';
import { ReactComponent as EyeIcon } from '../../assets/images/eye.svg';
import { ReactComponent as BeakerIcon } from '../../assets/images/beaker.svg';

const Portal = () => {
  return (
    <PortalLayout>
      <SloganLayout>
        <Slogan />
      </SloganLayout>
      <CardsLayout>
        <CardContent
          Icon={MicroScopeIcon}
          title={'Staking Guide'}
          detail="CryptoLab is a portfolio management platform for NPoS (nominated proof-of-stake) networks like Kusama and Polkadot. We aim to simplify …"
          className="card-layout"
        />
        <CardContent
          Icon={EyeIcon}
          title={'Portfolio\nBenchmark'}
          detail="CryptoLab is a portfolio management platform for NPoS (nominated proof-of-stake) networks like Kusama and Polkadot. We aim to simplify …"
          className="card-layout"
        />
        <CardContent
          Icon={BeakerIcon}
          title={'Portfolio\nManagement'}
          detail="CryptoLab is a portfolio management platform for NPoS (nominated proof-of-stake) networks like Kusama and Polkadot. We aim to simplify …"
          className="card-layout"
        />
      </CardsLayout>
    </PortalLayout>
  );
};

export default Portal;

const PortalLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const SloganLayout = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 64px;
  @media (max-height: 762px) {
    padding-bottom: 32px;
  }
`;

const CardsLayout = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
