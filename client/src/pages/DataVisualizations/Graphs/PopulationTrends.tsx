import React from 'react';
import axios from 'axios';
import { Line, ChartData } from 'react-chartjs-2';
import { darkgreen } from '../chartColors';
import LoadingSpin from '../../../components/LoadingSpin/LoadingSpin';
import * as chartjs from 'chart.js';

interface PopulationTrendsState {
  isLoading: boolean;
  PopulationTrendsData: number[];
  data: ChartData<chartjs.ChartData>;
}

class PopulationTrends extends React.Component<{}, PopulationTrendsState> {
  public constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
      PopulationTrendsData: [],
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
    this.fetchPopulationTrendsData();
  }

  private fetchPopulationTrendsData = async () => {
    try {
      const response = await axios.get('/api/incident/populationPerYear');

      const PopulationTrendsData: number[] = [];

      response.data.forEach((p: { POPULATIONS: number }) =>
        PopulationTrendsData.push(p.POPULATIONS)
      );

      this.setState({
        ...this.state,
        isLoading: false,
        PopulationTrendsData,
        data: {
          labels: ['2013', '2014', '2015', '2016', '2017', '2018'],
          datasets: [
            {
              label: 'Population by year nationally',
              backgroundColor: darkgreen,
              data: PopulationTrendsData,
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
            }}
            data={this.state.data}
          />
        </LoadingSpin>
      </div>
    );
  }
}

export default PopulationTrends;
