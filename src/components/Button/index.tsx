import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BooleanLiteral } from 'typescript';

const Button = ({ title = '', onClick = () => {}, children = {}, primary = false, ...props }) => {
  return (
    <ButtonStyle primary onClick={onClick} {...props}>
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
  disabled?: BooleanLiteral;
};
const ButtonStyle = styled.button<ButtonProps>`
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
  background: ${(props) => (props.primary ? '#17222d' : '#17222d')};
  color: ${(props) => (props.primary ? '#23beb9' : '23beb9')};
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1em;
  padding: 6px 20px;
  border: solid 1px #23beb9;
  border-radius: 100px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  :hover:not([disabled]) {
    background-color: #169692;
    color: #ffffff;
    border: solid 1px #169692;
    -webkit-transition: background-color 300ms ease-out;
    -moz-transition: background-color 300ms ease-out;
    -o-transition: background-color 300ms ease-out;
    transition: background-color 300ms ease-out;
  }
`;
