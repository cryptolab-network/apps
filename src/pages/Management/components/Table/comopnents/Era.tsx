import styled from 'styled-components';
import { eraStatus } from '../../../../../utils/status/Era';
import ReactTooltip from 'react-tooltip';

interface IEra {
  statusCode: eraStatus;
  eraNumber: number;
}

const Era: React.FC<IEra> = ({ statusCode, eraNumber }) => {
  return (
    <span>
      <ReactTooltip id="eratip" place="bottom" effect="solid" backgroundColor="#18232f" textColor="#21aca8" />
      <EraLayout statusCode={statusCode} eraNumber={eraNumber} data-for="eratip" data-tip={eraNumber} />
    </span>
  );
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
