import React from 'react';
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
  background: ${(props) => (props.primary ? 'palevioletred' : 'white')};
  color: ${(props) => (props.primary ? 'white' : 'palevioletred')};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;
