import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Failed = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Hint>{t('common.error')}</Hint>
    </MainLayout>
  );
};

export default Failed;

const MainLayout = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Hint = styled.div`
  margin-top: 30px;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: white;
`;
