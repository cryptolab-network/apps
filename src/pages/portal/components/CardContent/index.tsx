import styled from 'styled-components';

const CardContent = ({ icon = {}, title = '', detail = '', className = '' }) => {
  return (
    <CardContentLayout className={className}>
      {/* <IconLayout>{icon}</IconLayout> */}
      <TitleLayout>{title}</TitleLayout>
      <DetailLayout>{detail}</DetailLayout>
    </CardContentLayout>
  );
};

const CardContentLayout = styled.div`
  width: 280px;
  height: 244px;
  margin-left: 24px;
  margin-right: 24px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 28px;
  padding-top: 48px;
`;

const IconLayout = styled.div``;

const TitleLayout = styled.div``;

const DetailLayout = styled.div``;

export default CardContent;
