import moment from "moment";
import { useEffect, useState } from "react";
import { IEraRewards, IStashRewards } from "../../../apis/StashRewards";
import Chart from "../../../components/Chart";

interface IProfit {
  timestamp: string;
  sum: number;
  profit: number;
}

const ProfitChart = ({ chain, accounts, rewards }) => {
  const [profit, setProfit] = useState<IProfit[]>([]);
  useEffect(() => {
    const profits = {};
    rewards.forEach((stash: IStashRewards) => {
      if (stash !== undefined && stash !== null) {
        stash.eraRewards.forEach((reward: IEraRewards) => {
          if (profits[reward.timestamp] === undefined) {
            profits[reward.timestamp] = 0;
          }
          profits[reward.timestamp] += reward.amount;
        });
      }
    });
    const profitsArray: IProfit[] = [];
    const keys = Object.keys(profits);
    keys.forEach((key) => {
      profitsArray.push({
        timestamp: moment(parseInt(key)).format('YYYY-MM-DD'),
        profit: profits[key],
        sum: 0,
      });
    });
    profitsArray.sort((a, b) => {
      if (a.timestamp > b.timestamp) {
        return 1;
      } else if (a.timestamp < b.timestamp) {
        return -1;
      }
      return 0;
    });
    let sumProfit = 0;
    profitsArray.forEach((profit) => {
      profit.sum = profit.profit + sumProfit;
      sumProfit += profit.profit;
    });
    setProfit(profitsArray);
    console.log(profitsArray);
  }, [chain, accounts, rewards]);
  return (
    <Chart
      data={profit}
      leftLabel={`Profit (${chain})`}
      xAxisHeight={50}
      config = {{
        xKey: 'timestamp',
        firstDataKey: 'sum',
        firstDataYAxis: 'left',
        leftLabel: `Profit (${chain})`,
      }}
    />
  );
};

export default ProfitChart;
