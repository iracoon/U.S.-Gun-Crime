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
  age_low: string;
  age_high: string;
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
      gender: "'M'",
      age_low: '10',
      age_high: '18',
      ageGroups: [
        'All..',
        'Ages 0–9',
        'Ages 10–18',
        'Ages 19–25',
        'Ages 26–64',
        'Ages 65+',
      ],
      state: "'Alabama'",
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
      const response = await axios.get(
        `/api/location/${this.state.state}/${this.state.age_low}/${this.state.age_high}/${this.state.gender}/trends`
      );

      const deathsPerYear: number[] = [];
      response.data.forEach((p: { DEATHS: number }) =>
        deathsPerYear.push(p.DEATHS)
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
              data: deathsPerYear,
            },
          ],
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  public onButtonClick = () => {
    this.setState({
      isLoading: true,
    });
    this.fetchTrendsToolData();
  };

  public onStateChange = (value: string) => {
    if (value === 'All..') {
      this.setState({
        state: 'NULL',
      });
    } else {
      this.setState({
        state: "'" + value + "'",
      });
    }
  };

  public onGenderChange = (value: string) => {
    if (value === 'All..') {
      this.setState({
        gender: 'NULL',
      });
    } else {
      this.setState({
        gender: "'" + value[0] + "'",
      });
    }
  };

  public onAgeChange = (value: string) => {
    if (value === 'All..') {
      this.setState({
        age_low: 'NULL',
        age_high: 'NULL',
      });
    } else if (value === 'Ages 0–9') {
      this.setState({
        age_low: '0',
        age_high: '9',
      });
    } else if (value === 'Ages 10–18') {
      this.setState({
        age_low: '10',
        age_high: '18',
      });
    } else if (value === 'Ages 19–25') {
      this.setState({
        age_low: '19',
        age_high: '25',
      });
    } else if (value === 'Ages 26–64') {
      this.setState({
        age_low: '26',
        age_high: '64',
      });
    } else if (value === 'Ages 65+') {
      this.setState({
        age_low: '65',
        age_high: '110',
      });
    }
  };

  public render() {
    return (
      <section className={this.props.className}>
        <Card title="Trends Tool">
          <div style={{ marginBottom: '20px' }}>
            <Select
              onChange={this.onStateChange}
              defaultValue={'Alabama'}
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
              onChange={this.onGenderChange}
              defaultValue={'Male'}
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
              onChange={this.onAgeChange}
              defaultValue={'Ages 10–18'}
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
            <Button
              onClick={() => this.onButtonClick()}
              type="primary"
              size="large"
              shape="round"
            >
              Killed
            </Button>
            &nbsp;&nbsp;
            <Button
              onClick={() => this.onButtonClick()}
              type="primary"
              size="large"
              shape="round"
            >
              Injured
            </Button>
          </div>
          <LoadingSpin spinning={this.state.isLoading}>
            <Line
              options={{
                responsive: true,
              }}
              data={this.state.data}
              redraw={false}
            />
          </LoadingSpin>
        </Card>
      </section>
    );
  }
}

export default TrendsTool;
