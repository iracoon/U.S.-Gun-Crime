import React from 'react';
import axios from 'axios';
import { Line, ChartData } from 'react-chartjs-2';
import { Card, Button } from 'antd';
import { Select } from 'antd';
import states from '../StateComparisons/states';
import LoadingSpin from '../../../../components/LoadingSpin/LoadingSpin';
import * as chartjs from 'chart.js';

interface TrendsToolProps {
  className: string;
}

interface TrendsToolState {
  state: string;
  states_copy: string[];
  gender: string;
  genders: string[];
  ageGroup: string;
  ageGroups: string[];
  isLoading: boolean;
  data: ChartData<chartjs.ChartData>;
}

class TrendsTool extends React.Component<TrendsToolProps, TrendsToolState> {
  public constructor(props: TrendsToolProps) {
    super(props);
    this.state = {
      states_copy: states.slice(),
      genders: ['All..', 'Male', 'Female'],
      gender: 'Male',
      ageGroup: 'Ages 10–18',
      ageGroups: [
        'All..',
        'Ages 0–9',
        'Ages 10–18',
        'Ages 19–25',
        'Ages 26–64',
        'Ages 65+',
      ],
      state: states[1],
      isLoading: true,
      data: {
        labels: [],
        datasets: [
          {
            label: '',
            backgroundColor: '',
            data: [],
          },
        ],
      },
    };
    if (!this.state.states_copy.includes('All..')) {
      this.state.states_copy.unshift('All..');
    }
  }

  public componentDidMount() {
    this.fetchTrendsToolData();
  }

  private fetchTrendsToolData = async () => {
    try {
      const response1 = await axios.get(
        `/api/location/${this.state.state}/deathsPerYear`
      );

      const deathsPerYear1: number[] = [];
      response1.data.forEach((p: { DEATHS: number }) =>
        deathsPerYear1.push(p.DEATHS)
      );

      this.setState({
        ...this.state,
        isLoading: false,
        data: {
          labels: ['2013', '2014', '2015', '2016', '2017', '2018'],
          datasets: [
            {
              label: 'Gun deaths by year in ' + this.state.state,
              backgroundColor: 'rgba(247, 143, 76, 0.2)',
              data: deathsPerYear1,
            },
          ],
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  public onStateChange = (value: string) => {
    this.setState(
      {
        state: value,
        isLoading: true,
        data: {
          labels: [],
          datasets: [
            {
              label: '',
              backgroundColor: '',
              data: [],
            },
          ],
        },
      },
      () => {
        this.fetchTrendsToolData();
      }
    );
  };

  public render() {
    const { state } = this.state;
    const { gender } = this.state;
    const { ageGroup } = this.state;
    return (
      <section className={this.props.className}>
        <Card title="Trends Tool">
          <div style={{ marginBottom: '20px' }}>
            <Select
              defaultValue={state}
              showSearch={true}
              style={{ width: 150 }}
            >
              {this.state.states_copy.map((item, index) => (
                <Select.Option value={item} key={`${index}1`}>
                  {item}
                </Select.Option>
              ))}
            </Select>
            &nbsp;&nbsp;
            <Select
              defaultValue={gender}
              showSearch={true}
              style={{ width: 150 }}
            >
              {this.state.genders.map((item, index) => (
                <Select.Option value={item} key={`${index}1`}>
                  {item}
                </Select.Option>
              ))}
            </Select>
            &nbsp;&nbsp;
            <Select
              defaultValue={ageGroup}
              showSearch={true}
              style={{ width: 150 }}
            >
              {this.state.ageGroups.map((item, index) => (
                <Select.Option value={item} key={`${index}1`}>
                  {item}
                </Select.Option>
              ))}
            </Select>
            <br />
            <br />
            <Button type="primary" size="large" shape="round">
              Killed
            </Button>
            &nbsp;&nbsp;
            <Button type="primary" size="large" shape="round">
              Injured
            </Button>
          </div>
          <LoadingSpin spinning={this.state.isLoading}>
            <Line
              options={{
                responsive: true,
              }}
              data={this.state.data}
              redraw={true}
            />
          </LoadingSpin>
        </Card>
      </section>
    );
  }
}

export default TrendsTool;
