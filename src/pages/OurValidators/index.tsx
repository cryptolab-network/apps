import styled from 'styled-components';
import { ReactComponent as PeopleIcon } from '../../assets/images/people.svg';
import Account from '../../components/Account';
import { CryptolabDOTValidators, CryptolabKSMValidators } from '../../utils/constants/Validator';

const OurValidatorsContent = () => {
  return (
    <ContentLayout>
      <ItemLayout>
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
        </ItemLayout>
        <VerticalSplitter />
        <ItemLayout>
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
        </ItemLayout>
      </ContentLayout>
  );
};

const OurValidators = () => {
  return (
    <OurValidatorsLayout>
      <div style={{margin: '40px 0 0 0'}} />
      <PeopleIcon />
      <div style={{margin: '9px 0 0 0'}} />
      <Title>
        Our Validators
      </Title>
      <div style={{margin: '81px 0 0 0'}} />
      <OurValidatorsContent />
      <Description>
        Toggle <span style={{color: '#23beb9'}}>Support Us</span> on <span style={{color: '#23beb9'}}>Portfolio Benchmark</span>.
      </Description>
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

const Title = styled.div`
  width: 144px;
  height: 30px;
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: center;
  color: white;
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
  height: 200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ItemLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`;

const VerticalSplitter = styled.div`
  height: 120px;
  width: 0px;
  border: solid 1px;
  border-radius: 2px;
  margin: 0 40px 0 40px;
  color: #aaaaaa;
`;

const Description = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: left;
  color: white;
`;