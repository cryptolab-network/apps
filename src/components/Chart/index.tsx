import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import './index.css';
import Tools from './components/Tools';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

interface IChart {
  data: any[];
  showTools?: boolean;
  secondYAxis?: boolean;
  leftLabel: string;
  rightLabel?: string;
  xAxisHeight?: number;
  xAxisFontSize?: number;
  legendPayload?: any[];
  config?: {
    xKey: string | undefined;
    firstDataKey: string | undefined;
    secondDataKey?: string | undefined;
    thirdDataKey?: string | undefined;
    firstDataYAxis: string | undefined;
    secondDataYAxis?: string | undefined;
    thirdDataYAxis?: string | undefined;
    leftLabel?: string | undefined;
    rightLabel?: string | undefined;
  };
}
const Chart: React.FC<IChart> = ({
  data = [],
  showTools = false,
  secondYAxis = false,
  leftLabel = '',
  rightLabel = '',
  xAxisHeight = 30,
  xAxisFontSize = 15,
  legendPayload = [],
  config = {
    xKey: undefined,
    firstDataKey: undefined,
    secondDataKey: undefined,
    thirdDataKey: undefined,
    firstDataYAxis: undefined,
    secondDataYAxis: undefined,
    thirdDataYAxis: undefined,
    leftLabel: undefined,
    rightLabel: undefined,
  },
}) => {
  const [chartConfig, setChartConfig] = useState<IChart['config']>({
    xKey: undefined,
    firstDataKey: undefined,
    secondDataKey: undefined,
    thirdDataKey: undefined,
    firstDataYAxis: 'left',
    secondDataYAxis: 'right',
    thirdDataYAxis: 'right',
    leftLabel: '',
    rightLabel: '',
  });
  const [customLegend, setCustomLegend] = useState<any>([]);

  useEffect(() => {
    const tempConfig: IChart['config'] = {
      xKey: undefined,
      firstDataKey: undefined,
      secondDataKey: undefined,
      thirdDataKey: undefined,
      firstDataYAxis: config.firstDataYAxis ? config.firstDataYAxis : 'left',
      secondDataYAxis: config.secondDataYAxis ? config.secondDataYAxis : 'right',
      thirdDataYAxis: config.thirdDataYAxis ? config.thirdDataYAxis : 'right',
      leftLabel: config.leftLabel ? config.leftLabel : leftLabel,
      rightLabel: config.rightLabel ? config.rightLabel : rightLabel,
    };
    if (data.length) {
      Object.keys(data[0]).forEach((key, idx) => {
        if (idx === 0 && key) {
          tempConfig.xKey = config.xKey ? config.xKey : key;
        } else if (idx === 1 && key) {
          tempConfig.firstDataKey = config.firstDataKey ? config.firstDataKey : key;
        } else if (idx === 2 && key) {
          tempConfig.secondDataKey = config.secondDataKey ? config.secondDataKey : key;
        } else if (idx === 3 && key) {
          tempConfig.thirdDataKey = config.thirdDataKey ? config.thirdDataKey : key;
        }
      });
    }

    setChartConfig((prev) => ({ ...prev, ...tempConfig }));
  }, [
    config.firstDataKey,
    config.firstDataYAxis,
    config.leftLabel,
    config.rightLabel,
    config.secondDataKey,
    config.secondDataYAxis,
    config.thirdDataKey,
    config.thirdDataYAxis,
    config.xKey,
    data,
    leftLabel,
    rightLabel,
  ]);

  useEffect(() => {
    if (legendPayload && legendPayload.length > 0) {
      for (let idx = 0; idx < legendPayload.length; idx++) {
        legendPayload[idx]['type'] = 'square';
        if (idx === 0) {
          legendPayload[idx]['color'] = '#21aca8';
        } else if (idx === 1) {
          legendPayload[idx]['color'] = '#6e95c3';
        } else if (idx === 2) {
          legendPayload[idx]['color'] = '#236bbe';
        }
      }
    }
    setCustomLegend(legendPayload);
  }, [legendPayload]);

  if (data.length === 0) {
    return null;
  }
  return (
    <MainLayout>
      {showTools && <Tools />}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} stroke="#404952" />
          <XAxis
            tick={{ fill: 'white', fontSize: xAxisFontSize }}
            stroke="#404952"
            dataKey={chartConfig?.xKey}
            angle={-55}
            tickLine={false}
            tickSize={0}
            tickMargin={25}
            height={xAxisHeight}
          />
          {((chartConfig?.firstDataKey && chartConfig?.firstDataYAxis === 'left') ||
            (chartConfig?.secondDataKey && chartConfig?.secondDataYAxis === 'left') ||
            (chartConfig?.thirdDataKey && chartConfig?.thirdDataYAxis === 'left')) && (
            <YAxis tick={{ fill: 'white' }} yAxisId="left" axisLine={false} tickSize={0} tickMargin={5}>
              <Label
                value={chartConfig.leftLabel}
                position="insideLeft"
                angle={-90}
                fontSize={13}
                fontWeight={500}
                fill="#535a62"
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
          )}
          {((chartConfig?.firstDataKey && chartConfig?.firstDataYAxis === 'right') ||
            (chartConfig?.secondDataKey && chartConfig?.secondDataYAxis === 'right') ||
            (chartConfig?.thirdDataKey && chartConfig?.thirdDataYAxis === 'right')) && (
            <YAxis
              tick={{ fill: 'white' }}
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickSize={0}
              tickMargin={5}
            >
              <Label
                value={chartConfig.rightLabel}
                position="insideRight"
                angle={-90}
                fontSize={13}
                fontWeight={500}
                fill="#535a62"
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
          )}

          <Tooltip />
          {legendPayload.length > 0 ? (
            <Legend
              iconSize={16}
              iconType="square"
              verticalAlign="bottom"
              // height={50}
              payload={customLegend}
              wrapperStyle={{
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                fontSize: 13,
                height: 40,
                bottom: 16,
              }}
            />
          ) : (
            <Legend
              iconSize={16}
              iconType="square"
              verticalAlign="bottom"
              // height={50}
              wrapperStyle={{
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                fontSize: 13,
                height: 40,
                bottom: 16,
              }}
            />
          )}

          {chartConfig?.firstDataKey && (
            <Line
              yAxisId={chartConfig?.firstDataYAxis}
              type="linear"
              dataKey={chartConfig?.firstDataKey}
              stroke="#21aca8"
              strokeWidth={5}
              dot={false}
            />
          )}
          {chartConfig?.secondDataKey && (
            <Line
              yAxisId={chartConfig?.secondDataYAxis}
              type="linear"
              dataKey={chartConfig?.secondDataKey}
              stroke="#6e95c3"
              strokeWidth={5}
              dot={false}
            />
          )}
          {chartConfig?.thirdDataKey && (
            <Line
              yAxisId={chartConfig?.thirdDataYAxis}
              type="linear"
              dataKey={chartConfig?.thirdDataKey}
              stroke="#236bbe"
              strokeWidth={5}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </MainLayout>
  );
};

export default Chart;

const MainLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
