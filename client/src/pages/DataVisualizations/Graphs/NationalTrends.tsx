import React from 'react';
import axios from 'axios';
import { Line, ChartData } from 'react-chartjs-2';
import { primaryBlue } from '../chartColors';
import LoadingSpin from 'components/LoadingSpin/LoadingSpin';
import * as chartjs from 'chart.js';

interface NationalTrendsState {
  isLoading: boolean;
  data: ChartData<chartjs.ChartData>;
}

class NationalTrends extends React.Component<{}, NationalTrendsState> {
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
    this.fetchNationalTrendsData();
  }

  private fetchNationalTrendsData = async () => {
    try {
      const response1 = await axios.get('/api/incident/casualtiesPerYear');

      const casualtiesTrendsData: number[] = [];
      response1.data.forEach((p: { CASUALTIES: number }) =>
        casualtiesTrendsData.push(p.CASUALTIES)
      );

      const response2 = await axios.get('/api/incident/populationPerYear');

      const populationTrendsData: number[] = [];
      response2.data.forEach((p: { POPULATIONS: number }) =>
        populationTrendsData.push(p.POPULATIONS)
      );

      this.setState({
        ...this.state,
        isLoading: false,
        data: {
          labels: ['2013', '2014', '2015', '2016', '2017', '2018'],
          datasets: [
            {
              label: 'Gun deaths by year in ',
              backgroundColor: 'rgba(247, 143, 76, 0.2)',
              data: casualtiesTrendsData,
            },
            {
              label: 'Gun deaths by year in ',
              backgroundColor: 'rgba(60, 102, 163, 0.8)',
              data: populationTrendsData,
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
          <Line
            options={{
              responsive: true,
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

export default NationalTrends;
