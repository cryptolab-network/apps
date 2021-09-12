import { useCallback, useMemo, useState, useContext } from "react";
import { Responsive, WidthProvider } from 'react-grid-layout';
import styled from "styled-components";
import { INominator } from "../../../apis/Validator";
import Account from "../../../components/Account";
import { DataContext } from "../components/Data";
import { balanceUnit } from "../../../utils/string";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const NominatorGrid = ({
  chain,
  nominators
}) => {
  const _formatBalance = useCallback((value: any) => {
    return balanceUnit(chain, value, true, true);
  }, [chain]);
  const { isNominatedLoaded, nominators: nominatorDetail } = useContext(DataContext);
  const [cols, setCols] = useState(8);
  const onBreakpointChange = (newBreakpoint: string, newCols: number) => {
    setCols(newCols);
  };
  const nominatorComponents = useMemo(() => {
    return nominators.map((n: INominator, idx) => {
      const x = idx % cols;
      const y = Math.floor(idx / cols);
      if(isNominatedLoaded) {
        if (nominatorDetail[n.address] !== undefined) {
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
          return (<div></div>);
        }
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