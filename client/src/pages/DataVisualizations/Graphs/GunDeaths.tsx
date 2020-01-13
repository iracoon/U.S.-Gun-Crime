import React from 'react';
import axios from 'axios';
import { Line, ChartData, Bar } from 'react-chartjs-2';
import { primaryBlue, darkBlue, lightBlue, golden } from '../chartColors';
import LoadingSpin from '../../../components/LoadingSpin/LoadingSpin';
import * as chartjs from 'chart.js';

interface GunDeathsState {
  isLoading: boolean;
  data: ChartData<chartjs.ChartData>;
}

class GunDeaths extends React.Component<{}, GunDeathsState> {
  public constructor(props: {}) {
    super(props);
    this.state = {
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
  }

  public componentDidMount() {
    this.fetchGunDeathsData();
  }

  private fetchGunDeathsData = async () => {
    try {
      const response = await axios.get('/api/gun/gunDeaths');

      const nullKilled: number[] = [];
      const stolenKilled: number[] = [];
      const legalKilled: number[] = [];
      const gunNames: string[] = [];

      response.data.forEach(
        (p: {
          NULL_KILLED: number;
          STOLEN_KILLED: number;
          LEGAL_KILLED: number;
          TYPE: string;
        }) => (
          nullKilled.push(p.NULL_KILLED),
          stolenKilled.push(p.STOLEN_KILLED),
          legalKilled.push(p.LEGAL_KILLED),
          gunNames.push(p.TYPE)
        )
      );

      this.setState({
        ...this.state,
        isLoading: false,
        data: {
          labels: gunNames,
          datasets: [
            {
              label: 'unknown',
              data: nullKilled,
              backgroundColor: darkBlue,
            },
            {
              label: 'gun deaths caused by stolen guns',
              data: stolenKilled,
              backgroundColor: lightBlue,
            },
            {
              label: 'gun deaths caused by legal guns',
              data: legalKilled,
              backgroundColor: golden,
            },
          ],
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  public render() {
    return (
      <div>
        <LoadingSpin spinning={this.state.isLoading}>
          <Bar
            options={{
              responsive: true,
              scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: true }],
              },
            }}
            data={this.state.data}
          />
        </LoadingSpin>
      </div>
    );
  }
}

export default GunDeaths;
