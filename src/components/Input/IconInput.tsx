import styled from 'styled-components';

const IconInput = ({ Icon, ...props }) => {
  return (
    <InputLayout {...props}>
      <Icon style={{ height: props.iconSize }} />
      <InputStyle
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
        inputLength={props.inputLength}
      />
      {props.unit ? <Unit>{props.unit}</Unit> : null}
    </InputLayout>
  );
};

export default IconInput;

const InputLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 8px;
`;

interface InputStyleProps {
  inputLength: number;
}
const InputStyle = styled.input<InputStyleProps>`
  width: ${(props) => (props.inputLength ? props.inputLength + 'px' : '100%')};
  background: transparent;
  border: none;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.23;
  letter-spacing: normal;
  text-align: left;
  color: #23beb9;
  text-align: left;
  outline: none;
  padding: 0px;
  margin: 0 0 0 12px;
  border-bottom: 1px solid #525a63;
  ::placeholder {
    color: #525a63;
    font-size: 13px;
    margin: 0 0 0 0;
    font-weight: 500;
  }
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
