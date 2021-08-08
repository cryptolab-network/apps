import styled from 'styled-components';
import CardHeader from '../../components/Card/CardHeader';
import { ReactComponent as PeopleIcon } from '../../assets/images/people.svg';
import Account from '../../components/Account';
import { CryptolabDOTValidators, CryptolabKSMValidators } from '../../utils/constants/Validator';

const ContactHeader = () => {
  return (
    <HeaderLayout>
      <HeaderLeft>
        <PeopleIcon />
        <HeaderTitle>
          <Title>Our Validators</Title>
          <Subtitle>
            Official CryptoLab Validators
          </Subtitle>
        </HeaderTitle>
      </HeaderLeft>
    </HeaderLayout>
  );
};

const ContactContent = () => {
  return (
    <CardHeader Header={() => <ContactHeader />} alignItems="flex-start">
      <ContentLayout>
        <ItemTitle> Polkadot
        </ItemTitle>
        <Item>
          <Account 
            address={CryptolabDOTValidators.CRYPTOLAB_01}
            display={'CryptoLab 01'}
          />
        </Item>
        <Item>
          <Account 
            address={CryptolabDOTValidators.CRYPTOLAB_NETWORK}
            display={'CryptoLab.Network'}
          />
        </Item>
        <ItemTitle> Kusama
        </ItemTitle>
        <Item>
          <Account 
            address={CryptolabKSMValidators.CRYPTOLAB_NETWORK}
            display={'CRYPTOLAB.NETWORK'}
          />
        </Item>
        <Item>
          <Account 
            address={CryptolabKSMValidators.CRYPTOLAB_NETWORK_TANIS}
            display={'CRYPTOLAB.NETWORK/TANIS'}
          />
        </Item>
        <Description>
          Toggle <span style={{color: '#23beb9'}}>Support Us</span>&nbsp;
          on <span style={{color: '#23beb9'}}>Portfolio Benchmark</span>&nbsp;to support us.
        </Description>
      </ContentLayout>
    </CardHeader>
  );
};

const OurValidators = () => {
  return (
    <OurValidatorsLayout>
      <MainLayout>
        <ContactContent />
      </MainLayout>
    </OurValidatorsLayout>
  );
};

export default OurValidators;

const OurValidatorsLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainLayout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const HeaderLayout = styled.div`
  width: 40vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 0 0 0 13.8px;
`;

const HeaderTitle = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 18px;
`;

const Title = styled.div`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  color: #white;
  margin: 0 0 18.5px 0;
`;

const ItemTitle = styled.div`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  color: white;
  margin: 0 0 18.5px 0;
`;

const Item = styled.div`
  font-family: Montserrat;
  font-size: 14px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  color: #23beb9;
  margin: 0 0 18.5px 0;
`;

const ContentLayout = styled.div`
  height: 65vh;
`;

const Description = styled.div`
  font-family: Montserrat;
  font-size: 14px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  color: white;
  margin: 18.5px 0 18.5px 0;
`;

const Subtitle = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.55;
`;