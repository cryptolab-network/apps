import { useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import { number } from 'prop-types';
import { setInterval } from 'timers';

const TimeCircle = ({ type, percentage }) => {
  // const [progress, setProgress] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  const ContentDOM = useMemo(() => {
    if (type === 'epoch') {
      return (
        <div
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <EpochNumber>5</EpochNumber>
          <EpochWord>epoch</EpochWord>
        </div>
      );
    } else if (type === 'era') {
      return (
        <div
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <EraNumber>
            <span>91</span>
            <span style={{ fontSize: 15 }}>%</span>
          </EraNumber>
          <EraWord>era</EraWord>
          <EraSubWord>2356</EraSubWord>
        </div>
      );
    } else {
      return null;
    }
  }, [type]);
  useEffect(() => {
    setInterval(() => {
      setProgress(percentage);
    }, 500);
  }, [percentage]);

  return (
    <MainLayout>
      <WordLayout>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <TimeType>{type}</TimeType>
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
        <CircularProgressbarWithChildren
          value={progress}
          strokeWidth={50}
          styles={buildStyles({
            strokeLinecap: 'butt',
            trailColor: '#192431',
            pathColor: '#183942',
            textColor: '#f88',
            backgroundColor: '#192431',
            pathTransitionDuration: 0.15,
          })}
        >
          <div
            style={{
              position: 'absolute',
              marginBottom: 8,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgressbarWithChildren
              value={progress}
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: 'butt',
                pathColor: '#23beb9',
                textColor: '#f88',
                trailColor: '#1a4e55',
                backgroundColor: '#183942',
                pathTransitionDuration: 0.35,
              })}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                {ContentDOM}
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </CircularProgressbarWithChildren>
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
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75px;
  height: 75px;
`;

const EpochNumber = styled.div`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  color: white;
`;

const EpochWord = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  color: white;
`;

const EraNumber = styled.div`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.06;
  color: white;
`;

const EraWord = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.9;
  color: white;
`;
const EraSubWord = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.9;
  color: white;
`;
