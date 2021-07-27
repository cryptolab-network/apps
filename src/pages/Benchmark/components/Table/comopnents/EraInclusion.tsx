import styled from 'styled-components';
import { eraStatus } from '../../../../../utils/status/Era';

interface IEraInclusion {
  rate: number;
  activeCount: number;
  total: number;
}

const EraInclusion: React.FC<IEraInclusion> = ({ rate, activeCount, total }) => {
  return (
    <EraInclusionLayout>
      <Rate>{rate}</Rate>{' '}
      <Value>
        <Active>{activeCount}</Active>/<Total>{total}</Total>
      </Value>
    </EraInclusionLayout>
  );
};

export default EraInclusion;

const EraInclusionLayout = styled.div`
  display: inline-block;
  font-size: 13px;
`;

const Rate = styled.span`
  ::after {
    content: '%';
  }
`;

const Value = styled.span`
  ::before {
    content: '[';
  }
  ::after {
    content: ']';
  }
`;

const Active = styled.span`
  color: #20aca8;
`;

const Total = styled.span`
  color: white;
`;
