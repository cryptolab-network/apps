import styled from "styled-components";
import { ReactComponent as GreenArrow } from '../../../assets/images/green-arrow.svg';

const BulletItem = ({n, text}) => {
  return (
    <BulletItemLayout>
      <Bullet>
        <BulletText>
          {n}
        </BulletText>
      </Bullet>
      <Content>
        {text}
      </Content>
    </BulletItemLayout>
  );
};

const TextGuide = () => {
  return (
    <TextGuideLayout>
      <Title>
        How to use Portfolio Benchmark
      </Title>
      <BulletItem 
        n={1}
        text={'Select Network'}
      />
      <GreenArrow />
      <BulletItem 
        n={2}
        text={'Enter how much funds you want to stake'}
      />
      <GreenArrow />
      <BulletItem 
        n={3}
        text={'Select a strategy or customize yours'}
      />
      <GreenArrow />
      <BulletItem 
        n={4}
        text={'See the estimated APY'}
      />
      <GreenArrow />
      <BulletItem 
        n={5}
        text={'Choose Reward Destination'}
      />
      <GreenArrow />
      <BulletItem 
        n={6}
        text={'Nominate'}
      />
    </TextGuideLayout>
  );
};

const TextGuideLayout = styled.div`
  padding: 17.5px 17px 24.2px 16px;
  border-radius: 10px;
`;

const Title = styled.div`
  margin: 0 3.7px 49.5px 0;
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: white;
`;

const BulletItemLayout = styled.div`
  display: flex;
  flex-direction: row;
  margin: 23.3px 0 23.3px 0;
`;

const Bullet = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #23beb9;
  border-radius: 28px;
  align-items: center;
`;

const BulletText = styled.div`
  height: 24px;
  font-family: Montserrat;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: center;
  color: white;

`;

const Content = styled.div`
  margin: 3px 0 3px 14.7px;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: white;
`;

export default TextGuide;
