import { useCallback, useMemo, useState } from "react";
import { Responsive, WidthProvider } from 'react-grid-layout';
import styled from "styled-components";
import { formatBalance } from '@polkadot/util';
import { INominator } from "../../../apis/Validator";
import Account from "../../../components/Account";
import { useAppSelector } from "../../../hooks";
import { NominatorsStatus } from "../../../redux/nominatorsSlice";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const NominatorGrid = ({
  chain,
  nominators
}) => {
  const _formatBalance = useCallback((value: any) => {
    if (chain === 'KSM') {
      return (formatBalance(BigInt(value), {
        decimals: 12,
        withUnit: 'KSM'
      }));
    } else if (chain === 'DOT') {
      return (formatBalance(BigInt(value), {
        decimals: 10,
        withUnit: 'DOT'
      }));
    } else {
      return (formatBalance(BigInt(value), {
        decimals: 10,
        withUnit: 'Unit'
      }));
    }
  }, [chain]);
  const isNominatedLoaded: NominatorsStatus = useAppSelector((state) => state.nominators.status);
  const nominatorDetail = useAppSelector((state) => state.nominators.elements);
  const [cols, setCols] = useState(8);
  const onBreakpointChange = (newBreakpoint: string, newCols: number) => {
    setCols(newCols);
  };
  const nominatorComponents = useMemo(() => {
    return nominators.map((n: INominator, idx) => {
      const x = idx % cols;
      const y = Math.floor(idx / cols);
      if(isNominatedLoaded === NominatorsStatus.FULFILLED) {
        return (
          <div key={idx} data-grid={{x: x, y: y, w: 1, h: 1, static: true}}>
            <AccountLayout>
              <Account
                address={n.address}
                display={n.address}
                showNominatedInfo={true}
                amount={_formatBalance(nominatorDetail[n.address].balance.lockedBalance)}
                nominatedCount={nominatorDetail[n.address].targets.length}
              ></Account>
            </AccountLayout>
          </div>);
      } else {
        return (
          <div key={idx} data-grid={{x: x, y: y, w: 1, h: 1, static: true}}>
            <AccountLayout>
              <Account
                address={n.address}
                display={n.address}
                showNominatedInfo={false}
              ></Account>
            </AccountLayout>
          </div>);
      }
      });
    }, [_formatBalance, cols, isNominatedLoaded, nominatorDetail, nominators])
  return (
    <ResponsiveGridLayout className="layout"
      breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
      cols={{lg: 8, md: 6, sm: 5, xs: 4, xxs: 3}}
      rowHeight={40}
      onBreakpointChange={onBreakpointChange}>
        {
            nominatorComponents
        }
    </ResponsiveGridLayout>
  );
}

const AccountLayout = styled.div`
  width: 140px;
  margin: 0 16px 0 16px;
`;