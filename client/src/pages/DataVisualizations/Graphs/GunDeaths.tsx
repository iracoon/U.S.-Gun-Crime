import React from 'react';
import axios from 'axios';
import { Line, ChartData, Bar } from 'react-chartjs-2';
import { primaryBlue } from '../chartColors';
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

      //   const participantAgeDistributionData: number[] = [];

      //   response.data.forEach(
      //     (p: {
      //       GROUP1: number;
      //       GROUP2: number;
      //       GROUP3: number;
      //       GROUP4: number;
      //       GROUP5: number;
      //     }) =>
      //       participantAgeDistributionData.push(
      //         p.GROUP1,
      //         p.GROUP2,
      //         p.GROUP3,
      //         p.GROUP4,
      //         p.GROUP5
      //       )
      //   );

      this.setState({
        ...this.state,
        isLoading: false,
        data: {
          labels: gunNames,
          datasets: [
            {
              label: 'Low',
              data: nullKilled,
              backgroundColor: '#D6E9C6', // green
            },
            {
              label: 'Moderate',
              data: stolenKilled,
              backgroundColor: '#FAEBCC', // yellow
            },
            {
              label: 'High',
              data: legalKilled,
              backgroundColor: '#EBCCD1', // red
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
              legend: {
                display: false,
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
