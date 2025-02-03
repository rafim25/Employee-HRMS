import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../../../context/AuthContext';

const ChartTwo = () => {
  const { state } = useAuth();
  const { totalExpenses = 0, totalAvailableFunds = 0 } = state.dashboard || {};

  const options = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
      foreColor: '#fff',
    },
    colors: ['#10B981', '#EF4444'], // Green for income, Red for expenses
    labels: ['Total Income', 'Total Expenses'],
    legend: {
      show: false,
      position: 'bottom',
      labels: {
        colors: '#fff',
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              color: '#fff',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '14px',
              color: '#fff',
              offsetY: 16,
              formatter: function (val) {
                return `₹${Number(val).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`;
              }
            },
            total: {
              show: true,
              color: '#fff',
              label: 'Total',
              formatter: function (w) {
                return `₹${w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`;
              }
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  const series = [totalAvailableFunds, totalExpenses];

  return (
    <div className='col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5'>
      <div className='mb-3 justify-between gap-4 sm:flex'>
        <div>
          <h5 className='text-xl font-semibold text-black dark:text-white'>
            Income vs Expenses
          </h5>
        </div>
      </div>

      <div className='mb-2'>
        <div id='chartTwo' className='mx-auto flex justify-center'>
          <ReactApexChart
            options={options}
            series={series}
            type='donut'
          />
        </div>
      </div>

      <div className='-mx-8 flex flex-wrap items-center justify-center gap-y-3'>
        <div className='w-full px-8 sm:w-1/2'>
          <div className='flex w-full items-center'>
            <span className='mr-2 block h-3 w-full max-w-3 rounded-full bg-success'></span>
            <p className='flex w-full justify-between text-md font-medium text-black dark:text-white'>
              <span>Total Income</span>
              <span>₹{Number(totalAvailableFunds).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</span>
            </p>
          </div>
        </div>
        <div className='w-full px-8 sm:w-1/2'>
          <div className='flex w-full items-center'>
            <span className='mr-2 block h-3 w-full max-w-3 rounded-full bg-danger'></span>
            <p className='flex w-full justify-between text-md font-medium text-black dark:text-white'>
              <span>Total Expenses</span>
              <span>₹{Number(totalExpenses).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
