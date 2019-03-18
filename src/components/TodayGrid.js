import React, { Component } from 'react';
import '../styles/TodayGrid.css';
import TodayInfo from './TodayInfo.js';
import Chart from './Chart';
export default class TodayGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: this.props.chartData,
        }
    }

    componentWillMount() {
        this.getChartData();
    }

    getChartData() {
        // Ajax calls here

        this.setState({
            chartData: {
                labels: ['Mycket bra', 'Bra', 'Dåligt', 'Mycket dåligt'],
                datasets: [
                    {
                        label: 'Population',
                        data: [
                            242,
                            321,
                            156,
                            82,
                        ],
                        backgroundColor: [
                            'rgba(100, 186, 29, 0.6)',
                            'rgba(216, 230, 8, 0.6)',
                            'rgba(242, 163, 7, 0.6)',
                            'rgba(232, 46, 9, 0.6)',
                        ]
                    }
                ]
            }
        });
    }

    render() {
        return (
            <div className="MainContainer">
                <div className="TodayGrid">
                    <div className="LeftColumn">
                        <TodayInfo
                            headline="Dagens måltid"
                            info="Pannbiffar"
                        />
                        <TodayInfo
                            headline="Dagens fråga"
                            info="Vad tyckte du om maten?"
                        />
                    </div>
                    <div className="RightColumn">
                        <Chart
                            chartData={this.state.chartData}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
/*



                */