import styled from 'styled-components';

const Input = ({ ...props }) => {
  return (
    <InputLayout {...props}>
      <InputStyle onChange={props.onChange} value={props.value} {...props} />
    </InputLayout>
  );
};

export default Input;

const InputLayout = styled.div`
  display: flex;
  border-bottom: solid 1px #d7d8d9;
`;

const InputStyle = styled.input`
  background: transparent;
  border: none;
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  color: #23beb9;
  text-align: right;
  outline: none;
  width: 100%;
`;
