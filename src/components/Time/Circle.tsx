import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import './index.css';
import { IEraInfo } from '../../pages/Benchmark/components/Staking';
import useInterval from '../../hooks/useInterval';

const SECOND = 1000;
const MINUTE = 60000;
const HOUR = 3600000;
const SLOT_TIME = 6000;

const calcProgress = (type, eraInfo) => {
  let progress = 0;
  const currentTime = Date.now();
  if (type === 'era') {
    const eraTime = eraInfo.sessionPerEra * eraInfo.sessionLength * SLOT_TIME;
    progress = Math.floor(((currentTime - eraInfo.activeEraStart) / eraTime) * 100);
  } else {
    const epochTime = eraInfo.sessionLength * SLOT_TIME;
    progress = Math.floor((((currentTime - eraInfo.activeEraStart) % epochTime) / epochTime) * 100);
  }
  if (progress >= 100) {
    return 100;
  }
  return progress;
};

const calcLeftHour = (type, eraInfo) => {
  let leftHour = 0;
  const currentTime = Date.now();
  const endTime = eraInfo.activeEraStart + eraInfo.sessionPerEra * eraInfo.sessionLength * SLOT_TIME;
  const leftTime = endTime - currentTime;

  if (leftTime < 0) {
    return 0;
  }

  if (type === 'era') {
    leftHour = Math.floor(leftTime / HOUR);
  } else {
    leftHour = Math.floor(leftTime / HOUR);
  }
  return leftHour;
};

const calcLeftMinute = (type, eraInfo) => {
  let leftMinute = 0;
  const currentTime = Date.now();
  const endTime = eraInfo.activeEraStart + eraInfo.sessionPerEra * eraInfo.sessionLength * SLOT_TIME;
  const leftTime = endTime - currentTime;

  if (leftTime < 0) {
    return 0;
  }

  if (type === 'era') {
    leftMinute = Math.floor((leftTime % HOUR) / MINUTE);
  } else {
    const epochTime = eraInfo.sessionLength * 6 * 1000;
    leftMinute = Math.floor(((leftTime % epochTime) % (eraInfo.sessionLength * SLOT_TIME)) / MINUTE);
  }
  return leftMinute;
};

const calcLeftSecond = (type, eraInfo) => {
  let leftSecond = 0;
  const currentTime = Date.now();
  const endTime = eraInfo.activeEraStart + eraInfo.sessionPerEra * eraInfo.sessionLength * SLOT_TIME;
  const leftTime = endTime - currentTime;

  if (leftTime < 0) {
    return 0;
  }

  if (type === 'epoch') {
    const epochTime = eraInfo.sessionLength * SLOT_TIME;
    leftSecond = Math.floor(((leftTime % epochTime) % MINUTE) / SECOND);
  }
  return leftSecond;
};
interface Props {
  type: string;
  eraInfo: IEraInfo | null;
  network: string;
}

const TimeCircle: React.FC<Props> = ({ type, eraInfo, network }) => {
  const [progress, setProgress] = useState(0);
  const [leftHour, setLeftHour] = useState(0);
  const [leftMinute, setLeftMinute] = useState(0);
  const [leftSecond, setLeftSecond] = useState(0);

  useInterval(() => {
    setProgress(calcProgress(type, eraInfo));
  }, 6000);

  useInterval(() => {
    setLeftHour(calcLeftHour(type, eraInfo));
  }, 6000);

  useInterval(() => {
    setLeftMinute(calcLeftMinute(type, eraInfo));
  }, 6000);

  useInterval(() => {
    setLeftSecond(calcLeftSecond(type, eraInfo));
  }, 6000);

  const displayValues = useMemo(() => {
    let mainValue;
    let mainUnit;
    let subValue;

    switch (network) {
      case 'Kusama':
      case 'Westend':
        mainValue = type === 'era' ? 6 : 1;
        mainUnit = type === 'era' ? ' hrs' : ' hr';
        if (leftHour > 0) {
          subValue =
            type === 'era' ? `${leftHour} hrs ${leftMinute} mins` : `${leftMinute} mins ${leftSecond} s`;
        } else {
          subValue = `${leftMinute} mins ${leftSecond} s`;
        }
        break;
      case 'Polkadot':
        mainValue = type === 'era' ? 1 : 4;
        mainUnit = type === 'era' ? ' day' : ' hrs';
        if (leftHour > 0) {
          subValue =
            type === 'era' ? `${leftHour} hrs ${leftMinute} mins` : `${leftMinute} mins ${leftMinute} s`;
        } else {
          subValue = `${leftMinute} mins ${leftSecond} s`;
        }
        break;
      default:
    }
    return {
      mainValue,
      mainUnit,
      subValue,
    };
  }, [network, type, leftHour, leftMinute, leftSecond]);

  const ContentDOM = useMemo(() => {
    if (type === 'epoch') {
      return (
        <div
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <EpochNumber>{eraInfo?.currentSessionIndex}</EpochNumber>
          <EpochWord>epoch</EpochWord>
        </div>
      );
    } else if (type === 'era') {
      return (
        <div
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <EraNumber>
            <span>{progress}</span>
            <span style={{ fontSize: 15 }}>%</span>
          </EraNumber>
          <EraWord>era</EraWord>
          <EraSubWord>{eraInfo?.currentEra}</EraSubWord>
        </div>
      );
    } else {
      return null;
    }
  }, [type, eraInfo, progress]);

  return (
    <MainLayout>
      <WordLayout>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <TimeType>{type}</TimeType>
        </div>
        <div style={{ lineHeight: '80%', marginTop: 8 }}>
          <MainValue>{displayValues.mainValue}</MainValue>
          <MainUnit>{displayValues.mainUnit}</MainUnit>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <SubValue>{displayValues.subValue}</SubValue>
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
