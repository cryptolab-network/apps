import styled from 'styled-components';
import { ReactComponent as CryptoLabIcon } from '../../assets/images/about-us-logo.svg';

const AboutContent = () => {
  return (
    <ContentLayout>
      <Description>
        We are CryptoLab. We operate Polkadot and Kusama validators.<br/>
        <div style={{'margin': '10px 0 0 0'}}/>
        We make the CryptoLan Network because we found the community needs useful tools to help us to have better information about staking.
      </Description>
      <div style={{'margin': '34px 0 0 0'}}/>
      <Description>
        Our missions are,
        <List>Provide a simple, easy-to-use staking service</List>
        <List>Provide monitoring tools to help node operators</List>
        <List>Provide stable validating services for the network</List>
      </Description>
    </ContentLayout>
  );
};

const About = () => {
  return (
    <AboutLayout>
      <div style={{margin: '40px 0 0 0'}} />
      <CryptoLabIcon />
      <div style={{margin: '81px 0 0 0'}} />
      <AboutContent />
    </AboutLayout>
  );
};

export default About;

const AboutLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  margin: 0 0 18.5px 0;
`;

const ContentLayout = styled.div`
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`;

const List = styled.ul`
  color: #23beb9;
`;
