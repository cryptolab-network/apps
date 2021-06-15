import styled from 'styled-components';
import { ReactComponent as NodeBadge } from '../../assets/images/node-badge.svg';

const Node = ({ title, address }) => {
  return (
    <NodeLayout>
      <NodeBadge />
      <NodeTitle>{title}</NodeTitle>
      <NodeAddress>{address}</NodeAddress>
    </NodeLayout>
  );
};

export default Node;

const NodeLayout = styled.div`
  width: 100%;
  margin-top: 16px;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px #525a63;
`;

const NodeTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: left;
  color: white;
`;

const NodeAddress = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.27;
  letter-spacing: normal;
  text-align: right;
  color: #525a63;
`;
