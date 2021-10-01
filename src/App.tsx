import './css/App.css';
import AppLayout from './AppLayout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './i18n';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        {/* Twitter meta tags below */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content="https://ipfs.io/ipfs/QmPa5CxADEiCK1DASYwVRZ6CQpDdWB2Rmg4a8zN3Esqmji"
        />
        <meta name="twitter:title" content="CryptoLab - making life way easier for crypto holders" />
        <meta name="twitter:creator" content="@CryptolabN" />
        <meta name="twitter:site" content="@CryptolabN" />
        <meta
          name="twitter:description"
          content="We help you earn staking yield without taking custody of your assets. Stake once, CryptoLab will take care of the rest for you."
        />
        {/* Facebook meta tags below */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="www.cryptolab.network" />
        <meta property="og:title" content="CryptoLab - making life way easier for crypto holders" />
        <meta
          property="og:description"
          content="We help you earn staking yield without taking custody of your assets. Stake once, CryptoLab will take care of the rest for you."
        />
        <meta
          property="og:image"
          content="https://ipfs.io/ipfs/QmPa5CxADEiCK1DASYwVRZ6CQpDdWB2Rmg4a8zN3Esqmji"
        />
      </Helmet>
      <AppLayout />
    </HelmetProvider>
  );
}

export default App;
