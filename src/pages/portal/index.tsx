import styled from 'styled-components';

const CardContent = ({ className = '' }) => {
  return (
    <CardContentLayout className={className}>
      <div>TITLE</div>
    </CardContentLayout>
  );
};

const Portal = () => {
  return (
    <PortalLayout>
      <CardContent className="card-layout" />
      <CardContent className="card-layout" />
      <CardContent className="card-layout" />
    </PortalLayout>
  );
};

export default Portal;

const PortalLayout = styled.div`
  width: 100%;
`;

const CardContentLayout = styled.div`
  width: 320px;
  height: 320px;
`;
