import styled from 'styled-components';

const InputPercentage = ({ title, ...props }) => {
  return (
    <InputLayout {...props}>
      <Title>{title}</Title>
      <InputStyle
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
        inputLength={props.inputLength}
        {...props}
      />
      {props.unit ? <Unit>{props.unit}</Unit> : <Unit></Unit>}
    </InputLayout>
  );
};

export default InputPercentage;

interface InputLayoutProps {
  disabled?: boolean;
}
const InputLayout = styled.div<InputLayoutProps>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 8px;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'default')};
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

interface InputStyleProps {
  inputLength: number;
  disabled?: boolean;
}
const InputStyle = styled.input<InputStyleProps>`
  width: ${(props) => (props.inputLength ? props.inputLength : 45)}px;
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
  text-align: center;
  outline: none;
  padding: 0px;
  border-bottom: 1px solid #525a63;
  ::placeholder {
    color: #525a63;
    font-size: 13px;
    margin: 0 0 0 0;
    font-weight: 500;
  }
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'default')};
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
