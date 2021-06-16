import styled, { keyframes } from 'styled-components';
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
// import './index.css';

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
        {/* <Circle rightsecond="0.08s">
          <div className="inner"></div>
          <div className="number">100%</div>
          <div className="circle">
            <div className="bar left">
              <div className="progress"></div>
            </div>
            <div className="bar right">
              <div className="progress"></div>
            </div>
          </div>
        </Circle> */}
        <div
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 75, height: 75 }}
        >
          <CircularProgressbarWithChildren
            value={75}
            strokeWidth={25}
            styles={buildStyles({
              strokeLinecap: 'butt',
              pathColor: '#23beb9',
              textColor: '#f88',
              trailColor: '#1a4e55',
              backgroundColor: '#183942',
            })}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                marginBottom: 12,
              }}
            >
              <CircularProgressbar
                value={75}
                strokeWidth={50}
                styles={buildStyles({
                  strokeLinecap: 'butt',
                  trailColor: '#192431',
                  pathColor: '#183942',
                  textColor: '#f88',
                  backgroundColor: '#192431',
                })}
              />
            </div>
          </CircularProgressbarWithChildren>
          {/* <div style={{ position: 'absolute' }}>
            <CircularProgressbar
              value={75}
              strokeWidth={50}
              styles={buildStyles({
                strokeLinecap: 'butt',
              })}
            />
          </div>
          <div style={{ position: 'absolute' }}>
            <CircularProgressbar
              value={75}
              text={`75%`}
              styles={buildStyles({
                strokeLinecap: 'butt',
                pathColor: `rgba(62, 152, 199, ${75 / 100})`,
                textColor: '#f88',
                trailColor: '#d6d6d6',
                backgroundColor: '#3e98c7',
              })}
            />
          </div> */}
        </div>
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

const left = keyframes`
  100% {
    transform: rotate(180deg);
  }
`;

const right = keyframes`
  100% {
    transform: rotate(180deg);
  }
`;

type CircleProps = {
  rightsecond: string;
};
const Circle = styled.div<CircleProps>`
  height: 100px;
  width: 100px;
  position: relative;
  border: solid green 1px;
  .inner {
    position: absolute;
    z-index: 6;
    top: 50%;
    left: 50%;
    height: 100px;
    width: 100px;
    margin: -50px 0 0 -50px;
    /* background: #dde6f0; */
    background: #1a4e55;
    border-radius: 100%;
  }
  .number {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    font-size: 18px;
    font-weight: 500;
    color: white;
  }
  .bar {
    position: absolute;
    height: 100%;
    width: 100%;
    background: #fff;
    -webkit-border-radius: 100%;
    clip: rect(0px, 100px, 100px, 50px);
  }
  .bar .progress {
    position: absolute;
    z-index: 7;
    height: 100%;
    width: 100%;
    -webkit-border-radius: 100%;
    clip: rect(0px, 50px, 100px, 0px);
    background: #23beb9;
  }
  .left .progress {
    z-index: 7;
    animation: ${left} 0.5s linear both;
  }
  .right {
    transform: rotate(-30deg);
    z-index: 7;
  }
  .right .progress {
    animation: ${right} 0.08s linear both;
    animation-delay: ${(props) => (props.rightsecond ? props.rightsecond : '0.08s')};
  }
`;
