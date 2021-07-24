import styled from 'styled-components';
import { eraStatus } from '../../../../../utils/status/Era';

interface IEra {
  statusCode: eraStatus;
}

const Era: React.FC<IEra> = ({ statusCode }) => {
  return <EraLayout statusCode={statusCode} />;
};

export default Era;

const EraLayout = styled.span<IEra>`
  display: inline-block;
  width: 6px;
  height: 20px;
  margin-left: 6px;
  border-radius: 2px;
  background-color: ${(props) =>
    props.statusCode === eraStatus.active
      ? '#20aca8'
      : props.statusCode === eraStatus.inactive
      ? '#17222e'
      : '#f7ab00'};
`;
