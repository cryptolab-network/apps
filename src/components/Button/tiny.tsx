import React from 'react';
import styled from 'styled-components';
import { BooleanLiteral } from 'typescript';

interface ITinyButton {
  title?: string;
  onClick?: React.MouseEventHandler;
  primary?: boolean;
  fontSize?: string;
}
const TinyButton: React.FC<ITinyButton> = ({ title = '', onClick, primary = true, ...props }) => {
  return (
    <ButtonStyle primary={primary} onClick={onClick} {...props}>
      {title}
    </ButtonStyle>
  );
};

export default TinyButton;

type ButtonProps = {
  primary: boolean;
  disabled?: BooleanLiteral;
  fontSize?: string;
};
const ButtonStyle = styled.button<ButtonProps>`
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
  background: ${(props) => (props.primary ? '#17222d' : 'transparent')};
  color: ${(props) => (props.primary ? '#23beb9' : '#23beb9')};
  font-family: Montserrat;
  font-weight: bold;
  font-size: ${(props) => (props.fontSize ? props.fontSize : '0.5em')};
  padding: 2px 6px;
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
