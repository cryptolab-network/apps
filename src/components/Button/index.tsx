import PropTypes from 'prop-types';
import styled from 'styled-components';

const Button = ({ title = '', onClick = () => {}, children = {}, primary = false }) => {
  return (
    <ButtonStyle primary onClick={onClick}>
      {title}
    </ButtonStyle>
  );
};

export default Button;

Button.prototype = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  primary: PropTypes.bool,
};

type ButtonProps = {
  primary: boolean;
};
const ButtonStyle = styled.button<ButtonProps>`
  background: ${(props) => (props.primary ? '#23beb9' : 'white')};
  color: ${(props) => (props.primary ? 'white' : 'palevioletred')};
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1em;
  padding: 11px 20px;
  border: 0px;
  border-radius: 100px;
  cursor: pointer;
`;
