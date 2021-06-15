import styled from 'styled-components';

const TimeCircle = () => {
  return (
    <MainLayout>
      <WordLayout>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <TimeType>epoch</TimeType>
        </div>
        <div style={{ lineHeight: '80%', marginTop: 8 }}>
          <MainValue>3</MainValue>
          <MainUnit> hrs</MainUnit>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <SubValue>1 hr 33 mins</SubValue>
        </div>
      </WordLayout>
      <CircleLayout>
        <DimCircle />
        <LightCircle />
      </CircleLayout>
    </MainLayout>
  );
};

export default TimeCircle;

const MainLayout = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const WordLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const TimeType = styled.span`
  color: white;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
`;

const MainValue = styled.span`
  color: white;
  font-family: Montserrat;
  font-size: 25px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
`;

const MainUnit = styled.span`
  color: white;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
`;

const SubValue = styled.span`
  color: white;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
`;

const CircleLayout = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  margin-left: 20px;
`;

const DimCircle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: 9px #1a4e55 solid;
`;

const LightCircle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: 9px #23beb9 solid;
  border-color: transparent #23beb9 #23beb9 #23beb9;
  transform: rotate(45deg);
`;
