import styled from 'styled-components';

const SwitchTab = ({ config }) => {
  return (
    <TabLayout>
      <TabItem totalCount={2}>Benchmark</TabItem>
      <TabItem totalCount={2}>Charts</TabItem>
    </TabLayout>
  );
};

export default SwitchTab;

interface ITabItem {
  totalCount: number;
}

const TabLayout = styled.div`
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #42464b;
  border-radius: 100px;
  // padding: 0 74px 0 0;
  height: 41px;
`;
const TabItem = styled.div<ITabItem>`
  width: ${(props) => (props.totalCount ? `calc(100%/${props.totalCount})` : `calc(100%/2)`)};
  background-color: #23beb9;
  height: 100%;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
`;
