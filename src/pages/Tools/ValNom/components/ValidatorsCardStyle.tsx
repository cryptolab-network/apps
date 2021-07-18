import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as PeopleIcon } from '../../../../assets/images/people.svg';
import { ReactComponent as Search } from '../../../../assets/images/search.svg';
import CardHeader from '../../../../components/Card/CardHeader';
import IconInput from '../../../../components/Input/IconInput';
import { useAppSelector } from '../../../../hooks';
import { CryptoLabHandler, IValidator } from '../../../../instance/CryptoLabHandler';
import { formatBalance } from '@polkadot/util';
import { Responsive, WidthProvider } from 'react-grid-layout';
import ValidNominator from '../../../../components/ValidNominator';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ValNomHeader = () => {
  return (
    <HeaderLayout>
      <HeaderLeft>
        <PeopleIcon />
        <HeaderTitle>
          <Title>Validator / Nominator Status</Title>
          <Subtitle>See filtered validator status or enter a nominator stash ID to see its nominated validators</Subtitle>
        </HeaderTitle>
      </HeaderLeft>
    </HeaderLayout>
  );
};

const ValidatorGrid = () => {
  const networkName = useAppSelector(state => state.network.name);
  const chain = (networkName === 'Polkadot') ? "DOT" : "KSM";
  const [validators, setValidators] = useState<IValidator[]>([]);
  const _formatBalance = useCallback((value: any) => {
    if (chain === 'KSM') {
      return (formatBalance(BigInt(value), {
        decimals: 12,
        withUnit: 'KSM'
      }));
    } else if (chain === 'DOT') {
      return (formatBalance(value, {
        decimals: 10,
        withUnit: 'DOT'
      }));
    } else {
      return (formatBalance(value, {
        decimals: 10,
        withUnit: 'Unit'
      }));
    }
  }, [chain]);
  useEffect(() => {
    const apiHandler = new CryptoLabHandler();
    async function getValidators() {
      try {
        const validators = await apiHandler.getAllValidators(chain);
        setValidators(validators.slice(0, 100));
      } catch (err) {
        console.error(err);
      }
    };
    getValidators();
  }, [chain]);
  const [cols, setCols] = useState(6);
  const onBreakpointChange = (newBreakpoint: string, newCols: number) => {
    setCols(newCols);
  };
  const validatorComponents = useMemo(() => {
    return validators.map((v, idx) => {
      const x = idx % cols;
      return (
        <div key={idx} data-grid={{x: x, y: 0, w: 1, h: 1, static: true}}>
          <ValidNominator
          address={v.id}
          name={v.identity.display}
          activeAmount={_formatBalance(v.info.exposure.own)}
          totalAmount={_formatBalance(v.info.exposure.total)}
          apy={(v.averageApy * 100).toFixed(2)}
          commission={v.info.commission}
          count={v.info.nominatorCount}
          ></ValidNominator>
        </div>);
      });
  }, [_formatBalance, cols, validators])
  if (validatorComponents.length > 0) {
    return (
      <ResponsiveGridLayout className="layout"
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 6, md: 4, sm: 3, xs: 2, xxs: 1}}
        rowHeight={300}
        onBreakpointChange={onBreakpointChange}>
          {
            validatorComponents
          }
      </ResponsiveGridLayout>
    );
  } else {
    return (<div></div>);
  }
};

const ValNomContent = () => {
  const [filters, setFilters] = useState({
    stashId: '',
  });
  const handleFilterChange = (name) => (e) => {
    // TODO: input validator, limit
    switch (name) {
      case 'stashId':
        setFilters((prev) => ({ ...prev, stashId: e.target.value }));
        break;
      default:
        break;
    }
  };
  return (
    <ValNomContentLayout>
      <OptionBar>
        <IconInput
          Icon={Search}
          iconSize="16px"
          placeholder="Polkadot/Kusama StashId"
          inputLength={256}
          value={filters.stashId}
          onChange={handleFilterChange('stashId')}
        />
      </OptionBar>
      <ValidatorGrid />
    </ValNomContentLayout>
  );
};

const ValNomStatus = () => {
  return (
    <CardHeader
      Header={() => (
        <ValNomHeader/>
      )}
    >
      <ValNomContent/>
    </CardHeader>
  );
};

export default ValNomStatus;

const HeaderLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const HeaderTitle = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 18px;
`;

const Title = styled.div`
  width: 1400px;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
`;

const Subtitle = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.55;
`;

const OptionBar = styled.div`
  width: 100%;
  height: 62px;
  padding: 12px 0px 0px 13.8px;
  border-radius: 6px;
  background-color: #2f3842;
`;

const ValNomContentLayout = styled.div`
  width: 100%
`;