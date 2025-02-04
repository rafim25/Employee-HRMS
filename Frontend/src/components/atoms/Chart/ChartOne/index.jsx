import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts'

class ChartOne extends Component {
  constructor(props) {
    super(props);
    this.initializeChart(props);
  }
  calculateTotals = (monthlyExpenses, monthlyIncome) => {
    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + Number(expense), 0);
    const totalIncome = monthlyIncome.reduce((sum, income) => sum + Number(income), 0);
    return { totalExpenses, totalIncome };
  }

  formatCurrency = (value) => {
    if (value >= 10000000) { // 10 million or more
      return '₹' + (value / 10000000).toFixed(2) + 'Cr';
    } else if (value >= 100000) { // 1 lakh or more
      return '₹' + (value / 100000).toFixed(2) + 'L';
    } else if (value >= 1000) { // 1 thousand or more
      return '₹' + (value / 1000).toFixed(2) + 'K';
    }
    return '₹' + value.toFixed(2);
  }

  initializeChart = (props) => {
    
    const monthlyExpenses = Array.isArray(props.monthlyExpenses) 
      ? props.monthlyExpenses.map(Number) 
      : Array(12).fill(0);

    const monthlyIncome = Array.isArray(props.monthlyIncome)
      ? props.monthlyIncome.map(Number)
      : Array(12).fill(50000);


    const { totalExpenses, totalIncome } = this.calculateTotals(monthlyExpenses, monthlyIncome);

    this.state = {
      series: [
        {
          name: 'Income',
          data: monthlyIncome
        },
        {
          name: 'Expenses',
          data: monthlyExpenses
        }
      ],
      totalIncome,
      totalExpenses,
      options: {
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'left',
        },
        colors: ['#3C50E0', '#80CAEE'], // Dark blue for Income, Light blue for Expenses
        chart: {
          fontFamily: 'Satoshi, sans-serif',
          height: 335,
          type: 'area',
          dropShadow: {
            enabled: true,
            color: '#623CEA14',
            top: 10,
            blur: 4,
            left: 0,
            opacity: 0.1,
          },
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100]
          }
        },
        responsive: [
          {
            breakpoint: 1024,
            options: {
              chart: {
                height: 300,
              },
            },
          },
          {
            breakpoint: 1366,
            options: {
              chart: {
                height: 350,
              },
            },
          },
        ],
        stroke: {
          width: [2, 2],
          curve: 'smooth',
        },
        grid: {
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 4,
          colors: '#fff',
          strokeColors: ['#3C50E0', '#80CAEE'], // Dark blue for Income, Light blue for Expenses
          strokeWidth: 3,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          discrete: [],
          hover: {
            size: undefined,
            sizeOffset: 5,
          },
        },
        xaxis: {
          type: 'category',
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          title: {
            text: 'Amount (₹)',
            style: {
              fontSize: '12px',
            },
          },
          labels: {
            formatter: (value) => this.formatCurrency(value)
          },
          min: 0,
          forceNiceScale: true,
          tickAmount: 6,
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: (value) => this.formatCurrency(value)
          }
        }
      },
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.monthlyExpenses !== this.props.monthlyExpenses || 
        prevProps.monthlyIncome !== this.props.monthlyIncome) {
      const monthlyExpenses = Array.isArray(this.props.monthlyExpenses)
        ? this.props.monthlyExpenses.map(Number)
        : Array(12).fill(0);

      const monthlyIncome = Array.isArray(this.props.monthlyIncome)
        ? this.props.monthlyIncome.map(Number)
        : Array(12).fill(50000);

      const { totalExpenses, totalIncome } = this.calculateTotals(monthlyExpenses, monthlyIncome);

      this.setState({
        series: [
          {
            name: 'Income',
            data: monthlyIncome
          },
          {
            name: 'Expenses',
            data: monthlyExpenses
          }
        ],
        totalIncome,
        totalExpenses
      });
    }
  }

  render() {
    const { series, options, totalIncome, totalExpenses } = this.state;
    
    return (
      <div className='col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5'>
        <div className='flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap'>
          <div className='flex w-full flex-wrap gap-3 sm:gap-5'>
            <div className='flex min-w-47.5'>
              <span className='mt-1 mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-primary'>
                <span className='block h-2.5 w-2.5 rounded-full bg-primary'></span>
              </span>
              <div className='w-full'>
                <p className='font-semibold text-primary'>Monthly Income</p>
                {/* <p className='text-sm font-medium'>Variable</p> */}
                <p className='text-sm text-gray-500 break-words'>{this.formatCurrency(totalIncome)}</p>
              </div>
            </div>
            <div className='flex min-w-47.5'>
              <span className='mt-1 mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-secondary'>
                <span className='block h-2.5 w-2.5 rounded-full bg-secondary'></span>
              </span>
              <div className='w-full'>
                <p className='font-semibold text-secondary'>Monthly Expenses</p>
                {/* <p className='text-sm font-medium'>Variable</p> */}
                <p className='text-sm text-gray-500 break-words'>{this.formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4'>
          <div id='chartOne' className='-ml-5'>
            <ReactApexChart
              options={options}
              series={series}
              type='area'
              height={350}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default ChartOne;
