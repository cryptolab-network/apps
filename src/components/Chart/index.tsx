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

export interface IChart {
  data: any[];
  showTools?: boolean;
  secondYAxis?: boolean;
  leftLabel: string;
  rightLabel?: string;
  xAxisHeight?: number;
  xAxisFontSize?: number;
  legendPayload?: any[];
  yAxisLDomain?: number[];
  yAxisRDomain?: number[];
  yAxisLabelLeftOffset?: number;
  yAxisLabelRightOffset?: number;
  strokeWidth?: number;
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
    marginLeft?: number | undefined;
    marginRight?: number | undefined;
    marginTop?: number | undefined;
    marginBottom?: number | undefined;
  };
}

const CustomTooltipLegends = ({ active, payload, label, legends }: any) => {
  if (active && payload && payload.length) {
    return (
      <TooltipLayout>
        <TooltipHeader>{`${label}`}</TooltipHeader>
        <TooltipBody>
          {payload.length >= 1 && (
            <TooltipContent color="#21aca8">
              {`${legends[0].value} : `}
              <TooltipValue>{payload[0].value}</TooltipValue>
            </TooltipContent>
          )}
          {payload.length >= 2 && (
            <TooltipContent color="#6e95c3">
              {`${legends[1].value} : `}
              <TooltipValue>{payload[1].value}</TooltipValue>
            </TooltipContent>
          )}
          {payload.length >= 3 && (
            <TooltipContent color="#236bbe">
              {`${legends[2].value} : `}
              <TooltipValue>{payload[2].value}</TooltipValue>
            </TooltipContent>
          )}
        </TooltipBody>
      </TooltipLayout>
    );
  }

  return null;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <TooltipLayout>
        <TooltipHeader>{`${label}`}</TooltipHeader>
        <TooltipBody>
          {payload.length >= 1 && (
            <TooltipContent color="#21aca8">
              {`${payload[0].name} : `}
              <TooltipValue>{payload[0].value}</TooltipValue>
            </TooltipContent>
          )}
          {payload.length >= 2 && (
            <TooltipContent color="#6e95c3">
              {`${payload[1].name} : `}
              <TooltipValue>{payload[1].value}</TooltipValue>
            </TooltipContent>
          )}
          {payload.length >= 3 && (
            <TooltipContent color="#236bbe">
              {`${payload[2].name} : `}
              <TooltipValue>{payload[2].value}</TooltipValue>
            </TooltipContent>
          )}
        </TooltipBody>
      </TooltipLayout>
    );
  }

  return null;
};

const Chart: React.FC<IChart> = ({
  data = [],
  showTools = false,
  secondYAxis = false,
  leftLabel = '',
  rightLabel = '',
  xAxisHeight = 30,
  xAxisFontSize = 15,
  legendPayload = [],
  yAxisLDomain = [],
  yAxisRDomain = [],
  yAxisLabelLeftOffset = 5,
  yAxisLabelRightOffset = 5,
  strokeWidth = 2,
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
    marginLeft: undefined,
    marginRight: undefined,
    marginTop: undefined,
    marginBottom: undefined,
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
    marginLeft: undefined,
    marginRight: undefined,
    marginTop: undefined,
    marginBottom: undefined,
  });

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
      marginLeft: config.marginLeft ? config.marginLeft : 0,
      marginRight: config.marginRight ? config.marginRight : 0,
      marginTop: config.marginTop ? config.marginTop : 0,
      marginBottom: config.marginBottom ? config.marginBottom : 0,
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
    config.marginBottom,
    config.marginTop,
    config.marginLeft,
    config.marginRight,
    data,
    leftLabel,
    rightLabel,
  ]);

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
            top: chartConfig?.marginTop || 0,
            right: chartConfig?.marginRight || 0,
            left: chartConfig?.marginLeft || 0,
            bottom: chartConfig?.marginBottom || 0,
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
            <YAxis
              tick={{ fill: 'white' }}
              yAxisId="left"
              axisLine={false}
              tickSize={0}
              tickMargin={5}
              domain={yAxisLDomain.length === 2 ? yAxisLDomain : [0, 'auto']}
            >
              <Label
                value={chartConfig.leftLabel}
                position="insideLeft"
                angle={-90}
                fontSize={13}
                fontWeight={500}
                fill="#535a62"
                offset={yAxisLabelLeftOffset}
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
              domain={yAxisRDomain.length === 2 ? yAxisRDomain : [0, 'auto']}
            >
              <Label
                value={chartConfig.rightLabel}
                position="insideRight"
                angle={-90}
                fontSize={13}
                fontWeight={500}
                fill="#535a62"
                offset={yAxisLabelRightOffset}
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
          )}

          {legendPayload.length > 0 ? (
            <>
              <Tooltip content={<CustomTooltipLegends legends={legendPayload} />} />
              <Legend
                iconSize={16}
                iconType="square"
                verticalAlign="bottom"
                payload={legendPayload}
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
            </>
          ) : (
            <>
              <Tooltip content={<CustomTooltip />} />
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
            </>
          )}

          {chartConfig?.firstDataKey && (
            <Line
              yAxisId={chartConfig?.firstDataYAxis}
              type="linear"
              dataKey={chartConfig?.firstDataKey}
              stroke="#21aca8"
              strokeWidth={strokeWidth}
              dot={false}
            />
          )}
          {chartConfig?.secondDataKey && (
            <Line
              yAxisId={chartConfig?.secondDataYAxis}
              type="linear"
              dataKey={chartConfig?.secondDataKey}
              stroke="#6e95c3"
              strokeWidth={strokeWidth}
              dot={false}
            />
          )}
          {chartConfig?.thirdDataKey && (
            <Line
              yAxisId={chartConfig?.thirdDataYAxis}
              type="linear"
              dataKey={chartConfig?.thirdDataKey}
              stroke="#236bbe"
              strokeWidth={strokeWidth}
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

const TooltipLayout = styled.div`
  background-color: #18232f;
  border-radius: 6px;
  border: solid 1px #23beb9;
`;
const TooltipHeader = styled.div`
  border-bottom: solid 1px #23beb9;
  padding: 8px;
  font-weight: bold;
  font-size: 12px;
  color: white;
`;
const TooltipBody = styled.div`
  padding: 8px;
`;

const TooltipContent = styled.div`
  font-size: 12px;
  color: ${(props) => (props.color ? props.color : 'black')};
`;

const TooltipValue = styled.span`
  font-weight: bold;
`;
