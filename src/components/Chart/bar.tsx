import {
  BarChart,
  Bar,
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
import { IChart } from './index';

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
    if (data && data.length && data[0]) {
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
        <BarChart
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
                  alignItems: 'flex-start',
                  fontSize: 13,
                  height: 40,
                  bottom: 20,
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
                  alignItems: 'flex-start',
                  fontSize: 13,
                  height: 40,
                  bottom: 20,
                }}
              />
            </>
          )}

          {chartConfig?.firstDataKey && (
            <Bar
              yAxisId={chartConfig?.firstDataYAxis}
              //   type="linear"
              dataKey={chartConfig?.firstDataKey}
              fill="#21aca8"
              //   strokeWidth={5}
              //   dot={false}
            />
          )}
          {chartConfig?.secondDataKey && (
            <Bar
              yAxisId={chartConfig?.secondDataYAxis}
              //   type="linear"
              dataKey={chartConfig?.secondDataKey}
              fill="#6e95c3"
              //   strokeWidth={5}
              //   dot={false}
            />
          )}
          {chartConfig?.thirdDataKey && (
            <Bar
              yAxisId={chartConfig?.thirdDataYAxis}
              //   type="linear"
              dataKey={chartConfig?.thirdDataKey}
              fill="#236bbe"
              //   strokeWidth={5}
              //   dot={false}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </MainLayout>
  );
};

export default Chart;

const MainLayout = styled.div`
  box-sizing: border-box;
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
