import styled from 'styled-components';
import { ReactComponent as ZoomInIcon } from '../../../assets/images/zoomin.svg';
import { ReactComponent as ZoomOutIcon } from '../../../assets/images/zoomout.svg';
import { ReactComponent as MagnifierIcon } from '../../../assets/images/magnifier.svg';
import { ReactComponent as HandsUpIcon } from '../../../assets/images/hands-up.svg';
import { ReactComponent as HomeIcon } from '../../../assets/images/home-2.svg';
import { ReactComponent as ListIcon } from '../../../assets/images/list.svg';

interface ITools {
  handleZoomIn?: React.MouseEventHandler<HTMLDivElement>;
  handleZoomOut?: React.MouseEventHandler<HTMLDivElement>;
}

const Tools: React.FC<ITools> = ({ handleZoomIn, handleZoomOut }) => {
  return (
    <MainLayout>
      <ToolIcon onClick={handleZoomIn}>
        <ZoomInIcon />
      </ToolIcon>
      <ToolIcon onClick={handleZoomOut}>
        <ZoomOutIcon />
      </ToolIcon>
      <ToolIcon>
        <MagnifierIcon />
      </ToolIcon>
      <ToolIcon>
        <HandsUpIcon />
      </ToolIcon>
      <ToolIcon>
        <HomeIcon />
      </ToolIcon>
      <ToolIcon>
        <ListIcon />
      </ToolIcon>
    </MainLayout>
  );
};

export default Tools;

const MainLayout = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 18px;
  margin: 12px 14px 12px 14px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

interface IToolIcon {
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const ToolIcon = styled.div<IToolIcon>`
  margin-right: 12px;
`;
