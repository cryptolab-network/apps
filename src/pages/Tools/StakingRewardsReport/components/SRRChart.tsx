import moment from 'moment';
import { useEffect, useState } from 'react';
import Chart from '../../../../components/Chart';

// export interface IStashRewards {
//   stash: string;
//   eraRewards: IEraRewards[];
// }

// export interface IEraRewards {
//   era: number;
//   amount: number;
//   timestamp: number;
//   price: number;
//   total: number;
// }

interface IChartData {
  key: string;
  amount: number;
}

const mergeEraRewards = (eraRewards) => {
  return eraRewards.map((era) => {
    era.date = moment.utc(era.timestamp).format('L');
    era.total = era.total.toFixed(2);
    return era;
  });
};

const SRRChart = ({ stashData, chain }) => {
  const [chartData, setChartData] = useState<IChartData[]>([]);
  useEffect(() => {
    stashData.eraRewards.reverse();
    const dayRewards: any[] = mergeEraRewards(stashData.eraRewards);
    let rewardDistribution: number[] = [];
    const units: string[] = [];
    dayRewards.forEach((reward: any) => {
      const week = moment(reward.date).week();
      const year = moment(reward.date).year();
      const i = units.findIndex((element) => element === year + ' W' + week);
      if (i < 0) {
        units.push(year + ' W' + week);
        rewardDistribution.push(reward.amount);
      } else {
        rewardDistribution[i] += reward.amount;
      }
    });
    let maxRewards = 0;
    const cd: IChartData[] = rewardDistribution.map((dist, idx) => {
      if (dist > maxRewards) {
        maxRewards = dist;
      }
      return {
        key: units[idx],
        amount: parseFloat(dist.toFixed(3)),
      };
    });
    if (maxRewards === 0) {
      maxRewards = 1;
    }
    setChartData(cd);
  }, [stashData]);
  return (
    <Chart
      data={chartData}
      leftLabel={`Amount (${chain})`}
      xAxisHeight={80}
      config={{
        xKey: 'key',
        firstDataKey: undefined,
        secondDataKey: undefined,
        thirdDataKey: undefined,
        firstDataYAxis: undefined,
        secondDataYAxis: undefined,
        thirdDataYAxis: undefined,
        leftLabel: `Amount (${chain})`,
        rightLabel: undefined,
      }}
    />
  );
};

export default SRRChart;
