
import React, { Component } from 'react';
import '../styles/TodayGrid.css';
import TodayInfo from './TodayInfo.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import Chart from './Chart';
var data;
var i;
export default class TodayGrid extends Component {
    constructor(props) {
        i = 0;
        super(props);
        console.log("props todaygrid");
        console.log(this.props);
        this.state = {
            vGood: this.props.vGood,
            good: this.props.good,
            bad: this.props.bad,
            vBad: this.props.vBad,
            data: [this.props.vGood, this.props.good, this.props.bad, this.props.vBad],
            meal: this.props.meal
        }
    }
    componentDidUpdate(previousProps) {
        if (previousProps.data !== this.props.data) {
            this.setState({
                vGood: this.props.vGood,
                good: this.props.good,
                bad: this.props.bad,
                vBad: this.props.vBad,
                data: [this.props.vGood, this.props.good, this.props.bad, this.props.vBad],
                meal: this.props.meal
            })
        }
    }
    getChartData() {
        return {
            labels: ['Mycket bra', 'Bra', 'Dåligt', 'Mycket dåligt'],
            datasets: [
                {
                    label: 'Population',
                    data: this.state.data,
                    backgroundColor: [
                        'rgba(100, 186, 29, 0.6)',
                        'rgba(216, 230, 8, 0.6)',
                        'rgba(242, 163, 7, 0.6)',
                        'rgba(232, 46, 9, 0.6)',
                    ]
                }
            ]
        }
    }

    render() {
        return (
            <div>
                <div className="TodayGrid">
                    <div className="LeftColumn">
                        <TodayInfo
                            headline="Dagens måltid"
                            info={this.state.meal}
                        />
                        <TodayInfo
                            headline="Dagens fråga"
                            info="Vad tyckte du om maten?"
                        />
                    </div>
                    <div className="RightColumn">

                        <Bar
                            data={this.getChartData()}
                            options={{
                                legend: {
                                    display: false,
                                },
                                maintainAspectRatio: false,
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                            userCallback: function (label, index, labels) {
                                                if (Math.floor(label) === label) {
                                                    return label;
                                                }
                                            }
                                        }
                                    }],
                                    xAxes: [{
                                        ticks: {
                                            userCallback: function (label) {
                                                if (window.innerWidth > 500) {
                                                    return label;
                                                }
                                            }
                                        }
                                    }]
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
