import styled from "styled-components";

const IconButton = ({Icon, onClick = () => {}}) => {
  return (
    <IconButtonLayout>
      <Icon onClick={onclick}/>
    </IconButtonLayout>
  );
};

export default IconButton;

const IconButtonLayout = styled.button`
  width: 18.6px;
  height: 18.6px;
  border: solid 1px #23beb9;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  border-radius: 4px;
  cursor: pointer;
  :hover {
    border: solid 1px #169692;
    -webkit-transition: background-color 300ms ease-out;
    -moz-transition: background-color 300ms ease-out;
    -o-transition: background-color 300ms ease-out;
    transition: background-color 300ms ease-out;
  }
`;