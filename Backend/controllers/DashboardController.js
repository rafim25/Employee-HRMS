import User from "../models/User.js";
import Loan from "../models/Loan.js";
import Transaction from "../models/Transaction.js";
import Expense from "../models/Expense.js";
import Job from '../models/Job.js';
import Candidate from '../models/Candidate.js';
import { Op } from "sequelize";
import { Sequelize } from "sequelize";



export const getDashboardStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = Array(12).fill(0);
    const monthlyIncome = Array(12).fill(0);

    // Get users, admins, loans, transactions, and expenses in parallel
    const [users, admins, loans, transactions, expenses] = await Promise.all([
      User.findAll({
        where: {
          [Op.and]: [
            { role: "User" },
            { status: "active" }, // Added status filter
          ],
        },
      }),
      User.findAll({
        where: {
          [Op.and]: [
            { role: "Admin" },
            { status: "active" }, // Added status filter
          ],
        },
      }),
      Loan.findAll({
        where: {
          [Op.and]: [
            {
              created_at: {
                [Op.between]: [
                  new Date(currentYear, 0, 1),
                  new Date(currentYear, 11, 31, 23, 59, 59),
                ],
              },
            },
            {
              status: {
                [Op.in]: ["active", "closed"], // Added status filter
              },
            },
          ],
        },
        include: [
          {
            model: User,
            attributes: ["username", "email"],
            as: "user",
          },
        ],
      }),
      Transaction.findAll({
        where: {
          transaction_type: "credit",
          created_at: {
            [Op.between]: [
              new Date(currentYear, 0, 1),
              new Date(currentYear, 11, 31, 23, 59, 59),
            ],
          },
        },
        include: [
          {
            model: User,
            attributes: ["username", "email"],
            as: "customer",
          },
        ],
      }),
      Expense.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              new Date(currentYear, 0, 1),
              new Date(currentYear, 11, 31, 23, 59, 59),
            ],
          },
        },
      }),
    ]);

    // Calculate total loan amount
    const totalLoanAmount = loans.reduce(
      (sum, loan) => sum + Number(loan.loan_amount),
      0
    );

    // Calculate total advance amount from loans
    const totalAdvanceAmount = loans.reduce(
      (sum, loan) => sum + Number(loan.advance_amount || 0),
      0
    );

    // Calculate total credit transactions
    const totalTransactionAmount = transactions.reduce(
      (sum, trans) => sum + Number(trans.amount),
      0
    );

    // Calculate total available funds (credit transactions + advance amounts)
    const totalAvailableFunds = totalTransactionAmount + totalAdvanceAmount;

    // Calculate total expenses separately
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    // Aggregate expenses by month
    expenses.forEach((expense) => {
      const month = new Date(expense.createdAt).getMonth();
      monthlyExpenses[month] += Number(expense.amount);
    });

    // Aggregate income (advances + transactions) by month
    loans.forEach((loan) => {
      const month = new Date(loan.created_at).getMonth();
      monthlyIncome[month] += Number(loan.advance_amount || 0);
    });

    transactions.forEach((transaction) => {
      const month = new Date(transaction.created_at).getMonth();
      monthlyIncome[month] += Number(transaction.amount);
    });

    // Get recent data with correct column names and user information
    const recentLoans = await Loan.findAll({
      limit: 5,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username", "email"],
          as: "user",
        },
      ],
      attributes: [
        "loan_id",
        "customer_id",
        "customer_name",
        "loan_amount",
        "advance_amount",
        "remaining_balance",
        "status",
        "created_at",
        "updated_at",
      ],
    });

    const recentTransactions = await Transaction.findAll({
      limit: 5,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username", "email"],
          as: "customer",
        },
        {
          model: User,
          attributes: ["username"],
          as: "admin",
        },
      ],
      attributes: [
        "transaction_id",
        "loan_id",
        "customer_id",
        "admin_id",
        "amount",
        "transaction_type",
        "comments",
        "receipt",
        "receipt_url",
        "created_at",
      ],
    });

    // Format the response data
    const formattedRecentLoans = recentLoans.map((loan) => ({
      ...loan.toJSON(),
      customerName: loan.user?.username || loan.customer_name,
      customerEmail: loan.user?.email,
    }));

    const formattedRecentTransactions = recentTransactions.map(
      (transaction) => ({
        ...transaction.toJSON(),
        customerName: transaction.customer?.username || "Unknown",
        customerEmail: transaction.customer?.email,
        adminName: transaction.admin?.username,
      })
    );

    res.json({
      totalUsers: users.length,
      totalAdmins: admins.length,
      totalLoans: loans.length,
      totalTransactions: transactions.length,
      totalLoanAmount,
      totalAdvanceAmount,
      totalTransactionAmount,
      totalAvailableFunds,
      totalExpenses,
      monthlyExpenses,
      monthlyIncome,
      currentYear,
      recentLoans: formattedRecentLoans,
      recentTransactions: formattedRecentTransactions,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Get monthly statistics
export const getMonthlyStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const [monthlyLoans, monthlyTransactions] = await Promise.all([
      Loan.findAll({
        where: {
          created_at: {
            [Op.gte]: startOfMonth,
          },
        },
      }),
      Transaction.findAll({
        where: {
          created_at: {
            [Op.gte]: startOfMonth,
          },
        },
      }),
    ]);

    res.json({
      monthlyLoans: monthlyLoans.length,
      monthlyTransactions: monthlyTransactions.length,
      monthlyLoanAmount: monthlyLoans.reduce(
        (sum, loan) => sum + Number(loan.loan_amount),
        0
      ),
      monthlyTransactionAmount: monthlyTransactions.reduce(
        (sum, trans) => sum + Number(trans.amount),
        0
      ),
    });
  } catch (error) {
    console.error("Monthly Stats Error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getDashboardDataRecruitment = async (req, res) => {
    try {
        // Get active jobs count
        const activeJobs = await Job.count({
            where: { status: 'active' }
        });

        // Get candidates statistics
        const totalCandidates = await Candidate.count();
        const selectedCandidates = await Candidate.count({
            where: { application_status: 'selected' }
        });
        const rejectedCandidates = await Candidate.count({
            where: { application_status: 'rejected' }
        });

        // Get candidate status distribution
        const statusDistribution = await Candidate.count({
            group: ['application_status']
        });

        // Get source distribution
        const sourceDistribution = await Candidate.count({
            group: ['application_status']
        });

        // Get recent activities with correct association alias
        const recentActivities = await Candidate.findAll({
            attributes: [
                'uuid',
                'name',
                'application_status',
                'createdAt',
                'updatedAt'
            ],
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['title']
                }
            ],
            order: [['updatedAt', 'DESC']],
            limit: 10
        });

        // Format recent activities with correct job reference
        const formattedActivities = recentActivities.map(activity => {
            if (activity.createdAt === activity.updatedAt) {
                return {
                    type: 'new_candidate',
                    description: `New candidate ${activity.name} applied for ${activity.job?.title || 'Unknown Job'}`,
                    timestamp: activity.createdAt
                };
            } else {
                return {
                    type: 'status_change',
                    description: `${activity.name}'s status updated to ${activity.application_status}`,
                    timestamp: activity.updatedAt
                };
            }
        });

        res.json({
            activeJobs,
            totalCandidates,
            selectedCandidates,
            rejectedCandidates,
            candidateStatusData: statusDistribution.map(item => ({
                status: item.application_status,
                count: item.count
            })),
            sourceDistribution: sourceDistribution.map(item => ({
                source: item.application_status,
                count: item.count
            })),
            recentActivities: formattedActivities
        });

    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};

export const getEmployeeDashboardStats = async (req, res) => {
    try {
        // Get user details
        const user = await User.findOne({
            where: { user_id: req.session.userId },
            attributes: [
                'uuid',
                'user_id',
                'name',
                'email',
                'role',
                'department',
                'designation',
                'photo',
                'url'
            ]
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Get all jobs statistics
        // const jobStats = await Job.findAndCountAll({
        //     where: { created_by_id: req.session.userId }
        // });
        const jobStats = await Job.findAndCountAll({});

        // Get open positions count
        const openPositionsCount = await Job.count({
            where: { 
                // created_by_id: req.session.userId,
                status: 'active'
            }
        });

        // Get candidate statistics
        const candidateStats = await Candidate.findAndCountAll({
            where: { created_by_id: req.session.userId }
        });

        // Get recent activities - Update the association alias to 'job'
        const recentActivities = await Candidate.findAll({
            where: { created_by_id: req.session.userId },
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Job,
                as: 'job', // Changed from 'candidateJob' to 'job'
                attributes: ['title']
            }]
        });

        // Get open positions
        const openPositions = await Job.findAll({
            where: { 
                // created_by_id: req.session.userId,
                status: 'active'
            },
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        const response = {
            user: {
                uuid: user.uuid,
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                designation: user.designation,
                photo: user.photo,
                url: user.url
            },
            stats: {
                totalJobs: jobStats.count,
                totalCandidates: candidateStats.count,
                totalOpenPositions: openPositionsCount,
                openPositions: openPositions.length,
                activeJobs: openPositionsCount,
                pendingCandidates: await Candidate.count({
                    where: { 
                        created_by_id: req.session.userId,
                        application_status: 'applied' // Updated to use application_status
                    }
                }),
                selectedCandidates: await Candidate.count({
                    where: { 
                        created_by_id: req.session.userId,
                        application_status: 'selected' // Updated to use application_status
                    }
                }),
                rejectedCandidates: await Candidate.count({
                    where: { 
                        created_by_id: req.session.userId,
                        application_status: 'rejected' // Updated to use application_status
                    }
                })
            },
            recentActivities: recentActivities.map(activity => ({
                id: activity.id,
                candidateName: activity.name,
                jobTitle: activity.job?.title || 'N/A', // Updated to use job instead of candidateJob
                application_status: activity.application_status, // Updated to use application_status
                date: activity.createdAt
            })),
            openPositions: openPositions.map(job => ({
                id: job.id,
                title: job.title,
                type: job.type,
                status: job.status,
                openings: job.openings,
                date: job.createdAt
            })),
            candidateStats: {
                total: candidateStats.count,
                pending: await Candidate.count({
                    where: { 
                        created_by_id: req.session.userId,
                        application_status: 'applied' // Updated to use application_status
                    }
                }),
                selected: await Candidate.count({
                    where: { 
                        created_by_id: req.session.userId,
                        application_status: 'selected' // Updated to use application_status
                    }
                }),
                rejected: await Candidate.count({
                    where: { 
                        created_by_id: req.session.userId,
                        application_status: 'rejected' // Updated to use application_status
                    }
                })
            }
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ 
            msg: "Error fetching dashboard statistics", 
            error: error.message,
            session: req.session,
            sessionId: req.sessionID
        });
    }
};
