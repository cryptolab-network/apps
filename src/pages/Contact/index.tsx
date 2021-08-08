import styled from 'styled-components';
import CardHeader from '../../components/Card/CardHeader';
import { ReactComponent as PeopleIcon } from '../../assets/images/people.svg';

const ContactHeader = () => {
  return (
    <HeaderLayout>
      <HeaderLeft>
        <PeopleIcon />
        <HeaderTitle>
          <Title>Contact</Title>
        </HeaderTitle>
      </HeaderLeft>
    </HeaderLayout>
  );
};

const ContactContent = () => {
  return (
    <CardHeader Header={() => <ContactHeader />} alignItems="flex-start">
      <ContentLayout>
        <ItemTitle> Riot
        </ItemTitle>
        <Item>
          tanis_37:matrix.org
        </Item>
        <Item>
          yaohsin:matrix.org
        </Item>
        <ItemTitle> Github
        </ItemTitle>
        <Item>
          https://github.com/cryptolab-network
        </Item>
      </ContentLayout>
    </CardHeader>
  );
};

const Contact = () => {
  return (
    <ContactLayout>
      <MainLayout>
        <ContactContent />
      </MainLayout>
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