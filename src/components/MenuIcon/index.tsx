import styled from 'styled-components';

const MenuIcon = ({ onClick }) => {
  return (
    <IconLayout onClick={onClick}>
      <Line />
      <Line />
      <Line />
    </IconLayout>
  );
};

export default MenuIcon;

const IconLayout = styled.div`
  width: 17px;
  height: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Line = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 5px;
  background-color: white;
`;
