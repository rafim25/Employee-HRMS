import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../components';
import { EXPENSE_TYPES } from '../../../constants/expenseTypes';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { FaRegEdit, FaPlus } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      alert('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`/api/expenses/${id}`);
        setExpenses(expenses.filter(expense => expense._id !== id));
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      }
    }
  };

  const getExpenseTypeLabel = (value) => {
    const type = EXPENSE_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getExpenseTypeColor = (type) => {
    const colors = {
      'utilities': 'bg-blue-100 text-blue-600',
      'rent': 'bg-green-100 text-green-600',
      'salary': 'bg-yellow-100 text-yellow-600',
      'supplies': 'bg-red-100 text-red-600',
      'maintenance': 'bg-indigo-100 text-indigo-600',
      'marketing': 'bg-purple-100 text-purple-600',
      'insurance': 'bg-orange-100 text-orange-600',
      'other': 'bg-gray-100 text-gray-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  // Calculate expense totals by type
  const expenseTotals = expenses.reduce((acc, expense) => {
    acc[expense.expenseType] = (acc[expense.expenseType] || 0) + expense.amount;
    return acc;
  }, {});

  // Chart colors for different expense types
  const chartColors = [
    '#3C50E0', // Primary
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#6366F1', // Indigo
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#6B7280'  // Gray
  ];

  // Chart options
  const chartOptions = {
    series: [{
      name: 'Total Amount',
      data: Object.values(expenseTotals)
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: '55%',
          distributed: true
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        },
        formatter: function (val) {
          return '₹' + val.toFixed(2);
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: Object.keys(expenseTotals).map(type => getExpenseTypeLabel(type)),
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Amount (₹)',
          style: {
            color: '#64748b'
          }
        },
        labels: {
          formatter: function (val) {
            return '₹' + val.toFixed(0);
          },
          style: {
            colors: '#64748b'
          }
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "₹" + val.toFixed(2)
          }
        }
      },
      colors: chartColors,
      legend: {
        show: false
      }
    }
  };

  // Update pie chart options for better text visibility
  const pieChartOptions = {
    series: Object.values(expenseTotals),
    options: {
      chart: {
        type: 'donut',
        background: 'transparent',
        foreColor: '#fff'
      },
      labels: Object.keys(expenseTotals).map(type => getExpenseTypeLabel(type)),
      colors: chartColors,
      legend: {
        position: 'bottom',
        labels: {
          colors: '#64748b'
        },
        markers: {
          width: 8,
          height: 8,
          radius: 8
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                color: '#64748b'
              },
              total: {
                show: true,
                label: 'Total Expenses',
                fontSize: '16px',
                fontWeight: 600,
                formatter: function (w) {
                  return '₹' + w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2);
                },
                color: '#64748b'
              },
              value: {
                show: true,
                fontSize: '16px',
                fontWeight: 600,
                color: '#64748b'
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(1) + '%';
        },
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#fff']
        },
        dropShadow: {
          enabled: true,
          blur: 3,
          opacity: 0.3
        }
      },
      stroke: {
        show: false
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesFilter = filter ? expense.expenseType === filter : true;
    const matchesSearch = searchTerm
      ? expense.expenseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.comments?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto max-w-screen-2xl p-4">
        <BreadcrumbAdmin pageName='Expense Management' />

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Expense Distribution</h3>
            <div className="h-80">
              <ReactApexChart
                options={pieChartOptions.options}
                series={pieChartOptions.series}
                type="donut"
                height="100%"
              />
            </div>
          </div>
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Expense Analysis</h3>
            <div className="h-80">
              <ReactApexChart
                options={chartOptions.options}
                series={chartOptions.series}
                type="bar"
                height="100%"
              />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-4 py-6 md:px-6 xl:px-7.5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
                  />
                  <span className="absolute left-3 top-2.5 text-xl text-gray-500">
                    <BiSearch />
                  </span>
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
                >
                  <option value="">All Types</option>
                  {EXPENSE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <Link
                to="/admin/expense/add"
                className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 transition duration-200 ease-in-out"
              >
                <FaPlus className="mr-2" /> Add New Expense
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="spinner"></div>
              <p className="text-gray-500 mt-2">Loading expenses...</p>
            </div>
          ) : (
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Expense Name
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Type
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Amount
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Date
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentExpenses.map((expense) => (
                    <tr key={expense._id} className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4">
                      <td className="py-5 px-4 pl-9 xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {expense.expenseName}
                        </h5>
                        {expense.comments && (
                          <p className="text-sm text-gray-500">{expense.comments}</p>
                        )}
                      </td>
                      <td className="py-5 px-4">
                        <span className={`inline-flex rounded-full py-1 px-3 text-black dark:text-white  font-medium ${getExpenseTypeColor(expense.expenseType)}`}>
                          {getExpenseTypeLabel(expense.expenseType)}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white font-medium">
                          ₹{expense.amount.toFixed(2)}
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white">
                          {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center space-x-3.5">
                          <Link
                            to={`/admin/expense/edit/${expense._id}`}
                            className="hover:text-primary transition duration-200"
                          >
                            <FaRegEdit className="text-xl" />
                          </Link>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="hover:text-danger transition duration-200"
                          >
                            <BsTrash3 className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-wrap items-center justify-between py-4 px-4 border-t border-stroke dark:border-strokedark">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center rounded-lg border border-primary py-2 px-4 text-sm text-primary hover:bg-primary hover:text-white disabled:opacity-50 dark:border-primary dark:text-white dark:hover:bg-primary transition duration-200"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center rounded-lg py-2 px-4 text-sm font-medium transition duration-200 ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'border border-primary text-primary hover:bg-primary hover:text-white dark:border-primary dark:text-white dark:hover:bg-primary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center rounded-lg border border-primary py-2 px-4 text-sm text-primary hover:bg-primary hover:text-white disabled:opacity-50 dark:border-primary dark:text-white dark:hover:bg-primary transition duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default ExpenseList; 