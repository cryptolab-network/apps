import styled from 'styled-components';
import { ReactComponent as ContactIcon } from '../../assets/images/contact-logo.svg';
// TODO: deprecated
const ContactContent = () => {
  return (
    <ContentLayout>
      <ItemLayout>
        <ItemTitle> Riot </ItemTitle>
        <Item>tanis_37:matrix.org</Item>
        <Item>yaohsin:matrix.org</Item>
      </ItemLayout>
      <VerticalSplitter />
      <ItemLayout>
        <ItemTitle> Github </ItemTitle>
        <Item>
          <LinkA href="https://github.com/cryptolab-network" target="_blank" rel="noopener noreferrer">
            https://github.com/cryptolab-network
          </LinkA>
        </Item>
      </ItemLayout>
    </ContentLayout>
  );
};

const Contact = () => {
  return (
    <ContactLayout>
      <div style={{ margin: '40px 0 0 0' }} />
      <ContactIcon />
      <div style={{ margin: '9px 0 0 0' }} />
      <Title>Contact</Title>
      <div style={{ margin: '81px 0 0 0' }} />
      <ContactContent />
    </ContactLayout>
  );
};

export default Contact;

const ContactLayout = styled.div`
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
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
`;

const ItemLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`;

const VerticalSplitter = styled.div`
  height: 100px;
  width: 0px;
  border: solid 1px;
  border-radius: 2px;
  margin: 0 40px 0 0;
  color: #aaaaaa;
`;

const LinkA = styled.a`
  color: #23beb9;
  text-decoration: none;
`;
