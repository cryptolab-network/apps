import Switch from './index';
import styled from 'styled-components';

const TitleSwitch = ({ title, ...props }) => {
  return (
    <SwitchLayout>
      <Title>{title}</Title>
      <Switch onChange={props.onChange} checked={props.checked} offColor="#17222e" />
      {props.unit ? <Unit>{props.unit}</Unit> : <Unit></Unit>}
    </SwitchLayout>
  );
};

export default TitleSwitch;

const SwitchLayout = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const Title = styled.div`
  height: 16px;
  margin: 0 10.7px 0 0;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.3;
  letter-spacing: normal;
  text-align: left;
  color: white;
`;

const Unit = styled.div`
  height: 16px;
  margin: 0 32.7px 0 5px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.3;
  letter-spacing: normal;
  text-align: left;
  color: white;
`;
