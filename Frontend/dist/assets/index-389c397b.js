import {
  j as e,
  L as a,
  r,
  R as t,
  D as l,
  F as d,
  a as i,
  b as n,
  B as o,
  _ as s,
  M as c,
  c as m,
  d as p,
  e as h,
  u as b,
  k as u,
  f as x,
  g as k,
  h as f,
  N as g,
  A as y,
  i as v,
  l as w,
  m as N,
  T as C,
  n as S,
  o as j,
  p as E,
  q as R,
  s as L,
  t as A,
  v as P,
  w as M,
  x as _,
  y as D,
  z as T,
  C as F,
  E as O,
  G as z,
  H as G,
  I,
  J as $,
  K as J,
  O as U,
  P as B,
} from "./vendor-40ac43cd.js";
!(function () {
  const e = document.createElement("link").relList;
  if (!(e && e.supports && e.supports("modulepreload"))) {
    for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
      a(e);
    new MutationObserver((e) => {
      for (const r of e)
        if ("childList" === r.type)
          for (const e of r.addedNodes)
            "LINK" === e.tagName && "modulepreload" === e.rel && a(e);
    }).observe(document, { childList: !0, subtree: !0 });
  }
  function a(e) {
    if (e.ep) return;
    e.ep = !0;
    const a = (function (e) {
      const a = {};
      return (
        e.integrity && (a.integrity = e.integrity),
        e.referrerPolicy && (a.referrerPolicy = e.referrerPolicy),
        "use-credentials" === e.crossOrigin
          ? (a.credentials = "include")
          : "anonymous" === e.crossOrigin
          ? (a.credentials = "omit")
          : (a.credentials = "same-origin"),
        a
      );
    })(e);
    fetch(e.href, a);
  }
})();
const q = e.Fragment,
  H = e.jsx,
  V = e.jsxs,
  Z = (e) =>
    V("div", {
      className:
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
      children: [
        H("h2", {
          className: "text-title-md2 font-semibold text-black dark:text-white",
          children: e.pageName,
        }),
        H("nav", {
          children: V("ol", {
            className: "flex items-center gap-2",
            children: [
              H("li", {
                children: H(a, {
                  to: "/admin/dashboard",
                  children: "Dashboard /",
                }),
              }),
              H("li", { className: "text-primary", children: e.pageName }),
            ],
          }),
        }),
      ],
    }),
  W = (e) =>
    V("div", {
      className:
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
      children: [
        H("h2", {
          className: "text-title-md2 font-semibold text-black dark:text-white",
          children: e.pageName,
        }),
        H("nav", {
          children: V("ol", {
            className: "flex items-center gap-2",
            children: [
              H("li", {
                children: H(a, {
                  to: "/pegawai/dashboard",
                  children: "Dashboard /",
                }),
              }),
              H("li", { className: "text-primary", children: e.pageName }),
            ],
          }),
        }),
      ],
    }),
  Y = ({ children: e, className: a, onClick: r }) =>
    H("button", {
      className: `${a} inline-flex items-center justify-center gap-2 rounded-md bg-meta-3 py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10`,
      onClick: r,
      children: e,
    }),
  K = ({ children: e, className: a, onClick: r }) =>
    H("button", {
      className: `${a} inline-flex items-center justify-center gap-2 rounded-md bg-danger py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10`,
      onClick: r,
      children: e,
    }),
  Q = ({ children: e, className: a, onClick: r }) =>
    H("button", {
      className: `${a} inline-flex items-center justify-center gap-2 rounded-md bg-warning py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10`,
      onClick: r,
      children: e,
    }),
  X = "SET_USER",
  ee = "SET_ERROR",
  ae = "SET_DASHBOARD_STATS",
  re = "SET_USER_LIST",
  te = "SET_USER_LOADING",
  le = "SET_USER_ERROR",
  de = "DELETE_USER",
  ie = "SET_LOAN_LIST",
  ne = "SET_LOAN_LOADING",
  oe = "SET_LOAN_ERROR",
  se = "DELETE_LOAN",
  ce = { list: [], loading: !1, error: null },
  me = (e, a) => {
    const r = ((e, a) => {
        switch (a.type) {
          case X:
            return { ...e, user: a.payload, isAuthenticated: !0, error: null };
          case ae:
            return {
              ...e,
              dashboard: {
                ...e.dashboard,
                activeLoans: a.payload.activeLoans,
                totalCustomers: a.payload.totalCustomers,
                totalAdmins: a.payload.totalAdmins,
              },
            };
          case "SET_USER_COUNT":
            return { ...e, userCount: a.payload, error: null };
          case "CLEAR_USER":
            return { ...e, user: null, transactions: [], lendingDetails: {} };
          case "SET_TRANSACTIONS":
            return { ...e, transactions: a.payload };
          case "SET_LENDING_DETAILS":
            return { ...e, lendingDetails: a.payload };
          case ee:
            return { ...e, error: a.payload };
          case "CLEAR_ERROR":
            return { ...e, error: null };
          case "SET_USERS":
            return { ...e, users: a.payload };
          case "SET_ADMIN_COUNT":
            return { ...e, adminCount: a.payload };
          case "SET_LOANS":
            return { ...e, loans: a.payload };
          default:
            return e;
        }
      })(e, a),
      t = ((e, a) => {
        switch (a.type) {
          case "CREATE_USER":
            return {
              ...e,
              users: [...e.users, a.payload],
              loading: !1,
              error: null,
            };
          case re:
            return { ...e, users: a.payload, loading: !1, error: null };
          case te:
            return { ...e, loading: a.payload };
          case le:
            return { ...e, error: a.payload, loading: !1 };
          case de:
            return {
              ...e,
              users: e.users.filter((e) => e.user_id !== a.payload),
              loading: !1,
            };
          case "UPDATE_USER":
            return {
              ...e,
              users: e.users.map((e) =>
                e.user_id === a.payload.user_id ? a.payload : e
              ),
              loading: !1,
            };
          default:
            return e;
        }
      })(r, a),
      l = ((e, a) => {
        var r, t, l, d, i;
        switch (a.type) {
          case ne:
            return { ...e, loans: { ...(e.loans || ce), loading: a.payload } };
          case ie:
            return {
              ...e,
              loans: {
                ...(e.loans || ce),
                list: a.payload.map((e) => ({
                  ...e,
                  loan_amount: parseFloat(e.loan_amount),
                  remaining_balance: parseFloat(e.remaining_balance),
                  interest_amount: 0.01 * parseFloat(e.loan_amount),
                })),
                loading: !1,
                error: null,
              },
            };
          case oe:
            return {
              ...e,
              loans: { ...(e.loans || ce), error: a.payload, loading: !1 },
            };
          case "CREATE_LOAN":
            return {
              ...e,
              loans: {
                ...(e.loans || ce),
                list: [
                  ...((null == (r = e.loans) ? void 0 : r.list) || []),
                  a.payload,
                ],
                loading: !1,
                error: null,
              },
            };
          case "UPDATE_LOAN":
            return {
              ...e,
              loans: {
                ...(e.loans || ce),
                list:
                  (null == (l = null == (t = e.loans) ? void 0 : t.list)
                    ? void 0
                    : l.map((e) =>
                        e.loan_id === a.payload.loan_id ? a.payload : e
                      )) || [],
                loading: !1,
                error: null,
              },
            };
          case se:
            return {
              ...e,
              loans: {
                ...(e.loans || ce),
                list:
                  (null == (i = null == (d = e.loans) ? void 0 : d.list)
                    ? void 0
                    : i.filter((e) => e.loan_id !== a.payload)) || [],
                loading: !1,
                error: null,
              },
            };
          default:
            return e;
        }
      })(t, a);
    return l;
  },
  pe = {
    dashboard: { activeLoans: 0, totalCustomers: 0, totalAdmins: 0 },
    user: {
      id_employee: null,
      name_employee: "",
      username: "",
      access_rights: "",
    },
    transactions: [],
    users: [],
    admins: [],
    loans: [],
    lendingDetails: {},
    error: null,
    loading: !1,
    loans: { list: [], loading: !1, error: null },
  },
  he = r.createContext(),
  be = ({ children: e }) => {
    const [a, d] = r.useReducer(me, pe),
      i = t.useMemo(() => ({ state: a, dispatch: d }), [a]);
    return V(he.Provider, {
      value: i,
      children: [
        H(l, {
          position: "top-right",
          toastOptions: {
            duration: 3e3,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
              padding: "16px",
            },
            success: { style: { background: "#28a745" } },
            error: { style: { background: "#dc3545" }, duration: 4e3 },
          },
        }),
        e,
      ],
    });
  },
  ue = () => {
    const e = r.useContext(he);
    if (!e) throw new Error("useAuth must be used within an AuthProvider");
    return e;
  },
  xe = () => {
    const { state: e } = ue(),
      { totalCustomers: a = 0 } = e.dashboard || {};
    return V("div", {
      className:
        "rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark",
      children: [
        H("div", {
          className:
            "flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4",
          children: H(d, { className: "fill-primary dark:fill-white text-xl" }),
        }),
        H("div", {
          className: "mt-4 flex items-end justify-between",
          children: V("div", {
            children: [
              H("h4", {
                className: "text-title-md font-bold text-black dark:text-white",
                children: a,
              }),
              H("span", {
                className: "text-sm font-medium",
                children: "Total Customers",
              }),
            ],
          }),
        }),
      ],
    });
  },
  ke = () => {
    const { state: e } = ue(),
      { totalAdmins: a = 0 } = e.dashboard || {};
    return V("div", {
      className:
        "rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark",
      children: [
        H("div", {
          className:
            "flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4",
          children: H(i, { className: "fill-primary dark:fill-white text-xl" }),
        }),
        H("div", {
          className: "mt-4 flex items-end justify-between",
          children: V("div", {
            children: [
              H("h4", {
                className: "text-title-md font-bold text-black dark:text-white",
                children: a,
              }),
              H("span", {
                className: "text-sm font-medium",
                children: "Admin",
              }),
            ],
          }),
        }),
      ],
    });
  },
  fe = () => {
    const { state: e } = ue(),
      { activeLoans: a = 0 } = e.dashboard || {};
    return (
      console.log("state.dashboard", e),
      V("div", {
        className:
          "rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark",
        children: [
          H("div", {
            className:
              "flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4",
            children: H(n, {
              className: "fill-primary dark:fill-white text-xl",
            }),
          }),
          H("div", {
            className: "mt-4 flex items-end justify-between",
            children: V("div", {
              children: [
                H("h4", {
                  className:
                    "text-title-md font-bold text-black dark:text-white",
                  children: a,
                }),
                H("span", {
                  className: "text-sm font-medium",
                  children: "Total Active Loans",
                }),
              ],
            }),
          }),
        ],
      })
    );
  },
  ge = () =>
    V("div", {
      className:
        "rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark",
      children: [
        H("div", {
          className:
            "flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4",
          children: H(o, { className: "fill-primary dark:fill-white text-xl" }),
        }),
        H("div", {
          className: "mt-4 flex items-end justify-between",
          children: V("div", {
            children: [
              V("h4", {
                className: "text-title-md font-bold text-black dark:text-white",
                children: ["₹", Number(87788700).toLocaleString("en-IN")],
              }),
              H("span", {
                className: "text-sm font-medium",
                children: "Total Fund Available",
              }),
            ],
          }),
        }),
      ],
    });
class ye extends r.Component {
  constructor(e) {
    super(e),
      (this.state = {
        series: [
          {
            name: "Male",
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
          },
          {
            name: "Female",
            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
          },
        ],
        options: {
          legend: { show: !1, position: "top", horizontalAlign: "left" },
          colors: ["#3C50E0", "#80CAEE"],
          chart: {
            fontFamily: "Satoshi, sans-serif",
            height: 335,
            type: "area",
            dropShadow: {
              enabled: !0,
              color: "#623CEA14",
              top: 10,
              blur: 4,
              left: 0,
              opacity: 0.1,
            },
            toolbar: { show: !1 },
          },
          responsive: [
            { breakpoint: 1024, options: { chart: { height: 300 } } },
            { breakpoint: 1366, options: { chart: { height: 350 } } },
          ],
          stroke: { width: [2, 2], curve: "straight" },
          labels: { show: !1, position: "top" },
          grid: {
            xaxis: { lines: { show: !0 } },
            yaxis: { lines: { show: !0 } },
          },
          dataLabels: { enabled: !1 },
          markers: {
            size: 4,
            colors: "#fff",
            strokeColors: ["#3056D3", "#80CAEE"],
            strokeWidth: 3,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            hover: { size: void 0, sizeOffset: 5 },
          },
          xaxis: {
            type: "category",
            categories: [
              "Sep",
              "Oct",
              "Nov",
              "Dec",
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
            ],
            axisBorder: { show: !1 },
            axisTicks: { show: !1 },
          },
          yaxis: { title: { style: { fontSize: "0px" } }, min: 0, max: 100 },
        },
      });
  }
  render() {
    return V("div", {
      className:
        "col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8",
      children: [
        V("div", {
          className:
            "flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap",
          children: [
            V("div", {
              className: "flex w-full flex-wrap gap-3 sm:gap-5",
              children: [
                V("div", {
                  className: "flex min-w-47.5",
                  children: [
                    H("span", {
                      className:
                        "mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary",
                      children: H("span", {
                        className:
                          "block h-2.5 w-full max-w-2.5 rounded-full bg-primary",
                      }),
                    }),
                    V("div", {
                      className: "w-full",
                      children: [
                        H("p", {
                          className: "font-semibold text-primary",
                          children: "Data Total Credited",
                        }),
                        H("p", {
                          className: "text-sm font-medium",
                          children: "14.04.2023 - 14.05.2023",
                        }),
                      ],
                    }),
                  ],
                }),
                V("div", {
                  className: "flex min-w-47.5",
                  children: [
                    H("span", {
                      className:
                        "mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary",
                      children: H("span", {
                        className:
                          "block h-2.5 w-full max-w-2.5 rounded-full bg-secondary",
                      }),
                    }),
                    V("div", {
                      className: "w-full",
                      children: [
                        H("p", {
                          className: "font-semibold text-secondary",
                          children: "Data Total Debit",
                        }),
                        H("p", {
                          className: "text-sm font-medium",
                          children: "14.04.2023 - 14.05.2023",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            H("div", {
              className: "flex w-full max-w-45 justify-end",
              children: V("div", {
                className:
                  "inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4",
                children: [
                  H("button", {
                    className:
                      "rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark",
                    children: "Day",
                  }),
                  H("button", {
                    className:
                      "rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark",
                    children: "Week",
                  }),
                  H("button", {
                    className:
                      "rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark",
                    children: "Month",
                  }),
                ],
              }),
            }),
          ],
        }),
        H("div", {
          children: H("div", {
            id: "chartOne",
            className: "-ml-5",
            children: H(s, {
              options: this.state.options,
              series: this.state.series,
              type: "area",
              height: 350,
            }),
          }),
        }),
      ],
    });
  }
}
class ve extends r.Component {
  constructor(e) {
    super(e),
      (this.state = {
        series: [6, 4],
        options: {
          chart: { fontFamily: "Satoshi, sans-serif", type: "donut" },
          colors: ["#3C50E0", "#0FADCF"],
          labels: ["Permanent Employee", "Contract Employee"],
          legend: { show: !1, position: "bottom" },
          plotOptions: {
            pie: { donut: { size: "65%", background: "transparent" } },
          },
          dataLabels: { enabled: !1 },
          responsive: [
            { breakpoint: 2600, options: { chart: { width: 380 } } },
            { breakpoint: 640, options: { chart: { width: 200 } } },
          ],
        },
      });
  }
  render() {
    return V("div", {
      className:
        "col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5",
      children: [
        V("div", {
          className: "mb-3 justify-between gap-4 sm:flex",
          children: [
            H("div", {
              children: H("h5", {
                className: "text-xl font-semibold text-black dark:text-white",
                children: "Customer Status",
              }),
            }),
            H("div", {
              children: V("div", {
                className: "relative z-20 inline-block",
                children: [
                  V("select", {
                    name: "",
                    id: "",
                    className:
                      "relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none",
                    children: [
                      H("option", { value: "", children: "Monthly" }),
                      H("option", { value: "", children: "Yearly" }),
                    ],
                  }),
                  H("span", {
                    className: "absolute top-1/2 right-3 z-10 -translate-y-1/2",
                    children: V("svg", {
                      width: "10",
                      height: "6",
                      viewBox: "0 0 10 6",
                      fill: "none",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: [
                        H("path", {
                          d: "M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z",
                          fill: "#637381",
                        }),
                        H("path", {
                          fillRule: "evenodd",
                          clipRule: "evenodd",
                          d: "M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z",
                          fill: "#637381",
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            }),
          ],
        }),
        H("div", {
          className: "mb-2",
          children: H("div", {
            id: "chartTwo",
            className: "mx-auto flex justify-center",
            children: H(s, {
              options: this.state.options,
              series: this.state.series,
              type: "donut",
            }),
          }),
        }),
        V("div", {
          className: "-mx-8 flex flex-wrap items-center justify-center gap-y-3",
          children: [
            H("div", {
              className: "w-full px-8 sm:w-1/2",
              children: V("div", {
                className: "flex w-full items-center",
                children: [
                  H("span", {
                    className:
                      "mr-2 block h-3 w-full max-w-3 rounded-full bg-primary",
                  }),
                  V("p", {
                    className:
                      "flex w-full justify-between text-sm font-medium text-black dark:text-white",
                    children: [
                      H("span", { children: " Active Customer " }),
                      H("span", { children: " 6 " }),
                    ],
                  }),
                ],
              }),
            }),
            H("div", {
              className: "w-full px-8 sm:w-1/2",
              children: V("div", {
                className: "flex w-full items-center",
                children: [
                  H("span", {
                    className:
                      "mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]",
                  }),
                  V("p", {
                    className:
                      "flex w-full justify-between text-sm font-medium text-black dark:text-white",
                    children: [
                      H("span", { children: " New Customer " }),
                      H("span", { children: " 4 " }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
      ],
    });
  }
}
const we = () => {
    const [e, a] = ((e, a) => {
      const [t, l] = r.useState(() => {
        try {
          const r = window.localStorage.getItem(e);
          return r ? JSON.parse(r) : a;
        } catch (r) {
          return console.log(r), a;
        }
      });
      return (
        r.useEffect(() => {
          try {
            const a = "function" == typeof t ? t(t) : t;
            window.localStorage.setItem(e, JSON.stringify(a));
          } catch (a) {
            console.log(a);
          }
        }, [e, t]),
        [t, l]
      );
    })("color-theme", "light");
    return (
      r.useEffect(() => {
        const a = "dark",
          r = window.document.body.classList;
        "dark" === e ? r.add(a) : r.remove(a);
      }, [e]),
      [e, a]
    );
  },
  Ne = () => {
    const [e, a] = we();
    return H("li", {
      children: V("label", {
        className:
          "relative m-0 block h-7.5 w-14 rounded-full " +
          ("dark" === e ? "bg-primary" : "bg-stroke"),
        children: [
          H("input", {
            type: "checkbox",
            onChange: () => a("light" === e ? "dark" : "light"),
            className:
              "absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0 dur",
          }),
          V("span", {
            className: `absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
              "dark" === e && "!right-[3px] !translate-x-full"
            }`,
            children: [
              H("span", {
                className: "dark:hidden",
                children: V("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 16 16",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: [
                    H("path", {
                      d: "M7.99992 12.6666C10.5772 12.6666 12.6666 10.5772 12.6666 7.99992C12.6666 5.42259 10.5772 3.33325 7.99992 3.33325C5.42259 3.33325 3.33325 5.42259 3.33325 7.99992C3.33325 10.5772 5.42259 12.6666 7.99992 12.6666Z",
                      fill: "#969AA1",
                    }),
                    H("path", {
                      d: "M8.00008 15.3067C7.63341 15.3067 7.33342 15.0334 7.33342 14.6667V14.6134C7.33342 14.2467 7.63341 13.9467 8.00008 13.9467C8.36675 13.9467 8.66675 14.2467 8.66675 14.6134C8.66675 14.9801 8.36675 15.3067 8.00008 15.3067ZM12.7601 13.4267C12.5867 13.4267 12.4201 13.3601 12.2867 13.2334L12.2001 13.1467C11.9401 12.8867 11.9401 12.4667 12.2001 12.2067C12.4601 11.9467 12.8801 11.9467 13.1401 12.2067L13.2267 12.2934C13.4867 12.5534 13.4867 12.9734 13.2267 13.2334C13.1001 13.3601 12.9334 13.4267 12.7601 13.4267ZM3.24008 13.4267C3.06675 13.4267 2.90008 13.3601 2.76675 13.2334C2.50675 12.9734 2.50675 12.5534 2.76675 12.2934L2.85342 12.2067C3.11342 11.9467 3.53341 11.9467 3.79341 12.2067C4.05341 12.4667 4.05341 12.8867 3.79341 13.1467L3.70675 13.2334C3.58008 13.3601 3.40675 13.4267 3.24008 13.4267ZM14.6667 8.66675H14.6134C14.2467 8.66675 13.9467 8.36675 13.9467 8.00008C13.9467 7.63341 14.2467 7.33342 14.6134 7.33342C14.9801 7.33342 15.3067 7.63341 15.3067 8.00008C15.3067 8.36675 15.0334 8.66675 14.6667 8.66675ZM1.38675 8.66675H1.33341C0.966748 8.66675 0.666748 8.36675 0.666748 8.00008C0.666748 7.63341 0.966748 7.33342 1.33341 7.33342C1.70008 7.33342 2.02675 7.63341 2.02675 8.00008C2.02675 8.36675 1.75341 8.66675 1.38675 8.66675ZM12.6734 3.99341C12.5001 3.99341 12.3334 3.92675 12.2001 3.80008C11.9401 3.54008 11.9401 3.12008 12.2001 2.86008L12.2867 2.77341C12.5467 2.51341 12.9667 2.51341 13.2267 2.77341C13.4867 3.03341 13.4867 3.45341 13.2267 3.71341L13.1401 3.80008C13.0134 3.92675 12.8467 3.99341 12.6734 3.99341ZM3.32675 3.99341C3.15341 3.99341 2.98675 3.92675 2.85342 3.80008L2.76675 3.70675C2.50675 3.44675 2.50675 3.02675 2.76675 2.76675C3.02675 2.50675 3.44675 2.50675 3.70675 2.76675L3.79341 2.85342C4.05341 3.11342 4.05341 3.53341 3.79341 3.79341C3.66675 3.92675 3.49341 3.99341 3.32675 3.99341ZM8.00008 2.02675C7.63341 2.02675 7.33342 1.75341 7.33342 1.38675V1.33341C7.33342 0.966748 7.63341 0.666748 8.00008 0.666748C8.36675 0.666748 8.66675 0.966748 8.66675 1.33341C8.66675 1.70008 8.36675 2.02675 8.00008 2.02675Z",
                      fill: "#969AA1",
                    }),
                  ],
                }),
              }),
              H("span", {
                className: "hidden dark:inline-block",
                children: H("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 16 16",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: H("path", {
                    d: "M14.3533 10.62C14.2466 10.44 13.9466 10.16 13.1999 10.2933C12.7866 10.3667 12.3666 10.4 11.9466 10.38C10.3933 10.3133 8.98659 9.6 8.00659 8.5C7.13993 7.53333 6.60659 6.27333 6.59993 4.91333C6.59993 4.15333 6.74659 3.42 7.04659 2.72666C7.33993 2.05333 7.13326 1.7 6.98659 1.55333C6.83326 1.4 6.47326 1.18666 5.76659 1.48C3.03993 2.62666 1.35326 5.36 1.55326 8.28666C1.75326 11.04 3.68659 13.3933 6.24659 14.28C6.85993 14.4933 7.50659 14.62 8.17326 14.6467C8.27993 14.6533 8.38659 14.66 8.49326 14.66C10.7266 14.66 12.8199 13.6067 14.1399 11.8133C14.5866 11.1933 14.4666 10.8 14.3533 10.62Z",
                    fill: "#969AA1",
                  }),
                }),
              }),
            ],
          }),
        ],
      }),
    });
  },
  Ce = () => {
    const [e, t] = r.useState(!1),
      l = r.useRef(null),
      d = r.useRef(null);
    return (
      r.useEffect(() => {
        const a = ({ target: a }) => {
          d.current &&
            (!e || d.current.contains(a) || l.current.contains(a) || t(!1));
        };
        return (
          document.addEventListener("click", a),
          () => document.removeEventListener("click", a)
        );
      }),
      r.useEffect(() => {
        const a = ({ keyCode: a }) => {
          e && 27 === a && t(!1);
        };
        return (
          document.addEventListener("keydown", a),
          () => document.removeEventListener("keydown", a)
        );
      }),
      V("div", {
        className: "relative",
        children: [
          V(a, {
            ref: l,
            onClick: () => t(!e),
            className: "flex items-center gap-4",
            to: "#",
            children: [
              V("span", {
                className: "hidden text-right lg:block",
                children: [
                  H("span", {
                    className:
                      "block text-sm font-medium text-black dark:text-white",
                    children: "Admin",
                  }),
                  H("span", {
                    className: "block text-xs",
                    children: "Admin HSC",
                  }),
                ],
              }),
              H("span", {
                className: "h-12 w-12 rounded-full",
                children: H("img", {
                  src: "/assets/admin-b11bcf85.svg",
                  alt: "Admin",
                }),
              }),
              H(c, { className: "text-xl" }),
            ],
          }),
          H("div", {
            ref: d,
            onFocus: () => t(!0),
            onBlur: () => t(!1),
            className:
              "absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark " +
              (!0 === e ? "block" : "hidden"),
            children: V("ul", {
              className:
                "flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark",
              children: [
                H("li", {
                  children: V(a, {
                    to: "/admin/pengaturan/ubah-password",
                    className:
                      "flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base",
                    children: [H(m, { className: "text-xl" }), "Settings"],
                  }),
                }),
                H("li", {}),
                H("li", {
                  children: V(a, {
                    to: "/",
                    className:
                      "flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base",
                    children: [H(p, { className: "text-xl" }), "Log Out"],
                  }),
                }),
              ],
            }),
          }),
        ],
      })
    );
  },
  Se = () => {
    const [e, t] = r.useState(!1),
      l = r.useRef(null),
      d = r.useRef(null);
    return (
      r.useEffect(() => {
        const a = ({ target: a }) => {
          d.current &&
            (!e || d.current.contains(a) || l.current.contains(a) || t(!1));
        };
        return (
          document.addEventListener("click", a),
          () => document.removeEventListener("click", a)
        );
      }),
      r.useEffect(() => {
        const a = ({ keyCode: a }) => {
          e && 27 === a && t(!1);
        };
        return (
          document.addEventListener("keydown", a),
          () => document.removeEventListener("keydown", a)
        );
      }),
      V("li", {
        className: "relative",
        children: [
          V(a, {
            ref: l,
            onClick: () => t(!e),
            to: "#",
            className:
              "relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white",
            children: [
              H("span", {
                className:
                  "absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1",
                children: H("span", {
                  className:
                    "absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75",
                }),
              }),
              H("svg", {
                className: "fill-current duration-300 ease-in-out",
                width: "18",
                height: "18",
                viewBox: "0 0 18 18",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: H("path", {
                  d: "M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z",
                  fill: "",
                }),
              }),
            ],
          }),
          V("div", {
            ref: d,
            onFocus: () => t(!0),
            onBlur: () => t(!1),
            className:
              "absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 " +
              (!0 === e ? "block" : "hidden"),
            children: [
              H("div", {
                className: "px-4.5 py-3",
                children: H("h5", {
                  className: "text-sm font-medium text-bodydark2",
                  children: "Notification",
                }),
              }),
              V("ul", {
                className: "flex h-auto flex-col overflow-y-auto",
                children: [
                  H("li", {
                    children: V(a, {
                      className:
                        "flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4",
                      to: "#",
                      children: [
                        V("p", {
                          className: "text-sm",
                          children: [
                            H("span", {
                              className: "text-black dark:text-white",
                              children: "Edit your information in a swipe",
                            }),
                            " ",
                            "Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
                          ],
                        }),
                        H("p", {
                          className: "text-xs",
                          children: "12 May, 2025",
                        }),
                      ],
                    }),
                  }),
                  H("li", {
                    children: V(a, {
                      className:
                        "flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4",
                      to: "#",
                      children: [
                        V("p", {
                          className: "text-sm",
                          children: [
                            H("span", {
                              className: "text-black dark:text-white",
                              children: "It is a long established fact",
                            }),
                            " ",
                            "that a reader will be distracted by the readable.",
                          ],
                        }),
                        H("p", {
                          className: "text-xs",
                          children: "24 Feb, 2025",
                        }),
                      ],
                    }),
                  }),
                  H("li", {
                    children: V(a, {
                      className:
                        "flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4",
                      to: "#",
                      children: [
                        V("p", {
                          className: "text-sm",
                          children: [
                            H("span", {
                              className: "text-black dark:text-white",
                              children: "There are many variations",
                            }),
                            " ",
                            "of passages of Lorem Ipsum available, but the majority have suffered",
                          ],
                        }),
                        H("p", {
                          className: "text-xs",
                          children: "04 Jan, 2025",
                        }),
                      ],
                    }),
                  }),
                  H("li", {
                    children: V(a, {
                      className:
                        "flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4",
                      to: "#",
                      children: [
                        V("p", {
                          className: "text-sm",
                          children: [
                            H("span", {
                              className: "text-black dark:text-white",
                              children: "There are many variations",
                            }),
                            " ",
                            "of passages of Lorem Ipsum available, but the majority have suffered",
                          ],
                        }),
                        H("p", {
                          className: "text-xs",
                          children: "01 Dec, 2024",
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  },
  je = "/assets/gilbert-71cf4a61.png",
  Ee = () => {
    const [e, t] = r.useState(!1),
      l = r.useRef(null),
      d = r.useRef(null);
    return (
      r.useEffect(() => {
        const a = ({ target: a }) => {
          d.current &&
            (!e || d.current.contains(a) || l.current.contains(a) || t(!1));
        };
        return (
          document.addEventListener("click", a),
          () => document.removeEventListener("click", a)
        );
      }),
      r.useEffect(() => {
        const a = ({ keyCode: a }) => {
          e && 27 === a && t(!1);
        };
        return (
          document.addEventListener("keydown", a),
          () => document.removeEventListener("keydown", a)
        );
      }),
      V("div", {
        className: "relative",
        children: [
          V(a, {
            ref: l,
            onClick: () => t(!e),
            className: "flex items-center gap-4",
            to: "#",
            children: [
              V("span", {
                className: "hidden text-right lg:block",
                children: [
                  H("span", {
                    className:
                      "block text-sm font-medium text-black dark:text-white",
                    children: "Gilbert Hutapea",
                  }),
                  H("span", {
                    className: "block text-xs",
                    children: "Employee",
                  }),
                ],
              }),
              H("span", {
                className: "h-12 w-12",
                children: H("img", {
                  className: "rounded-full",
                  src: je,
                  alt: "Employee",
                }),
              }),
              H(c, { className: "text-xl" }),
            ],
          }),
          H("div", {
            ref: d,
            onFocus: () => t(!0),
            onBlur: () => t(!1),
            className:
              "absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark " +
              (!0 === e ? "block" : "hidden"),
            children: V("ul", {
              className:
                "flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark",
              children: [
                H("li", {
                  children: V(a, {
                    to: "/pegawai/pengaturan/ubah-password",
                    className:
                      "flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base",
                    children: [H(m, { className: "text-xl" }), "Settings"],
                  }),
                }),
                H("li", {}),
                H("li", {
                  children: V(a, {
                    to: "/pegawai/login",
                    className:
                      "flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base",
                    children: [H(p, { className: "text-xl" }), "Log Out"],
                  }),
                }),
              ],
            }),
          }),
        ],
      })
    );
  },
  Re = () =>
    H("div", {
      children: V("footer", {
        className:
          "text-sm text-center px-10 py-6 text-base-100 border-base-300 bg-neutral ",
        children: [
          H("div", { className: "w-full h-[2px] bg-gray-600" }),
          H("div", {
            className:
              "flex flex-col md:flex-row items-center justify-center text-accent",
            children: H("p", {
              children: "© Copyright 2024, All Rights Reserved",
            }),
          }),
        ],
      }),
    }),
  Le = ({ children: e }) => {
    const [a, t] = r.useState(!1);
    return H("div", {
      className: "dark:bg-boxdark-2 dark:text-bodydark",
      children: V("div", {
        className: "flex h-screen overflow-hidden",
        children: [
          H(ea, { sidebarOpen: a, setSidebarOpen: t }),
          V("div", {
            className:
              "relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden",
            children: [
              H(Ye, { sidebarOpen: a, setSidebarOpen: t }),
              H("main", {
                children: H("div", {
                  className: "mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10",
                  children: e,
                }),
              }),
              H(Re, {}),
            ],
          }),
        ],
      }),
    });
  },
  Ae = h.create({
    baseURL: "http://172.105.59.206",
    headers: { "Content-Type": "application/json" },
    withCredentials: !0,
  }),
  Pe = (e, a = {}) => Ae.get(e, a),
  Me = (e, a, r = {}) => Ae.post(e, a, r),
  _e = (e, a = {}) => Ae.delete(e, a),
  De = "/api/v2/login",
  Te = "/api/users",
  Fe = (e) => `/api/users/${e}`,
  Oe = "/api/users",
  ze = (e) => `/api/users/${e}`,
  Ge = "/api/dashboard/stats",
  Ie = "/api/loans",
  $e = "/api/loans",
  Je = (e) => `/api/loans/${e}`,
  Ue = (e) => `/api/loans/${e}`,
  Be = (e) => `/api/loan-transactions/${e}`,
  qe = "/api/transactions",
  He = () => {
    const e = b();
    ue();
    const [t, l] = r.useState([]);
    r.useState(!1);
    const [d, i] = r.useState({
      loan_id: n(),
      customer_id: "",
      customer_name: "",
      loan_amount: "",
      remaining_balance: "",
      status: "active",
    });
    function n() {
      return `LN${Date.now().toString().slice(-6)}${Math.floor(
        1e3 * Math.random()
      )
        .toString()
        .padStart(3, "0")}`;
    }
    r.useEffect(() => {
      (async () => {
        try {
          const e = await Pe(Te);
          l(e.data);
        } catch (e) {
          u.error("Failed to fetch customers"),
            console.error("Error fetching customers:", e);
        }
      })();
    }, []);
    return V(Le, {
      children: [
        H(Z, { pageName: "Create New Loan" }),
        H("div", {
          className: "sm:grid-cols-2",
          children: H("div", {
            className: "flex flex-col gap-9",
            children: V("div", {
              className:
                "rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
              children: [
                H("div", {
                  className:
                    "border-b border-stroke py-4 px-6.5 dark:border-strokedark",
                  children: H("h3", {
                    className: "font-medium text-black dark:text-white",
                    children: "Loan Details",
                  }),
                }),
                H("form", {
                  onSubmit: async (a) => {
                    var r, t;
                    a.preventDefault();
                    const l = u.loading("Creating loan...");
                    try {
                      const a = {
                        ...d,
                        remaining_balance: d.loan_amount,
                        status: "active",
                      };
                      await Me($e, a);
                      u.success("Loan created successfully", { id: l }),
                        e("/admin/master-data/data-jabatan");
                    } catch (i) {
                      u.error(
                        (null ==
                        (t = null == (r = i.response) ? void 0 : r.data)
                          ? void 0
                          : t.message) || "Failed to create loan",
                        { id: l }
                      );
                    }
                  },
                  children: V("div", {
                    className: "p-6.5",
                    children: [
                      V("div", {
                        className: "mb-4.5",
                        children: [
                          H("label", {
                            className:
                              "mb-2.5 block text-black dark:text-white",
                            children: "Loan ID",
                          }),
                          H("input", {
                            type: "text",
                            value: d.loan_id,
                            className:
                              "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                            disabled: !0,
                          }),
                        ],
                      }),
                      V("div", {
                        className: "mb-4.5 flex flex-col gap-6 xl:flex-row",
                        children: [
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Customer Name ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("select", {
                                value: d.customer_name,
                                onChange: (e) => {
                                  const a = t.find(
                                    (a) => a.username === e.target.value
                                  );
                                  a &&
                                    i({
                                      ...d,
                                      customer_id: a.user_id,
                                      customer_name: a.username,
                                    });
                                },
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                required: !0,
                                children: [
                                  H("option", {
                                    value: "",
                                    children: "Select Customer",
                                  }),
                                  t.map((e) =>
                                    H(
                                      "option",
                                      {
                                        value: e.username,
                                        children: e.username,
                                      },
                                      e.user_id
                                    )
                                  ),
                                ],
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              H("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: "Customer ID",
                              }),
                              H("input", {
                                type: "text",
                                value: d.customer_id,
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                disabled: !0,
                              }),
                            ],
                          }),
                        ],
                      }),
                      V("div", {
                        className: "mb-4.5",
                        children: [
                          V("label", {
                            className:
                              "mb-2.5 block text-black dark:text-white",
                            children: [
                              "Loan Amount ",
                              H("span", {
                                className: "text-meta-1",
                                children: "*",
                              }),
                            ],
                          }),
                          H("input", {
                            type: "number",
                            placeholder: "Enter loan amount",
                            value: d.loan_amount,
                            onChange: (e) =>
                              i({ ...d, loan_amount: e.target.value }),
                            className:
                              "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                            required: !0,
                          }),
                        ],
                      }),
                      V("div", {
                        className:
                          "flex flex-col md:flex-row w-full gap-3 text-center",
                        children: [
                          H(Y, {
                            type: "submit",
                            children: H("span", { children: "Save" }),
                          }),
                          H(K, {
                            type: "button",
                            onClick: () => {
                              i({
                                loan_id: n(),
                                customer_id: "",
                                customer_name: "",
                                loan_amount: "",
                                remaining_balance: "",
                                status: "active",
                              });
                            },
                            children: H("span", { children: "Reset" }),
                          }),
                          H(a, {
                            to: "/admin/master-data/data-jabatan",
                            children: H(Q, {
                              children: H("span", { children: "Cancel" }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      ],
    });
  },
  Ve = () => {
    const e = b();
    ue();
    const [t, l] = r.useState(!1),
      [d, i] = r.useState(""),
      [n, o] = r.useState({
        user_id: s(),
        username: "",
        email: "",
        password: "",
        gender: "",
        role: "",
        date_joined: "",
        mobile_number: "",
        address: "",
        status: "",
        photo: null,
        permissions: "",
      });
    function s() {
      return `USR${Date.now().toString().slice(-6)}${Math.floor(
        1e3 * Math.random()
      )
        .toString()
        .padStart(3, "0")}`;
    }
    const c = (e) => {
      const { name: a, value: r, type: t, files: l } = e.target;
      o((e) => ({ ...e, [a]: "file" === t ? l[0] : r }));
    };
    return V(Le, {
      children: [
        H(Z, { pageName: "User Form" }),
        H("div", {
          className: "sm:grid-cols-2",
          children: H("div", {
            className: "flex flex-col gap-9",
            children: V("div", {
              className:
                "rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
              children: [
                H("div", {
                  className:
                    "border-b border-stroke py-4 px-6.5 dark:border-strokedark",
                  children: H("h3", {
                    className: "font-medium text-black dark:text-white",
                    children: "User Data Form",
                  }),
                }),
                d &&
                  H("div", {
                    className:
                      "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4",
                    children: d,
                  }),
                H("form", {
                  onSubmit: async (a) => {
                    var r, t, d, o;
                    a.preventDefault(), l(!0), i("");
                    const s = u.loading("Creating user...");
                    try {
                      const a = new FormData();
                      Object.keys(n).forEach((e) => {
                        "photo" === e && n[e]
                          ? a.append("photo", n[e])
                          : a.append(e, n[e]);
                      });
                      (
                        await Me(Oe, a, {
                          headers: { "Content-Type": "multipart/form-data" },
                        })
                      ).data &&
                        (u.success("User created successfully!", { id: s }),
                        e("/admin/master-data/data-pegawai"));
                    } catch (c) {
                      u.error(
                        (null ==
                        (t = null == (r = c.response) ? void 0 : r.data)
                          ? void 0
                          : t.msg) || "Failed to create user",
                        { id: s }
                      ),
                        i(
                          (null ==
                          (o = null == (d = c.response) ? void 0 : d.data)
                            ? void 0
                            : o.msg) || "Failed to create user"
                        );
                    } finally {
                      l(!1);
                    }
                  },
                  children: V("div", {
                    className: "p-6.5",
                    children: [
                      V("div", {
                        className: "mb-4.5 flex flex-col gap-6 xl:flex-row",
                        children: [
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "User ID ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "text",
                                name: "user_id",
                                value: n.user_id,
                                readOnly: !0,
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 font-medium outline-none",
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Username ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "text",
                                name: "username",
                                value: n.username,
                                onChange: c,
                                required: !0,
                                placeholder: "Enter username",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                            ],
                          }),
                        ],
                      }),
                      V("div", {
                        className: "mb-4.5 flex flex-col gap-6 xl:flex-row",
                        children: [
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Email ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "email",
                                name: "email",
                                value: n.email,
                                onChange: c,
                                required: !0,
                                placeholder: "Enter email",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Password ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "password",
                                name: "password",
                                value: n.password,
                                onChange: c,
                                required: !0,
                                placeholder: "Enter password",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                            ],
                          }),
                        ],
                      }),
                      V("div", {
                        className: "mb-4.5 flex flex-col gap-6 xl:flex-row",
                        children: [
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Gender ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("div", {
                                className:
                                  "relative z-20 bg-transparent dark:bg-form-input",
                                children: [
                                  V("select", {
                                    name: "gender",
                                    value: n.gender,
                                    onChange: c,
                                    required: !0,
                                    className:
                                      "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                    children: [
                                      H("option", {
                                        value: "",
                                        children: "Select Gender",
                                      }),
                                      H("option", {
                                        value: "Male",
                                        children: "Male",
                                      }),
                                      H("option", {
                                        value: "Female",
                                        children: "Female",
                                      }),
                                    ],
                                  }),
                                  H("span", {
                                    className:
                                      "absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl",
                                    children: H(x, {}),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Role ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("div", {
                                className:
                                  "relative z-20 bg-transparent dark:bg-form-input",
                                children: [
                                  V("select", {
                                    name: "role",
                                    value: n.role,
                                    onChange: c,
                                    required: !0,
                                    className:
                                      "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                    children: [
                                      H("option", {
                                        value: "",
                                        children: "Select Role",
                                      }),
                                      H("option", {
                                        value: "Admin",
                                        children: "Admin",
                                      }),
                                      H("option", {
                                        value: "User",
                                        children: "User",
                                      }),
                                    ],
                                  }),
                                  H("span", {
                                    className:
                                      "absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl",
                                    children: H(x, {}),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      V("div", {
                        className: "mb-4.5 flex flex-col gap-6 xl:flex-row",
                        children: [
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Mobile Number ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "tel",
                                name: "mobile_number",
                                value: n.mobile_number,
                                onChange: c,
                                required: !0,
                                placeholder: "Enter mobile number",
                                pattern: "[0-9]{10}",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Address ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "text",
                                name: "address",
                                value: n.address,
                                onChange: c,
                                required: !0,
                                placeholder: "Enter address",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                            ],
                          }),
                        ],
                      }),
                      V("div", {
                        className: "mb-4.5 flex flex-col gap-6 xl:flex-row",
                        children: [
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              H("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: "Photo",
                              }),
                              H("input", {
                                type: "file",
                                name: "photo",
                                onChange: c,
                                accept: "image/*",
                                className:
                                  "w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full xl:w-1/2",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Permissions ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("div", {
                                className:
                                  "relative z-20 bg-transparent dark:bg-form-input",
                                children: [
                                  V("select", {
                                    name: "permissions",
                                    value: n.permissions,
                                    onChange: c,
                                    required: !0,
                                    className:
                                      "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                    children: [
                                      H("option", {
                                        value: "",
                                        children: "Select Permissions",
                                      }),
                                      H("option", {
                                        value: "Full",
                                        children: "Full Access",
                                      }),
                                      H("option", {
                                        value: "Limited",
                                        children: "Limited Access",
                                      }),
                                      H("option", {
                                        value: "Read",
                                        children: "Read Only",
                                      }),
                                    ],
                                  }),
                                  H("span", {
                                    className:
                                      "absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl",
                                    children: H(x, {}),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      V("div", {
                        className:
                          "flex flex-col md:flex-row w-full gap-3 text-center mt-7.5",
                        children: [
                          H("button", {
                            type: "submit",
                            disabled: t,
                            className:
                              "inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10",
                            children: t ? "Saving..." : "Save",
                          }),
                          H("button", {
                            type: "button",
                            onClick: () =>
                              o({
                                user_id: s(),
                                username: "",
                                email: "",
                                password: "",
                                gender: "",
                                role: "",
                                date_joined: "",
                                mobile_number: "",
                                address: "",
                                status: "",
                                photo: null,
                                permissions: "",
                              }),
                            className:
                              "inline-flex items-center justify-center gap-2.5 rounded-md bg-warning py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10",
                            children: "Reset",
                          }),
                          H(a, {
                            to: "/admin/master-data/data-pegawai",
                            className:
                              "inline-flex items-center justify-center gap-2.5 rounded-md bg-danger py-2.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10",
                            children: "Cancel",
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      ],
    });
  },
  Ze = () =>
    V(Le, {
      children: [
        H(Z, { pageName: "Form Setting Salary Deduction " }),
        H("div", {
          className: "sm:grid-cols-2",
          children: H("div", {
            className: "flex flex-col gap-9",
            children: V("div", {
              className:
                "rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
              children: [
                H("div", {
                  className:
                    "border-b border-stroke py-4 px-6.5 dark:border-strokedark",
                  children: H("h3", {
                    className: "font-medium text-black dark:text-white",
                    children: "Form Setting Salary Deduction",
                  }),
                }),
                H("form", {
                  action: "#",
                  children: V("div", {
                    className: "p-6.5",
                    children: [
                      V("div", {
                        className: "mb-4.5 ",
                        children: [
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-4 block text-black dark:text-white",
                                children: [
                                  "Salary ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "text",
                                placeholder: "Masukkan potongan",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-4 block text-black dark:text-white",
                                children: [
                                  "Attendance ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "number",
                                placeholder: "Masukkan jumlah potongan",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                            ],
                          }),
                        ],
                      }),
                      V("div", {
                        className:
                          "flex flex-col md:flex-row w-full gap-3 text-center",
                        children: [
                          H(a, {
                            to: "",
                            children: H(Y, {
                              children: H("span", { children: "Simpan" }),
                            }),
                          }),
                          H(a, {
                            to: "/admin/transaksi/setting-potongan-gaji/form-setting-potongan-gaji",
                            children: H(K, {
                              children: H("span", { children: "Reset" }),
                            }),
                          }),
                          H(a, {
                            to: "/admin/transaksi/setting-potongan-gaji",
                            children: H(Q, {
                              children: H("span", { children: "Kembali" }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      ],
    }),
  We = "/assets/logo-icon-da89fc50.svg",
  Ye = (e) =>
    H("header", {
      className:
        "sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none",
      children: V("div", {
        className:
          "flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11",
        children: [
          V("div", {
            className: "flex items-center gap-2 sm:gap-4 lg:hidden",
            children: [
              H("button", {
                "aria-controls": "sidebar",
                "aria-expanded": e.sidebarOpen,
                onClick: (a) => {
                  a.stopPropagation(), e.setSidebarOpen(!e.sidebarOpen);
                },
                className:
                  "z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden",
                children: V("span", {
                  className: "relative block h-5.5 w-5.5 cursor-pointer",
                  children: [
                    V("span", {
                      className: "du-block absolute right-0 h-full w-full",
                      children: [
                        H("span", {
                          className: `relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                            !e.sidebarOpen && "!w-full delay-300"
                          }`,
                        }),
                        H("span", {
                          className: `relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                            !e.sidebarOpen && "delay-400 !w-full"
                          }`,
                        }),
                        H("span", {
                          className: `relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                            !e.sidebarOpen && "!w-full delay-500"
                          }`,
                        }),
                      ],
                    }),
                    V("span", {
                      className: "absolute right-0 h-full w-full rotate-45",
                      children: [
                        H("span", {
                          className: `absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                            !e.sidebarOpen && "!h-0 !delay-[0]"
                          }`,
                        }),
                        H("span", {
                          className: `delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                            !e.sidebarOpen && "!h-0 !delay-200"
                          }`,
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              H(a, {
                className: "block flex-shrink-0 lg:hidden",
                to: "/admin/dashboard",
                children: H("img", { src: We, alt: "Snipe Tech Pvt Ltd" }),
              }),
            ],
          }),
          H("div", {
            className: "hidden sm:block",
            children: H("form", {
              action: "https://formbold.com/s/unique_form_id",
              method: "POST",
              children: V("div", {
                className: "relative",
                children: [
                  H("button", {
                    className: "absolute top-1/2 left-0 -translate-y-1/2",
                    children: H(k, {
                      className:
                        "fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary text-xl",
                    }),
                  }),
                  H("input", {
                    type: "text",
                    placeholder: "Type to search...",
                    className:
                      "w-full bg-transparent pr-4 pl-9 focus:outline-none",
                  }),
                ],
              }),
            }),
          }),
          V("div", {
            className: "flex items-center gap-3 2xsm:gap-7",
            children: [
              V("ul", {
                className: "flex items-center gap-2 2xsm:gap-4",
                children: [H(Ne, {}), H(Se, {})],
              }),
              H(Ce, {}),
            ],
          }),
        ],
      }),
    }),
  Ke = (e) =>
    H("header", {
      className:
        "sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none",
      children: V("div", {
        className:
          "flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11",
        children: [
          V("div", {
            className: "flex items-center gap-2 sm:gap-4 lg:hidden",
            children: [
              H("button", {
                "aria-controls": "sidebar",
                "aria-expanded": e.sidebarOpen,
                onClick: (a) => {
                  a.stopPropagation(), e.setSidebarOpen(!e.sidebarOpen);
                },
                className:
                  "z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden",
                children: V("span", {
                  className: "relative block h-5.5 w-5.5 cursor-pointer",
                  children: [
                    V("span", {
                      className: "du-block absolute right-0 h-full w-full",
                      children: [
                        H("span", {
                          className: `relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                            !e.sidebarOpen && "!w-full delay-300"
                          }`,
                        }),
                        H("span", {
                          className: `relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                            !e.sidebarOpen && "delay-400 !w-full"
                          }`,
                        }),
                        H("span", {
                          className: `relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                            !e.sidebarOpen && "!w-full delay-500"
                          }`,
                        }),
                      ],
                    }),
                    V("span", {
                      className: "absolute right-0 h-full w-full rotate-45",
                      children: [
                        H("span", {
                          className: `absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                            !e.sidebarOpen && "!h-0 !delay-[0]"
                          }`,
                        }),
                        H("span", {
                          className: `delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                            !e.sidebarOpen && "!h-0 !delay-200"
                          }`,
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              H(a, {
                className: "block flex-shrink-0 lg:hidden",
                to: "/pegawai/dashboard",
                children: H("img", { src: We, alt: "Snipe Tech Pvt Ltd" }),
              }),
            ],
          }),
          H("div", {
            className: "hidden sm:block",
            children: H("form", {
              action: "https://formbold.com/s/unique_form_id",
              method: "POST",
              children: V("div", {
                className: "relative",
                children: [
                  H("button", {
                    className: "absolute top-1/2 left-0 -translate-y-1/2",
                    children: H(k, {
                      className:
                        "fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary text-xl",
                    }),
                  }),
                  H("input", {
                    type: "text",
                    placeholder: "Type to search...",
                    className:
                      "w-full bg-transparent pr-4 pl-9 focus:outline-none",
                  }),
                ],
              }),
            }),
          }),
          V("div", {
            className: "flex items-center gap-3 2xsm:gap-7",
            children: [
              V("ul", {
                className: "flex items-center gap-2 2xsm:gap-4",
                children: [H(Ne, {}), H(Se, {})],
              }),
              H(Ee, {}),
            ],
          }),
        ],
      }),
    }),
  Qe = ({ children: e, activeCondition: a }) => {
    const [t, l] = r.useState(a);
    return H("li", {
      children: e(() => {
        l(!t);
      }, t),
    });
  },
  Xe = "/assets/logo-dark-935a5fe2.png",
  ea = ({ sidebarOpen: e, setSidebarOpen: a }) => {
    const l = f(),
      { pathname: d } = l,
      i = r.useRef(null),
      n = r.useRef(null),
      o = localStorage.getItem("sidebar-expanded"),
      [s, p] = r.useState(null !== o && "true" === o);
    return (
      r.useEffect(() => {
        const r = ({ target: r }) => {
          n.current &&
            i.current &&
            (!e || n.current.contains(r) || i.current.contains(r) || a(!1));
        };
        return (
          document.addEventListener("click", r),
          () => document.removeEventListener("click", r)
        );
      }),
      r.useEffect(() => {
        const r = ({ keyCode: r }) => {
          e && 27 === r && a(!1);
        };
        return (
          document.addEventListener("keydown", r),
          () => document.removeEventListener("keydown", r)
        );
      }),
      r.useEffect(() => {
        localStorage.setItem("sidebar-expanded", s),
          s
            ? document.querySelector("body").classList.add("sidebar-expanded")
            : document
                .querySelector("body")
                .classList.remove("sidebar-expanded");
      }, [s]),
      V("aside", {
        ref: n,
        className:
          "absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 " +
          (e ? "translate-x-0" : "-translate-x-full"),
        children: [
          V("div", {
            className:
              "flex items-center justify-center px-6 py-5.5 lg:py-6.5 object-cover",
            children: [
              H(g, {
                to: "/admin/dashboard",
                children: H("img", { src: Xe, alt: "Logo" }),
              }),
              H("button", {
                ref: i,
                onClick: () => a(!e),
                "aria-controls": "sidebar",
                "aria-expanded": e,
                className: "block lg:hidden",
                children: H(y, { className: "text-xl" }),
              }),
            ],
          }),
          H("div", {
            className:
              "no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear",
            children: H("nav", {
              className: "mt-4 px-4 lg:mt-9 lg:px-6",
              children: H("div", {
                children: V("ul", {
                  className: "mb-6 flex flex-col gap-1.5",
                  children: [
                    V(g, {
                      to: "/admin/dashboard",
                      className: `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        d.includes("dashboard") && "bg-graydark dark:bg-meta-4"
                      }`,
                      children: [H(v, {}), "Dashboard"],
                    }),
                    H(Qe, {
                      activeCondition:
                        "/masterdata" === d || d.includes("masterdata"),
                      children: (e, a) =>
                        V(t.Fragment, {
                          children: [
                            V(g, {
                              to: "#",
                              className: `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                ("/masterdata" === d ||
                                  d.includes("masterdata")) &&
                                "bg-graydark dark:bg-meta-4"
                              }`,
                              onClick: (a) => {
                                a.preventDefault(), s ? e() : p(!0);
                              },
                              children: [
                                H(w, {}),
                                "Customer Data",
                                H(c, {
                                  className: `absolute right-4 top-1/2 -translate-y-1/2 fill-current text-2xl ${
                                    a && "rotate-180"
                                  }`,
                                }),
                              ],
                            }),
                            H("div", {
                              className: `translate transform overflow-hidden ${
                                !a && "hidden"
                              }`,
                              children: V("ul", {
                                className:
                                  "mt-4 mb-5.5 flex flex-col gap-2.5 pl-6",
                                children: [
                                  H("li", {
                                    children: H(g, {
                                      to: "/admin/master-data/data-pegawai",
                                      className: ({ isActive: e }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (e && "!text-white"),
                                      children: "Customer Details",
                                    }),
                                  }),
                                  H("li", {
                                    children: H(g, {
                                      to: "/admin/master-data/data-jabatan",
                                      className: ({ isActive: e }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (e && "!text-white"),
                                      children: "Loan Details",
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          ],
                        }),
                    }),
                    H(Qe, {
                      activeCondition:
                        "/pengaturan" === d || d.includes("pengaturan"),
                      children: (e, a) =>
                        V(t.Fragment, {
                          children: [
                            V(g, {
                              to: "#",
                              className: `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                ("/pengaturan" === d ||
                                  d.includes("pengaturan")) &&
                                "bg-graydark dark:bg-meta-4"
                              }`,
                              onClick: (a) => {
                                a.preventDefault(), s ? e() : p(!0);
                              },
                              children: [
                                H(m, {}),
                                "Settings",
                                H(c, {
                                  className: `absolute right-4 top-1/2 -translate-y-1/2 fill-current text-2xl ${
                                    a && "rotate-180"
                                  }`,
                                }),
                              ],
                            }),
                            H("div", {
                              className: `translate transform overflow-hidden ${
                                !a && "hidden"
                              }`,
                              children: V("ul", {
                                className:
                                  "mt-4 mb-5.5 flex flex-col gap-2.5 pl-6",
                                children: [
                                  H("li", {
                                    children: H(g, {
                                      to: "/admin/pengaturan/ubah-password",
                                      className: ({ isActive: e }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (e && "!text-white"),
                                      children: "Change Password",
                                    }),
                                  }),
                                  H("li", {
                                    children: H(g, {
                                      to: "/",
                                      className: ({ isActive: e }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (e && "!text-white"),
                                      children: "Log Out",
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          ],
                        }),
                    }),
                  ],
                }),
              }),
            }),
          }),
        ],
      })
    );
  },
  aa = ({ sidebarOpen: e, setSidebarOpen: a }) => {
    const l = f(),
      { pathname: d } = l,
      i = r.useRef(null),
      n = r.useRef(null),
      o = localStorage.getItem("sidebar-expanded"),
      [s, p] = r.useState(null !== o && "true" === o);
    return (
      r.useEffect(() => {
        const r = ({ target: r }) => {
          n.current &&
            i.current &&
            (!e || n.current.contains(r) || i.current.contains(r) || a(!1));
        };
        return (
          document.addEventListener("click", r),
          () => document.removeEventListener("click", r)
        );
      }),
      r.useEffect(() => {
        const r = ({ keyCode: r }) => {
          e && 27 === r && a(!1);
        };
        return (
          document.addEventListener("keydown", r),
          () => document.removeEventListener("keydown", r)
        );
      }),
      r.useEffect(() => {
        localStorage.setItem("sidebar-expanded", s),
          s
            ? document.querySelector("body").classList.add("sidebar-expanded")
            : document
                .querySelector("body")
                .classList.remove("sidebar-expanded");
      }, [s]),
      V("aside", {
        ref: n,
        className:
          "absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 " +
          (e ? "translate-x-0" : "-translate-x-full"),
        children: [
          V("div", {
            className:
              "flex items-center justify-center px-6 py-5.5 lg:py-6.5 object-cover",
            children: [
              H(g, {
                to: "/pegawai/dashboard",
                children: H("img", { src: Xe, alt: "Logo" }),
              }),
              H("button", {
                ref: i,
                onClick: () => a(!e),
                "aria-controls": "sidebar",
                "aria-expanded": e,
                className: "block lg:hidden",
                children: H(y, { className: "text-xl" }),
              }),
            ],
          }),
          H("div", {
            className:
              "no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear",
            children: H("nav", {
              className: "mt-4 px-4 lg:mt-9 lg:px-6",
              children: H("div", {
                children: V("ul", {
                  className: "mb-6 flex flex-col gap-1.5",
                  children: [
                    V(g, {
                      to: "/pegawai/dashboard",
                      className: `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        d.includes("dashboard") && "bg-graydark dark:bg-meta-4"
                      }`,
                      children: [H(v, {}), "Dashboard"],
                    }),
                    H("li", {
                      children: V(g, {
                        to: "/pegawai/data-gaji",
                        className: `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          d.includes("datagaji") && "bg-graydark dark:bg-meta-4"
                        }`,
                        children: [H(N, {}), "Salary Data"],
                      }),
                    }),
                    H(Qe, {
                      activeCondition:
                        "/pengaturan" === d || d.includes("pengaturan"),
                      children: (e, a) =>
                        V(t.Fragment, {
                          children: [
                            V(g, {
                              to: "#",
                              className: `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                ("/pengaturan" === d ||
                                  d.includes("pengaturan")) &&
                                "bg-graydark dark:bg-meta-4"
                              }`,
                              onClick: (a) => {
                                a.preventDefault(), s ? e() : p(!0);
                              },
                              children: [
                                H(m, {}),
                                "Settings",
                                H(c, {
                                  className: `absolute right-4 top-1/2 -translate-y-1/2 fill-current text-2xl ${
                                    a && "rotate-180"
                                  }`,
                                }),
                              ],
                            }),
                            H("div", {
                              className: `translate transform overflow-hidden ${
                                !a && "hidden"
                              }`,
                              children: V("ul", {
                                className:
                                  "mt-4 mb-5.5 flex flex-col gap-2.5 pl-6",
                                children: [
                                  H("li", {
                                    children: H(g, {
                                      to: "/pegawai/pengaturan/ubah-password",
                                      className: ({ isActive: e }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (e && "!text-white"),
                                      children: "Change Password",
                                    }),
                                  }),
                                  H("li", {
                                    children: H(g, {
                                      to: "/pegawai/login",
                                      className: ({ isActive: e }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (e && "!text-white"),
                                      children: "Log Out",
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          ],
                        }),
                    }),
                  ],
                }),
              }),
            }),
          }),
        ],
      })
    );
  },
  ra = () =>
    H("div", {
      className: "flex h-screen items-center justify-center p-4",
      children: V("div", {
        className: "text-center",
        children: [
          H("h1", {
            className: "mb-4 text-4xl font-bold text-primary dark:text-white",
            children: "404 Error",
          }),
          H("h2", {
            className: "mb-8 text-xl font-semibold text-black dark:text-white",
            children: "Sorry, this page is not available!",
          }),
          H(a, { to: "/", children: H(Y, { children: "Back to Home" }) }),
        ],
      }),
    }),
  ta = () => {
    const { dispatch: e } = ue(),
      a = r.useCallback(() => {
        (async (e) => {
          try {
            const a = await Pe(Ge),
              { totalUsers: r, totalAdmins: t, totalLoans: l } = a.data;
            e({
              type: ae,
              payload: { activeLoans: l, totalCustomers: r, totalAdmins: t },
            });
          } catch (a) {
            console.error("Error fetching dashboard stats:", a),
              e({ type: ee, payload: "Failed to fetch dashboard statistics" });
          }
        })(e);
      }, [e]);
    return (
      r.useEffect(() => {
        a();
        const e = setInterval(a, 3e5);
        return () => clearInterval(e);
      }, [a]),
      V(Le, {
        children: [
          H(Z, { pageName: "Dashboard" }),
          V("div", {
            className:
              "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5",
            children: [H(xe, {}), H(ke, {}), H(fe, {}), H(ge, {})],
          }),
          V("div", {
            className:
              "mt-4 grid grid-cols-12 gap-6 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5",
            children: [
              H("div", {
                className: "col-span-12 sm:col-span-7",
                children: H(ye, {}),
              }),
              H("div", {
                className: "col-span-12 sm:col-span-5",
                children: H(ve, {}),
              }),
            ],
          }),
        ],
      })
    );
  },
  la = () =>
    V(Le, {
      children: [
        H(Z, { pageName: "Employee Attendance Report " }),
        H("div", {
          className: "sm:grid-cols-2",
          children: H("div", {
            className: "flex flex-col gap-9",
            children: V("div", {
              className:
                "rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
              children: [
                H("div", {
                  className:
                    "border-b border-stroke py-4 px-6.5 dark:border-strokedark",
                  children: H("h3", {
                    className: "font-medium text-black dark:text-white",
                    children: "Employee Attendance Report  Filter",
                  }),
                }),
                H("form", {
                  action: "#",
                  children: V("div", {
                    className: "p-6.5",
                    children: [
                      V("div", {
                        className: "mb-4.5 ",
                        children: [
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Month ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("div", {
                                className:
                                  "relative z-20 bg-transparent dark:bg-form-input",
                                children: [
                                  V("select", {
                                    className:
                                      "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                    children: [
                                      H("option", {
                                        value: "",
                                        children: "Select Month",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "January",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "February",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "March",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "April",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "May",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "June",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "July",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "August",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "September",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "October",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "November",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "December",
                                      }),
                                    ],
                                  }),
                                  H("span", {
                                    className:
                                      "absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl",
                                    children: H(x, {}),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Year ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("div", {
                                className:
                                  "relative z-20 bg-transparent dark:bg-form-input",
                                children: [
                                  V("select", {
                                    className:
                                      "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                    children: [
                                      H("option", {
                                        value: "",
                                        children: "Select Year",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2020",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2021",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2022",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2023",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2024",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2025",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2026",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2027",
                                      }),
                                    ],
                                  }),
                                  H("span", {
                                    className:
                                      "absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl",
                                    children: H(x, {}),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      H("div", {
                        className:
                          "flex flex-col md:flex-row w-full gap-3 text-center",
                        children: H(a, {
                          to: "",
                          children: V(Y, {
                            children: [
                              H("span", {
                                children: "Print Attendance Report",
                              }),
                              H("span", { children: H(C, {}) }),
                            ],
                          }),
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      ],
    }),
  da = () =>
    V(Le, {
      children: [
        H(Z, { pageName: "Employee Salary Report" }),
        H("div", {
          className: "sm:grid-cols-2",
          children: H("div", {
            className: "flex flex-col gap-9",
            children: V("div", {
              className:
                "rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
              children: [
                H("div", {
                  className:
                    "border-b border-stroke py-4 px-6.5 dark:border-strokedark",
                  children: H("h3", {
                    className: "font-medium text-black dark:text-white",
                    children: "Filter Employee Salary Report",
                  }),
                }),
                H("form", {
                  action: "#",
                  children: V("div", {
                    className: "p-6.5",
                    children: [
                      V("div", {
                        className: "mb-4.5 ",
                        children: [
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Month ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("div", {
                                className:
                                  "relative z-20 bg-transparent dark:bg-form-input",
                                children: [
                                  V("select", {
                                    className:
                                      "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                    children: [
                                      H("option", {
                                        value: "",
                                        children: "Select Month",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "January",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "February",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "March",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "April",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "May",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "June",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "July",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "August",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "September",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "October",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "November",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "December",
                                      }),
                                    ],
                                  }),
                                  H("span", {
                                    className:
                                      "absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl",
                                    children: H(x, {}),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Year ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("div", {
                                className:
                                  "relative z-20 bg-transparent dark:bg-form-input",
                                children: [
                                  V("select", {
                                    className:
                                      "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                    children: [
                                      H("option", {
                                        value: "",
                                        children: "Select Year",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2020",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2021",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2022",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2023",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2024",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2025",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2026",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2027",
                                      }),
                                    ],
                                  }),
                                  H("span", {
                                    className:
                                      "absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl",
                                    children: H(x, {}),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      H("div", {
                        className:
                          "flex flex-col md:flex-row w-full gap-3 text-center",
                        children: H(a, {
                          to: "",
                          children: V(Y, {
                            children: [
                              H("span", { children: "Print Salary Report " }),
                              H("span", { children: H(C, {}) }),
                            ],
                          }),
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      ],
    }),
  ia = () =>
    V(Le, {
      children: [
        H(Z, { pageName: "Employee  Salary Slip" }),
        H("div", {
          className: "sm:grid-cols-2",
          children: H("div", {
            className: "flex flex-col gap-9",
            children: V("div", {
              className:
                "rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
              children: [
                H("div", {
                  className:
                    "border-b border-stroke py-4 px-6.5 dark:border-strokedark",
                  children: H("h3", {
                    className: "font-medium text-black dark:text-white",
                    children: "Filter Smployee  Salary Slip",
                  }),
                }),
                H("form", {
                  action: "#",
                  children: V("div", {
                    className: "p-6.5",
                    children: [
                      V("div", {
                        className: "mb-4.5 ",
                        children: [
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Month ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("div", {
                                className:
                                  "relative z-20 bg-transparent dark:bg-form-input",
                                children: [
                                  V("select", {
                                    className:
                                      "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                    children: [
                                      H("option", {
                                        value: "",
                                        children: "Select Month",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "January",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "February",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "March",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "April",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "May",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "June",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "July",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "August",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "September",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "October",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "November",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "December",
                                      }),
                                    ],
                                  }),
                                  H("span", {
                                    className:
                                      "absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl",
                                    children: H(x, {}),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Year ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("div", {
                                className:
                                  "relative z-20 bg-transparent dark:bg-form-input",
                                children: [
                                  V("select", {
                                    className:
                                      "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                    children: [
                                      H("option", {
                                        value: "",
                                        children: "Select Year",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2020",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2021",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2022",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2023",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2024",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2025",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2026",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "2027",
                                      }),
                                    ],
                                  }),
                                  H("span", {
                                    className:
                                      "absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl",
                                    children: H(x, {}),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-2.5 block text-black dark:text-white",
                                children: [
                                  "Employee Name ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              V("div", {
                                className:
                                  "relative z-20 bg-transparent dark:bg-form-input",
                                children: [
                                  V("select", {
                                    className:
                                      "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                                    children: [
                                      H("option", {
                                        value: "",
                                        children: "Select Employee",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "Gilbert Hutapea",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "Aldi Ramdani",
                                      }),
                                      H("option", {
                                        value: "",
                                        children: "Dadang Darsono",
                                      }),
                                    ],
                                  }),
                                  H("span", {
                                    className:
                                      "absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl",
                                    children: H(x, {}),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      H("div", {
                        className:
                          "flex flex-col md:flex-row w-full gap-3 text-center",
                        children: H(a, {
                          to: "",
                          children: V(Y, {
                            children: [
                              H("span", { children: "Print Salary Slip " }),
                              H("span", { children: H(C, {}) }),
                            ],
                          }),
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      ],
    }),
  na = [
    {
      name: "Rajesh Sharma",
      profession: "Business Owner",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      message:
        "Investing in RaghavElite's commercial plot was the best business decision I made. Their transparent process and prime location selection helped me establish my new showroom.",
    },
    {
      name: "Dr. Priya Patel",
      profession: "Medical Professional",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      message:
        "As a busy doctor, I wanted a hassle-free property investment. Their team guided me through every step, from plot selection to documentation. Now I own a beautiful piece of land for my future clinic.",
    },
    {
      name: "Amit Verma",
      profession: "IT Professional",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      message:
        "The gated community plots offered by RaghavElite are perfect for tech professionals like me. Excellent infrastructure, security, and future appreciation potential made it an easy choice.",
    },
    {
      name: "Meera Reddy",
      profession: "School Principal",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      message:
        "After years of teaching, I wanted to invest in property. Their educational institution plots with proper zoning and amenities were exactly what I was looking for my dream school project.",
    },
    {
      name: "Suresh Kumar",
      profession: "Restaurant Chain Owner",
      image: "https://randomuser.me/api/portraits/men/36.jpg",
      message:
        "Expanding my restaurant chain was made easier with RaghavElite's commercial plots. Strategic locations and excellent connectivity have helped boost my business significantly.",
    },
    {
      name: "Anita Desai",
      profession: "Software Company CEO",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      message:
        "The tech park plots are strategically located and perfect for our new development center. The infrastructure and amenities are exactly what we needed for our growing team.",
    },
    {
      name: "Vikram Malhotra",
      profession: "Hotel Chain Owner",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      message:
        "RaghavElite helped us find the perfect location for our new resort. Their understanding of hospitality sector requirements made the whole process seamless.",
    },
    {
      name: "Dr. Sanjay Gupta",
      profession: "Hospital Director",
      image: "https://randomuser.me/api/portraits/men/47.jpg",
      message:
        "We acquired a prime plot for our new multi-specialty hospital through RaghavElite. Their expertise in healthcare property requirements was impressive.",
    },
  ],
  oa = ({ name: e, profession: a, image: r, message: t }) =>
    V("div", {
      className:
        "bg-white dark:bg-boxdark p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 mx-2",
      children: [
        V("div", {
          className: "flex items-center mb-4",
          children: [
            H("img", {
              src: r,
              alt: e,
              className:
                "w-16 h-16 rounded-full mr-4 object-cover border-2 border-primary",
            }),
            V("div", {
              children: [
                H("h3", {
                  className: "font-semibold text-lg text-black dark:text-white",
                  children: e,
                }),
                H("p", {
                  className: "text-gray-600 dark:text-gray-400 text-sm",
                  children: a,
                }),
              ],
            }),
          ],
        }),
        V("div", {
          className: "relative",
          children: [
            H("svg", {
              className:
                "absolute top-0 left-0 transform -translate-x-3 -translate-y-3 h-8 w-8 text-primary opacity-20",
              fill: "currentColor",
              viewBox: "0 0 32 32",
              children: H("path", {
                d: "M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z",
              }),
            }),
            H("p", {
              className: "text-gray-700 dark:text-gray-300 italic pl-4",
              children: t,
            }),
          ],
        }),
      ],
    }),
  sa = () => {
    const [e, a] = r.useState(0),
      t = 1,
      l = 2,
      d = 3,
      i = () =>
        window.innerWidth < 768 ? t : window.innerWidth < 1024 ? l : d,
      [n, o] = r.useState(i());
    r.useEffect(() => {
      const e = () => {
        o(i());
      };
      return (
        window.addEventListener("resize", e),
        () => window.removeEventListener("resize", e)
      );
    }, []);
    const s = () => {
      a((e) => (e + 1) % na.length);
    };
    return (
      r.useEffect(() => {
        const e = setInterval(s, 5e3);
        return () => clearInterval(e);
      }, [e]),
      H("div", {
        className: "py-12 bg-gray-50 dark:bg-boxdark-2",
        children: V("div", {
          className: "max-w-7xl mx-auto px-4",
          children: [
            H("h2", {
              className:
                "text-3xl font-bold text-center mb-12 text-black dark:text-white",
              children: "What Our Valued Customers Say",
            }),
            V("div", {
              className: "relative",
              children: [
                H("button", {
                  onClick: () => {
                    a((e) => (e - 1 + na.length) % na.length);
                  },
                  className:
                    "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 \n            bg-white dark:bg-boxdark p-2 rounded-full shadow-lg \n            hover:bg-gray-100 dark:hover:bg-boxdark-2 transition-all duration-300\n            md:-translate-x-6",
                  children: H(S, { className: "text-2xl text-primary" }),
                }),
                H("button", {
                  onClick: s,
                  className:
                    "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 \n            bg-white dark:bg-boxdark p-2 rounded-full shadow-lg \n            hover:bg-gray-100 dark:hover:bg-boxdark-2 transition-all duration-300\n            md:translate-x-6",
                  children: H(j, { className: "text-2xl text-primary" }),
                }),
                H("div", {
                  className: "overflow-hidden",
                  children: H("div", {
                    className:
                      "flex transition-transform duration-500 ease-in-out",
                    style: { transform: `translateX(-${(100 * e) / n}%)` },
                    children: na.map((e, a) =>
                      H(
                        "div",
                        {
                          className: `flex-shrink-0 ${
                            1 === n ? "w-full" : 2 === n ? "w-1/2" : "w-1/3"
                          } px-2`,
                          children: H(oa, { ...e }),
                        },
                        `${e.name}-${a}`
                      )
                    ),
                  }),
                }),
                H("div", {
                  className: "flex justify-center mt-8 space-x-2",
                  children: na
                    .slice(0, na.length - n + 1)
                    .map((r, t) =>
                      H(
                        "button",
                        {
                          onClick: () => a(t),
                          className:
                            "w-2 h-2 rounded-full transition-all duration-300 " +
                            (t === e
                              ? "w-6 bg-primary"
                              : "bg-gray-300 dark:bg-gray-600"),
                        },
                        t
                      )
                    ),
                }),
              ],
            }),
          ],
        }),
      })
    );
  },
  ca = ({ onLoginClick: e }) => {
    const [t, l] = r.useState(!1);
    return V(q, {
      children: [
        H("nav", {
          className:
            "bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-boxdark dark:to-boxdark shadow-sm border-b border-blue-100/50",
          children: V("div", {
            className: "container mx-auto px-4",
            children: [
              V("div", {
                className: "flex justify-between items-center h-20",
                children: [
                  H("div", {
                    className: "flex-shrink-0 flex items-center",
                    children: V(a, {
                      to: "/",
                      className: "flex items-center space-x-3",
                      children: [
                        H("span", {
                          className:
                            "font-serif text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-primary transition-all duration-300",
                          children: "Raghav",
                        }),
                        H("span", {
                          className:
                            "font-serif text-3xl font-light text-gray-700 dark:text-gray-200",
                          children: "Elite",
                        }),
                        H("span", {
                          className:
                            "font-serif text-3xl font-bold text-primary dark:text-gray-200 group-hover:text-blue-600 transition-colors duration-300",
                          children: "Projects",
                        }),
                      ],
                    }),
                  }),
                  V("div", {
                    className: "hidden md:flex space-x-4",
                    children: [
                      [
                        { href: "#projects", label: "Upcoming Projects" },
                        { href: "#gallery", label: "Gallery" },
                        { href: "#completed", label: "Completed Projects" },
                        { href: "#why-us", label: "Why Choose Us" },
                        { href: "#contact", label: "Contact Us" },
                      ].map((e) =>
                        H(ma, { href: e.href, children: e.label }, e.href)
                      ),
                      V("button", {
                        onClick: e,
                        className:
                          "px-6 py-2.5 text-base font-medium text-white bg-primary hover:bg-blue-600 \n                rounded-lg transition-all duration-300 flex items-center space-x-2.5 \n                hover:shadow-lg hover:shadow-blue-500/30 tracking-wide",
                        children: [
                          H("svg", {
                            className: "w-5 h-5",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: H("path", {
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 2,
                              d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
                            }),
                          }),
                          H("span", { children: "Login" }),
                        ],
                      }),
                    ],
                  }),
                  H("div", {
                    className: "md:hidden",
                    children: H("button", {
                      onClick: () => l(!t),
                      className:
                        "p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-boxdark-2 transition-all duration-300",
                      children: H("svg", {
                        className: "h-7 w-7",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: H("path", {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: t
                            ? "M6 18L18 6M6 6l12 12"
                            : "M4 6h16M4 12h16M4 18h16",
                        }),
                      }),
                    }),
                  }),
                ],
              }),
              H("div", {
                className: `md:hidden transition-all duration-300 ease-in-out ${
                  t ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`,
                children: V("div", {
                  className: "py-3 space-y-2",
                  children: [
                    [
                      { href: "#projects", label: "Upcoming Projects" },
                      { href: "#gallery", label: "Gallery" },
                      { href: "#completed", label: "Completed Projects" },
                      { href: "#why-us", label: "Why Choose Us" },
                      { href: "#contact", label: "Contact Us" },
                    ].map((e) =>
                      H(
                        "a",
                        {
                          href: e.href,
                          className:
                            "block px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 \n                  hover:bg-blue-50 hover:text-primary dark:hover:bg-boxdark-2 rounded-lg\n                  transition-all duration-300",
                          onClick: () => l(!1),
                          children: e.label,
                        },
                        e.href
                      )
                    ),
                    V("button", {
                      onClick: () => {
                        e(), l(!1);
                      },
                      className:
                        "w-full text-left px-4 py-2.5 text-base font-medium text-primary \n                hover:bg-blue-50 dark:hover:bg-boxdark-2 rounded-lg\n                transition-all duration-300 flex items-center space-x-2",
                      children: [
                        H("svg", {
                          className: "w-5 h-5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24",
                          children: H("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
                          }),
                        }),
                        H("span", { children: "Login" }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
        V("button", {
          onClick: () => {
            window.open(
              `https://wa.me/+919876543210?text=${encodeURIComponent(
                "Hi, I would like to know more about your projects."
              )}`,
              "_blank"
            );
          },
          className:
            "fixed right-6 bottom-6 z-[9999] flex items-center justify-center w-14 h-14 \n        bg-[#25D366] rounded-full shadow-lg hover:bg-[#20BA56] \n        transition-all duration-300 hover:scale-110 \n        animate-bounce-slow group hover:shadow-xl hover:shadow-green-500/20",
          children: [
            H(E, {
              className:
                "text-white text-3xl group-hover:scale-110 transition-transform duration-300",
            }),
            V("span", {
              className:
                "absolute right-full mr-3 px-3 py-2 bg-white text-gray-700 \n        text-sm font-medium rounded-lg shadow-lg whitespace-nowrap \n        opacity-0 group-hover:opacity-100 transition-opacity duration-300\n        border border-gray-100",
              children: [
                "Chat with us on WhatsApp",
                H("span", {
                  className:
                    "absolute top-1/2 -right-2 -translate-y-1/2 \n          border-6 border-transparent border-l-white",
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  ma = ({ href: e, children: a }) =>
    V("a", {
      href: e,
      className:
        "relative px-5 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg \n    hover:text-primary hover:bg-blue-50/80 dark:hover:bg-boxdark-2 \n    transition-all duration-300 group overflow-hidden tracking-wide",
      children: [
        H("span", {
          className:
            "absolute inset-0 w-0 bg-blue-50 dark:bg-boxdark-2 transition-all duration-300 ease-out group-hover:w-full -z-10",
        }),
        H("span", { className: "relative", children: a }),
        H("span", {
          className:
            "absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
        }),
      ],
    }),
  pa = ({ icon: e, title: a, description: r }) =>
    V("div", {
      className:
        "bg-white dark:bg-boxdark p-4 rounded-lg shadow-sm border border-stroke dark:border-strokedark",
      children: [
        V("div", {
          className: "flex items-center mb-2",
          children: [
            H(e, { className: "text-primary text-xl mr-2" }),
            H("h3", {
              className: "font-semibold text-black dark:text-white",
              children: a,
            }),
          ],
        }),
        H("p", {
          className: "text-gray-600 dark:text-gray-400 text-sm",
          children: r,
        }),
      ],
    }),
  ha = () =>
    H("div", {
      className: "grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-2",
      children: [
        {
          icon: R,
          title: "Easy Process",
          description: "Simple and streamlined loan application process",
        },
        {
          icon: L,
          title: "Best Rates",
          description: "Competitive interest rates and flexible terms",
        },
        {
          icon: A,
          title: "Fast Growth",
          description: "Quick approval and disbursement process",
        },
        {
          icon: P,
          title: "Secure Platform",
          description: "Advanced security measures to protect your data",
        },
      ].map((e, a) => H(pa, { ...e }, a)),
    }),
  ba = ({
    isOpen: e,
    onClose: a,
    onSubmit: r,
    error: t,
    username: l,
    password: d,
    setUsername: i,
    setPassword: n,
  }) =>
    e
      ? H("div", {
          className:
            "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center",
          children: V("div", {
            className:
              "bg-white dark:bg-boxdark rounded-lg w-full max-w-md p-5 relative",
            children: [
              H("button", {
                onClick: a,
                className:
                  "absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 \n          transition-colors duration-200",
                children: H(M, { className: "text-xl" }),
              }),
              H("div", {
                className: "text-center mb-4",
                children: H("h2", {
                  className:
                    "text-xl font-bold text-black dark:text-white \n           from-primary/5 to-blue-500/5 \n          py-2 ",
                  children: "Login to Admin",
                }),
              }),
              V("form", {
                onSubmit: r,
                className: "space-y-4",
                children: [
                  V("div", {
                    className: "",
                    children: [
                      H("label", {
                        className:
                          "mb-1.5 block font-medium text-sm text-black dark:text-white",
                        children: "Username",
                      }),
                      V("div", {
                        className: "relative",
                        children: [
                          H("input", {
                            onChange: (e) => i(e.target.value),
                            value: l,
                            type: "text",
                            placeholder: "Enter your username",
                            className:
                              "w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-4 pr-8 text-sm outline-none \n                focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input \n                dark:focus:border-primary transition-colors duration-200",
                          }),
                          H(_, {
                            className:
                              "absolute right-3 top-2.5 text-lg text-gray-500",
                          }),
                        ],
                      }),
                    ],
                  }),
                  V("div", {
                    className: "",
                    children: [
                      H("label", {
                        className:
                          "mb-1.5 block font-medium text-sm text-black dark:text-white",
                        children: "Password",
                      }),
                      V("div", {
                        className: "relative",
                        children: [
                          H("input", {
                            onChange: (e) => n(e.target.value),
                            value: d,
                            type: "password",
                            placeholder: "Enter your password",
                            className:
                              "w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-4 pr-8 text-sm outline-none \n                focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input \n                dark:focus:border-primary transition-colors duration-200",
                          }),
                          H(D, {
                            className:
                              "absolute right-3 top-2.5 text-lg text-gray-500",
                          }),
                        ],
                      }),
                    ],
                  }),
                  H("button", {
                    type: "submit",
                    className:
                      "w-full cursor-pointer rounded-lg border border-primary bg-primary py-2.5 text-sm font-medium \n            text-white transition-all duration-200 hover:bg-opacity-90 hover:shadow-lg hover:shadow-primary/25",
                    children: "Login",
                  }),
                  t &&
                    V("div", {
                      className:
                        "rounded-md bg-red-50 p-2.5 text-xs text-red-500 dark:bg-red-100 flex items-center",
                      children: [
                        H("svg", {
                          className: "mr-2 h-3 w-3 flex-shrink-0",
                          fill: "currentColor",
                          viewBox: "0 0 20 20",
                          children: H("path", {
                            fillRule: "evenodd",
                            d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                            clipRule: "evenodd",
                          }),
                        }),
                        H("span", { className: "flex-1", children: t }),
                      ],
                    }),
                ],
              }),
            ],
          }),
        })
      : null,
  ua = "/assets/project1-c8574679.jpg",
  xa = "/assets/project2-2189e2c5.jpg",
  ka = () => {
    const [e, a] = r.useState(0),
      t = [
        {
          image: ua,
          title: "Luxury Villa Project",
          description:
            "Premium residential villas with modern amenities and spacious layouts",
        },
        {
          image: xa,
          title: "Commercial Complex",
          description:
            "State-of-the-art office spaces and retail outlets in prime location",
        },
        {
          image: "/assets/project3-65b698ba.jpg",
          title: "Residential Apartments",
          description: "Contemporary living spaces with world-class facilities",
        },
        {
          image: ua,
          title: "Smart Township",
          description: "Integrated township with sustainable infrastructure",
        },
        {
          image: xa,
          title: "Eco-Friendly Homes",
          description: "Green living spaces with energy-efficient design",
        },
      ],
      l = () => {
        a((e) => (e + 1) % t.length);
      };
    return (
      r.useEffect(() => {
        const e = setInterval(l, 5e3);
        return () => clearInterval(e);
      }, []),
      V("div", {
        className: "relative h-[600px] overflow-hidden",
        children: [
          H("div", {
            className: "relative h-full",
            children: t.map((a, r) =>
              H(
                "div",
                {
                  className:
                    "absolute inset-0 transition-opacity duration-700 ease-in-out " +
                    (r === e ? "opacity-100" : "opacity-0"),
                  children: V("div", {
                    className: "relative h-full w-full",
                    children: [
                      H("img", {
                        src: a.image,
                        alt: a.title,
                        className: "w-full h-full object-cover",
                      }),
                      H("div", {
                        className:
                          "absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent",
                      }),
                      H("div", {
                        className:
                          "absolute bottom-0 left-0 right-0 p-8 text-white",
                        children: V("div", {
                          className: "container mx-auto",
                          children: [
                            H("h2", {
                              className:
                                "text-4xl font-bold mb-3 transform translate-y-0 transition-transform duration-500",
                              children: a.title,
                            }),
                            H("p", {
                              className: "text-xl max-w-2xl text-gray-200",
                              children: a.description,
                            }),
                            H("button", {
                              className:
                                "mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all duration-300",
                              children: "Learn More",
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                },
                r
              )
            ),
          }),
          H("button", {
            onClick: () => {
              a((e) => (e - 1 + t.length) % t.length);
            },
            className:
              "absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm",
            children: H(S, { className: "text-3xl text-white" }),
          }),
          H("button", {
            onClick: l,
            className:
              "absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm",
            children: H(j, { className: "text-3xl text-white" }),
          }),
          H("div", {
            className:
              "absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10",
            children: t.map((r, t) =>
              H(
                "button",
                {
                  onClick: () => a(t),
                  className:
                    "transition-all duration-300 " +
                    (t === e
                      ? "w-8 h-2 bg-primary rounded-full"
                      : "w-2 h-2 bg-white/60 rounded-full hover:bg-white/80"),
                },
                t
              )
            ),
          }),
        ],
      })
    );
  },
  fa = () => {
    const e = b(),
      { dispatch: a } = ue(),
      [t, l] = r.useState(""),
      [d, i] = r.useState(""),
      [n, o] = r.useState(""),
      [s, c] = r.useState(!1);
    return V("div", {
      className: "min-h-screen bg-white dark:bg-boxdark flex flex-col",
      children: [
        H(ca, { onLoginClick: () => c(!0) }),
        H("div", {
          className: "flex-grow flex flex-wrap items-center",
          children: H("div", { className: "w-full", children: H(ka, {}) }),
        }),
        H(ha, {}),
        H("div", {
          className: "border-t border-stroke dark:border-strokedark",
          children: H("div", {
            className: "container mx-auto py-4",
            children: H(sa, {}),
          }),
        }),
        H("footer", {
          className:
            "bg-white dark:bg-boxdark py-2 border-t border-stroke dark:border-strokedark",
          children: H("div", {
            className:
              "container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm",
            children: H("p", {
              children: "© 2024 Raghav Elite Projects. All rights reserved.",
            }),
          }),
        }),
        H(ba, {
          isOpen: s,
          onClose: () => c(!1),
          onSubmit: async (r) => {
            var l, i;
            r.preventDefault();
            try {
              await (async (e, a) => {
                var r, t;
                try {
                  const r = await Me(De, a);
                  if (r.data)
                    return (
                      e({ type: X, payload: r.data }),
                      localStorage.setItem("user", JSON.stringify(r.data)),
                      r.data
                    );
                } catch (n) {
                  throw (
                    (e({
                      type: ee,
                      payload:
                        (null ==
                        (t = null == (r = n.response) ? void 0 : r.data)
                          ? void 0
                          : t.msg) || "Login failed",
                    }),
                    n)
                  );
                }
              })(a, { username: t, password: d }),
                e("/admin/dashboard");
            } catch (s) {
              o(
                (null == (i = null == (l = s.response) ? void 0 : l.data)
                  ? void 0
                  : i.msg) || "Login failed"
              );
            }
          },
          error: n,
          username: t,
          password: d,
          setUsername: l,
          setPassword: i,
        }),
      ],
    });
  };
let ga = !1;
const ya = () => {
  const e = b(),
    { state: t, dispatch: l } = ue(),
    {
      loading: d,
      error: i,
      list: n,
    } = t.loans || { loading: !1, error: null, list: [] },
    [o, s] = r.useState(1),
    [c, m] = r.useState(""),
    [p, h] = r.useState(""),
    x = 4 * (o - 1),
    f = x + 4,
    g = r.useCallback(async () => {
      await (async (e) => {
        var a, r;
        if (!ga)
          try {
            (ga = !0), e({ type: ne, payload: !0 });
            const a = await Pe(Ie);
            e({ type: ie, payload: a.data }),
              u.success("Loans fetched successfully");
          } catch (i) {
            console.error("Error fetching loans:", i),
              e({
                type: oe,
                payload:
                  (null == (r = null == (a = i.response) ? void 0 : a.data)
                    ? void 0
                    : r.message) || "Failed to fetch loans",
              }),
              u.error("Failed to fetch loans");
          } finally {
            (ga = !1), e({ type: ne, payload: !1 });
          }
      })(l);
    }, [l]);
  r.useEffect(() => {
    g();
  }, [g]);
  const y =
      (null == n
        ? void 0
        : n.filter((e) => {
            var a, r;
            const t =
                null == (a = e.customer_name)
                  ? void 0
                  : a.toLowerCase().includes(c.toLowerCase()),
              l =
                !p ||
                (null == (r = e.status) ? void 0 : r.toLowerCase()) ===
                  p.toLowerCase();
            return t && l;
          })) || [],
    v = Math.ceil(y.length / 4),
    w = y.slice(x, f),
    N = async (e) => {
      if (window.confirm("Are you sure you want to delete this loan?"))
        try {
          await (async (e, a) => {
            var r, t;
            const l = u.loading("Deleting loan...");
            try {
              await _e(Je(a)),
                e({ type: se, payload: a }),
                u.success("Loan deleted successfully", { id: l });
            } catch (i) {
              e({
                type: oe,
                payload:
                  (null == (t = null == (r = i.response) ? void 0 : r.data)
                    ? void 0
                    : t.msg) || "Failed to delete loan",
              }),
                u.error("Failed to delete loan", { id: l });
            }
          })(l, e),
            u.success("Loan deleted successfully");
        } catch (a) {
          u.error("Failed to delete loan");
        }
    };
  return d
    ? H(Le, {
        children: H("div", {
          className: "flex items-center justify-center min-h-screen",
          children: H("div", {
            className:
              "animate-spin rounded-full h-12 w-12 border-b-2 border-primary",
          }),
        }),
      })
    : i
    ? H(Le, {
        children: V("div", {
          className: "text-center text-red-500 p-4",
          children: ["Error: ", i],
        }),
      })
    : V(Le, {
        children: [
          H(Z, { pageName: "Lending Details" }),
          H(a, {
            to: "/admin/master-data/lending/add-lending",
            children: V(Y, {
              children: [
                H("span", { children: "Add Lending" }),
                H("span", { children: H(T, {}) }),
              ],
            }),
          }),
          V("div", {
            className:
              "rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6",
            children: [
              V("div", {
                className:
                  "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
                children: [
                  V("div", {
                    className: "relative flex-1 md:mr-2 mb-4 md:mb-0 ",
                    children: [
                      H("input", {
                        type: "text",
                        value: c,
                        onChange: (e) => m(e.target.value),
                        placeholder: "Search by customer name...",
                        className:
                          "rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0",
                      }),
                      H("span", {
                        className: "absolute left-2 py-3 text-xl",
                        children: H(k, {}),
                      }),
                    ],
                  }),
                  H("div", {
                    className: "relative flex-2 mb-4 md:mb-0",
                    children: V("select", {
                      value: p,
                      onChange: (e) => h(e.target.value),
                      className:
                        "rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full",
                      children: [
                        H("option", { value: "", children: "All Status" }),
                        H("option", { value: "active", children: "Active" }),
                        H("option", {
                          value: "completed",
                          children: "Completed",
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              H("div", {
                className: "max-w-full overflow-x-auto py-4",
                children: V("table", {
                  className: "w-full table-auto",
                  children: [
                    H("thead", {
                      children: V("tr", {
                        className: "bg-gray-2 text-left dark:bg-meta-4",
                        children: [
                          H("th", {
                            className:
                              "py-4 px-4 font-medium text-black dark:text-white",
                            children: "Customer Name",
                          }),
                          H("th", {
                            className:
                              "py-4 px-4 font-medium text-black dark:text-white",
                            children: "Lending Amount",
                          }),
                          H("th", {
                            className:
                              "py-4 px-4 font-medium text-black dark:text-white",
                            children: "Balance Remaining",
                          }),
                          H("th", {
                            className:
                              "py-4 px-4 font-medium text-black dark:text-white",
                            children: "Paid Amount",
                          }),
                          H("th", {
                            className:
                              "py-4 px-4 font-medium text-black dark:text-white",
                            children: "Total Interest",
                          }),
                          H("th", {
                            className:
                              "py-4 px-4 font-medium text-black dark:text-white",
                            children: "Status",
                          }),
                          H("th", {
                            className:
                              "py-4 px-4 font-medium text-black dark:text-white",
                            children: "Actions",
                          }),
                        ],
                      }),
                    }),
                    H("tbody", {
                      children: w.map((a) =>
                        V(
                          "tr",
                          {
                            children: [
                              H("td", {
                                className:
                                  "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                                children: H("p", {
                                  className: "text-black dark:text-white",
                                  children: a.customer_name,
                                }),
                              }),
                              H("td", {
                                className:
                                  "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                                children: V("p", {
                                  className: "text-black dark:text-white",
                                  children: ["$", a.loan_amount],
                                }),
                              }),
                              H("td", {
                                className:
                                  "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                                children: V("p", {
                                  className: "text-black dark:text-white",
                                  children: ["$", a.remaining_balance],
                                }),
                              }),
                              H("td", {
                                className:
                                  "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                                children: V("p", {
                                  className: "text-black dark:text-white",
                                  children: [
                                    "$",
                                    a.loan_amount - a.remaining_balance,
                                  ],
                                }),
                              }),
                              H("td", {
                                className:
                                  "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                                children: V("p", {
                                  className: "text-black dark:text-white",
                                  children: ["$", a.interest_amount],
                                }),
                              }),
                              H("td", {
                                className:
                                  "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                                children: H("span", {
                                  className:
                                    "inline-block px-3 py-1 rounded-full " +
                                    ("active" === a.status.toLowerCase()
                                      ? "text-success bg-success/10"
                                      : "text-danger bg-danger/10"),
                                  children: a.status,
                                }),
                              }),
                              H("td", {
                                className:
                                  "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                                children: V("div", {
                                  className: "flex items-center space-x-3.5",
                                  children: [
                                    H("button", {
                                      onClick: () =>
                                        e(
                                          `/admin/master-data/lending/edit/${a.loan_id}`
                                        ),
                                      className: "hover:text-black",
                                      children: H(F, {
                                        className:
                                          "text-primary text-xl hover:text-black dark:hover:text-white",
                                      }),
                                    }),
                                    H("button", {
                                      onClick: () => N(a.loan_id),
                                      className: "hover:text-black",
                                      children: H(O, {
                                        className:
                                          "text-danger text-xl hover:text-black dark:hover:text-white",
                                      }),
                                    }),
                                    H("button", {
                                      onClick: () =>
                                        e(`/admin/lending/${a.loan_id}`),
                                      className: "hover:text-black",
                                      children: H(z, {
                                        className:
                                          "text-success text-xl hover:text-black dark:hover:text-white",
                                      }),
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          },
                          a.loan_id
                        )
                      ),
                    }),
                  ],
                }),
              }),
              V("div", {
                className:
                  "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
                children: [
                  H("div", {
                    className: "flex items-center space-x-2",
                    children: V("span", {
                      className: "text-gray-5 dark:text-gray-4 text-sm py-4",
                      children: [
                        "Showing ",
                        x + 1,
                        "-",
                        Math.min(f, y.length),
                        " of ",
                        y.length,
                        " Loans",
                      ],
                    }),
                  }),
                  V("div", {
                    className: "flex space-x-2 py-4",
                    children: [
                      H("button", {
                        disabled: 1 === o,
                        onClick: () => {
                          o > 1 && s((e) => e - 1);
                        },
                        className:
                          "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                        children: "Prev",
                      }),
                      [...Array(Math.min(v, 5))].map((e, a) => {
                        const r = a + 1;
                        return r === o
                          ? H(
                              "div",
                              {
                                className:
                                  "py-2 px-4 rounded-lg border border-primary bg-primary text-white font-semibold hover:bg-primary dark:text-white dark:bg-primary dark:hover:bg-primary",
                                children: r,
                              },
                              a
                            )
                          : (2 === r && o > 4) || (r === v - 1 && o < v - 3)
                          ? H(
                              "p",
                              {
                                className:
                                  "py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white",
                                children: "...",
                              },
                              a
                            )
                          : 1 === r || r === v || (r >= o - 1 && r <= o + 1)
                          ? H(
                              "div",
                              {
                                className:
                                  "py-2 px-4 rounded-lg border border-gray-2 text-black dark:bg-transparent bg-gray font-medium dark:border-strokedark dark:text-white",
                                children: r,
                              },
                              a
                            )
                          : null;
                      }),
                      H("button", {
                        disabled: o === v,
                        onClick: () => {
                          o < v && s((e) => e + 1);
                        },
                        className:
                          "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                        children: "Next",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
};
let va = !1;
const wa = () => {
    const { state: e, dispatch: t } = ue(),
      { users: l, loading: d, error: i } = e,
      [n, o] = r.useState(1),
      [s, c] = r.useState(""),
      [m, p] = r.useState(""),
      h = r.useCallback(async () => {
        await (async (e) => {
          var a, r;
          if (!va)
            try {
              (va = !0), e({ type: te, payload: !0 });
              const a = await Pe(Te);
              e({ type: re, payload: a.data }),
                u.success("Users fetched successfully");
            } catch (i) {
              console.error("Error fetching users:", i),
                e({
                  type: le,
                  payload:
                    (null == (r = null == (a = i.response) ? void 0 : a.data)
                      ? void 0
                      : r.msg) || "Failed to fetch users",
                }),
                u.error("Failed to fetch users");
            } finally {
              (va = !1), e({ type: te, payload: !1 });
            }
        })(t);
      }, [t]);
    r.useEffect(() => {
      h();
    }, [h]);
    const b =
        (null == l
          ? void 0
          : l.filter((e) => {
              var a, r, t, l;
              const d =
                  (null == (a = e.username)
                    ? void 0
                    : a.toLowerCase().includes(s.toLowerCase())) ||
                  (null == (r = e.user_id)
                    ? void 0
                    : r.toLowerCase().includes(s.toLowerCase())) ||
                  (null == (t = e.email)
                    ? void 0
                    : t.toLowerCase().includes(s.toLowerCase())),
                i =
                  !m ||
                  (null == (l = e.status) ? void 0 : l.toLowerCase()) ===
                    m.toLowerCase();
              return d && i;
            })) || [],
      f = Math.ceil(b.length / 4),
      g = 4 * (n - 1),
      y = g + 4,
      v = b.slice(g, y),
      w = async (e) => {
        window.confirm("Are you sure you want to delete this user?") &&
          (await (async (e, a) => {
            var r, t;
            const l = u.loading("Deleting user...");
            try {
              await _e(ze(a)),
                e({ type: de, payload: a }),
                u.success("User deleted successfully", { id: l });
            } catch (i) {
              e({
                type: le,
                payload:
                  (null == (t = null == (r = i.response) ? void 0 : r.data)
                    ? void 0
                    : t.msg) || "Failed to delete user",
              }),
                u.error("Failed to delete user", { id: l });
            }
          })(t, e));
      };
    return d
      ? H("div", { children: "Loading..." })
      : i
      ? V("div", { children: ["Error: ", i] })
      : V(Le, {
          children: [
            H(Z, { pageName: "Customer Data" }),
            H(a, {
              to: "/admin/master-data/data-pegawai/form-data-pegawai",
              children: V(Y, {
                children: [
                  H("span", { children: "Add Customer" }),
                  H("span", { children: H(T, {}) }),
                ],
              }),
            }),
            V("div", {
              className:
                "rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6",
              children: [
                V("div", {
                  className:
                    "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
                  children: [
                    H("div", {
                      className: "relative flex-1 md:mr-2 mb-4 md:mb-0",
                      children: V("div", {
                        className: "relative w-48",
                        children: [
                          V("select", {
                            value: m,
                            onChange: (e) => p(e.target.value),
                            className:
                              "w-full relative appearance-none rounded border border-stroke bg-transparent py-3 pl-4 pr-8 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input",
                            children: [
                              H("option", {
                                value: "",
                                children: "All Status",
                              }),
                              H("option", {
                                value: "active",
                                children: "Active",
                              }),
                              H("option", {
                                value: "inactive",
                                children: "Inactive",
                              }),
                            ],
                          }),
                          H("span", {
                            className:
                              "absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none",
                            children: H(x, {}),
                          }),
                        ],
                      }),
                    }),
                    V("div", {
                      className: "relative flex-2 mb-4 md:mb-0",
                      children: [
                        H("input", {
                          type: "text",
                          value: s,
                          onChange: (e) => c(e.target.value),
                          placeholder: "Search by name, ID or email...",
                          className:
                            "rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0",
                        }),
                        H("span", {
                          className: "absolute left-2 py-3 text-xl",
                          children: H(k, {}),
                        }),
                      ],
                    }),
                  ],
                }),
                H("div", {
                  className: "max-w-full overflow-x-auto py-4",
                  children: V("table", {
                    className: "w-full table-auto",
                    children: [
                      H("thead", {
                        children: V("tr", {
                          className: "bg-gray-2 text-left dark:bg-meta-4",
                          children: [
                            H("th", {
                              className:
                                "py-4 px-4 font-medium text-black dark:text-white",
                              children: "Photo",
                            }),
                            H("th", {
                              className:
                                "py-4 px-4 font-medium text-black dark:text-white",
                              children: "User ID",
                            }),
                            H("th", {
                              className:
                                "py-4 px-4 font-medium text-black dark:text-white",
                              children: "Username",
                            }),
                            H("th", {
                              className:
                                "py-4 px-4 font-medium text-black dark:text-white",
                              children: "Email",
                            }),
                            H("th", {
                              className:
                                "py-4 px-4 font-medium text-black dark:text-white",
                              children: "Mobile",
                            }),
                            H("th", {
                              className:
                                "py-4 px-4 font-medium text-black dark:text-white",
                              children: "Status",
                            }),
                            H("th", {
                              className:
                                "py-4 px-4 font-medium text-black dark:text-white",
                              children: "Role",
                            }),
                            H("th", {
                              className:
                                "py-4 px-4 font-medium text-black dark:text-white",
                              children: "Actions",
                            }),
                          ],
                        }),
                      }),
                      H("tbody", {
                        children: v.map((e) =>
                          V(
                            "tr",
                            {
                              children: [
                                H("td", {
                                  className:
                                    "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                                  children: H("img", {
                                    src: e.url || e.photo,
                                    alt: e.username,
                                    className: "w-10 h-10 rounded-full",
                                  }),
                                }),
                                H("td", {
                                  className:
                                    "border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark",
                                  children: e.user_id,
                                }),
                                H("td", {
                                  className:
                                    "border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark",
                                  children: e.username,
                                }),
                                H("td", {
                                  className:
                                    "border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark",
                                  children: e.email,
                                }),
                                H("td", {
                                  className:
                                    "border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark",
                                  children: e.mobile_number,
                                }),
                                H("td", {
                                  className:
                                    "border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark",
                                  children: e.status,
                                }),
                                H("td", {
                                  className:
                                    "border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark",
                                  children: e.role,
                                }),
                                H("td", {
                                  className:
                                    "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                                  children: V("div", {
                                    className: "flex items-center space-x-3.5",
                                    children: [
                                      H(a, {
                                        to: `/admin/master-data/data-pegawai/edit/${e.user_id}`,
                                        children: H(F, {
                                          className:
                                            "text-primary text-xl hover:text-black dark:hover:text-white",
                                        }),
                                      }),
                                      H("button", {
                                        onClick: () => w(e.user_id),
                                        children: H(O, {
                                          className:
                                            "text-danger text-xl hover:text-black dark:hover:text-white",
                                        }),
                                      }),
                                    ],
                                  }),
                                }),
                              ],
                            },
                            e.user_id
                          )
                        ),
                      }),
                    ],
                  }),
                }),
                V("div", {
                  className:
                    "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
                  children: [
                    H("div", {
                      className: "flex items-center space-x-2",
                      children: V("span", {
                        className: "text-gray-5 dark:text-gray-4 text-sm py-4",
                        children: [
                          "Showing ",
                          g + 1,
                          "-",
                          Math.min(y, b.length),
                          " of ",
                          b.length,
                          " Customers",
                        ],
                      }),
                    }),
                    V("div", {
                      className: "flex space-x-2 py-4",
                      children: [
                        H("button", {
                          disabled: 1 === n,
                          onClick: () => {
                            n > 1 && o((e) => e - 1);
                          },
                          className:
                            "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                          children: "Prev",
                        }),
                        [...Array(Math.min(f, 5))].map((e, a) => {
                          const r = a + 1;
                          return r === n
                            ? H(
                                "div",
                                {
                                  className:
                                    "py-2 px-4 rounded-lg border border-primary bg-primary text-white font-semibold hover:bg-primary dark:text-white dark:bg-primary dark:hover:bg-primary",
                                  children: r,
                                },
                                a
                              )
                            : (2 === r && n > 4) || (r === f - 1 && n < f - 3)
                            ? H(
                                "p",
                                {
                                  className:
                                    "py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white",
                                  children: "...",
                                },
                                a
                              )
                            : 1 === r || r === f || (r >= n - 1 && r <= n + 1)
                            ? H(
                                "div",
                                {
                                  className:
                                    "py-2 px-4 rounded-lg border border-gray-2 text-black dark:bg-transparent bg-gray font-medium dark:border-strokedark dark:text-white",
                                  children: r,
                                },
                                a
                              )
                            : null;
                        }),
                        H("button", {
                          disabled: n === f,
                          onClick: () => {
                            n < f && o((e) => e + 1);
                          },
                          className:
                            "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                          children: "Next",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
  },
  Na = () =>
    V(Le, {
      children: [
        H(Z, { pageName: "Change Password Form" }),
        H("div", {
          className: "sm:grid-cols-2",
          children: H("div", {
            className: "flex flex-col gap-9",
            children: V("div", {
              className:
                "rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
              children: [
                H("div", {
                  className:
                    "border-b border-stroke py-4 px-6.5 dark:border-strokedark",
                  children: H("h3", {
                    className: "font-medium text-black dark:text-white",
                    children: "Change Password Form",
                  }),
                }),
                H("form", {
                  action: "#",
                  children: V("div", {
                    className: "p-6.5",
                    children: [
                      V("div", {
                        className: "mb-4.5 ",
                        children: [
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-4 block text-black dark:text-white",
                                children: [
                                  "New Password ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "password",
                                placeholder: "Enter new password",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-4 block text-black dark:text-white",
                                children: [
                                  "Repeat New Password ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "password",
                                placeholder: "Re-enter new password",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                              H(D, {
                                className: "absolute right-4 top-4 text-xl",
                              }),
                            ],
                          }),
                        ],
                      }),
                      H("div", {
                        className:
                          "flex flex-col md:flex-row w-full gap-3 text-center",
                        children: H(a, {
                          to: "",
                          children: H(Y, {
                            children: H("span", { children: "Save" }),
                          }),
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      ],
    }),
  Ca = [
    {
      id: 1,
      nik: "1218052110020002",
      namaPegawai: "Gilbert Hutapea",
      Gender: "Male",
      titleJabatan: "HRD",
      hadir: "22",
      sakit: "5",
      alpha: "3",
    },
    {
      id: 2,
      nik: "1218052110020003",
      namaPegawai: "Layla Siregar",
      Gender: "Female",
      titleJabatan: "Staff Marketing",
      hadir: "23",
      sakit: "4",
      alpha: "3",
    },
    {
      id: 3,
      nik: "1218052110020004",
      namaPegawai: "Zilong Sibarani",
      Gender: "Male",
      titleJabatan: "Admin",
      hadir: "24",
      sakit: "3",
      alpha: "3",
    },
    {
      id: 4,
      nik: "1218052110020005",
      namaPegawai: "Nana Silaban",
      Gender: "Female",
      titleJabatan: "Sales",
      hadir: "25",
      sakit: "2",
      alpha: "3",
    },
    {
      id: 5,
      nik: "1218052110020005",
      namaPegawai: "Nana Silaban",
      Gender: "Female",
      titleJabatan: "Non Staf",
      hadir: "26",
      sakit: "1",
      alpha: "3",
    },
    {
      id: 6,
      nik: "1218052110020005",
      namaPegawai: "Nana Silaban",
      Gender: "Female",
      titleJabatan: "Supervisi",
      hadir: "27",
      sakit: "0",
      alpha: "3",
    },
    {
      id: 7,
      nik: "1218052110020005",
      namaPegawai: "Nana Silaban",
      Gender: "Female",
      titleJabatan: "Designer",
      hadir: "28",
      sakit: "2",
      alpha: "2",
    },
    {
      id: 8,
      nik: "1218052110020005",
      namaPegawai: "Nana Silaban",
      Gender: "Female",
      titleJabatan: "Manager",
      hadir: "29",
      sakit: "1",
      alpha: "0",
    },
  ],
  Sa = () => {
    const [e, t] = r.useState(1),
      [l, d] = r.useState(0),
      [i, n] = r.useState(4),
      [o, s] = r.useState([]),
      c = Math.ceil(Ca.length / 4);
    r.useEffect(() => {
      s(Ca.slice(l, i));
    }, [l, i]);
    return V(Le, {
      children: [
        H(Z, { pageName: "Employee Attendance Data" }),
        V("div", {
          className:
            "rounded-sm border border-stroke bg-white px-5 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-10 mt-6",
          children: [
            H("div", {
              className: "border-b border-stroke py-2 dark:border-strokedark",
              children: H("h3", {
                className: "font-medium text-black dark:text-white",
                children: "Filter Employee Attendance Data",
              }),
            }),
            V("div", {
              className:
                "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
              children: [
                H("div", {
                  className: "relative w-full md:w-1/4 md:mr-2 mb-4 md:mb-0",
                  children: V("div", {
                    className: "relative",
                    children: [
                      H("span", { className: "px-4", children: " Month" }),
                      H("span", {
                        className:
                          "absolute top-1/2 left-55 z-30 -translate-y-1/2 text-xl",
                        children: H(x, {}),
                      }),
                      V("select", {
                        className:
                          "relative appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input",
                        children: [
                          H("option", { value: "", children: "Select Month" }),
                          H("option", { value: "", children: "January" }),
                          H("option", { value: "", children: "February" }),
                          H("option", { value: "", children: "March" }),
                          H("option", { value: "", children: "April" }),
                          H("option", { value: "", children: "May" }),
                          H("option", { value: "", children: "June" }),
                          H("option", { value: "", children: "July" }),
                          H("option", { value: "", children: "August" }),
                          H("option", { value: "", children: "September" }),
                          H("option", { value: "", children: "October" }),
                          H("option", { value: "", children: "November" }),
                          H("option", { value: "", children: "December" }),
                        ],
                      }),
                    ],
                  }),
                }),
                H("div", {
                  className: "relative w-full md:w-1/4 md:mr-2 mb-4 md:mb-0",
                  children: V("div", {
                    className: "relative",
                    children: [
                      H("span", { className: "px-4", children: "Year" }),
                      H("span", {
                        className:
                          "absolute top-1/2 left-55 z-30 -translate-y-1/2 text-xl",
                        children: H(x, {}),
                      }),
                      V("select", {
                        className:
                          "relative appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input",
                        children: [
                          H("option", { value: "", children: "Select Year" }),
                          H("option", { value: "", children: "2020" }),
                          H("option", { value: "", children: "2021" }),
                          H("option", { value: "", children: "2022" }),
                          H("option", { value: "", children: "2023" }),
                          H("option", { value: "", children: "2024" }),
                          H("option", { value: "", children: "2025" }),
                          H("option", { value: "", children: "2026" }),
                          H("option", { value: "", children: "2027" }),
                        ],
                      }),
                    ],
                  }),
                }),
                V("div", {
                  className:
                    "flex flex-col md:flex-row w-full md:w-1/2 justify-between text-center",
                  children: [
                    H("div", {
                      className: "relative w-full md:w-1/2 mb-4 md:mb-0 ",
                      children: H(a, {
                        to: "/admin/transaksi/data-absensi",
                        children: V(Y, {
                          className: "bg-primary",
                          children: [
                            H("span", { children: "Show Data" }),
                            H("span", { children: H(G, {}) }),
                          ],
                        }),
                      }),
                    }),
                    H("div", {
                      className: "relative w-full md:w-1/2  mb-4 md:mb-0",
                      children: H(a, {
                        to: "/admin/transaksi/data-absensi",
                        children: V(Y, {
                          children: [
                            H("span", { children: "Input Attendance" }),
                            H("span", { children: H(T, {}) }),
                          ],
                        }),
                      }),
                    }),
                  ],
                }),
              ],
            }),
            H("div", {
              className: "bg-gray-2 text-left dark:bg-meta-4 mt-6",
              children: V("h2", {
                className: "px-4 py-2 text-black dark:text-white",
                children: [
                  "Displaying Employee Attendance Data for Month:",
                  H("span", { className: "font-medium", children: " April" }),
                  " Year:",
                  H("span", { className: "font-medium", children: " 2023" }),
                ],
              }),
            }),
          ],
        }),
        V("div", {
          className:
            "rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6",
          children: [
            H("div", {
              className:
                "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
              children: V("div", {
                className: "relative flex-2 mb-4 md:mb-0",
                children: [
                  H("input", {
                    type: "text",
                    placeholder: "Type to search..",
                    className:
                      "rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0",
                  }),
                  H("span", {
                    className: "absolute left-2 py-3 text-xl",
                    children: H(k, {}),
                  }),
                ],
              }),
            }),
            H("div", {
              className: "max-w-full overflow-x-auto py-4",
              children: V("table", {
                className: "w-full table-auto",
                children: [
                  H("thead", {
                    children: V("tr", {
                      className: "bg-gray-2 text-left dark:bg-meta-4",
                      children: [
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "NIK",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Employee Name",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Gender",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Position",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Present",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Sick",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Absent",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Actions",
                        }),
                      ],
                    }),
                  }),
                  H("tbody", {
                    children: o.map((e) =>
                      V(
                        "tr",
                        {
                          children: [
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.nik,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.namaPegawai,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.Gender,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.titleJabatan,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.hadir,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.sakit,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.alpha,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: V("div", {
                                className: "flex items-center space-x-3.5",
                                children: [
                                  H("button", {
                                    className: "hover:text-black",
                                    children: H(F, {
                                      className:
                                        "text-primary text-xl hover:text-black dark:hover:text-white",
                                    }),
                                  }),
                                  H("button", {
                                    className: "hover:text-black",
                                    children: H(O, {
                                      className:
                                        "text-danger text-xl hover:text-black dark:hover:text-white",
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          ],
                        },
                        e.id
                      )
                    ),
                  }),
                ],
              }),
            }),
            V("div", {
              className:
                "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
              children: [
                H("div", {
                  className: "flex items-center space-x-2",
                  children: V("span", {
                    className: "text-gray-5 dark:text-gray-4 text-sm py-4",
                    children: [
                      "Showing ",
                      l,
                      "-",
                      i,
                      " of ",
                      Ca.length,
                      " Data Attendance",
                    ],
                  }),
                }),
                V("div", {
                  className: "flex space-x-2 py-4",
                  children: [
                    H("button", {
                      disabled: 1 === e,
                      onClick: () => {
                        e > 1 &&
                          (t((e) => e - 1), d((e) => e - 4), n((e) => e - 4));
                      },
                      className:
                        "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                      children: "Prev",
                    }),
                    [...Array(Math.min(c, 5))].map((a, r) => {
                      const t = r + 1;
                      return t === e
                        ? H(
                            "div",
                            {
                              className:
                                "py-2 px-4 rounded-lg border border-primary bg-primary text-white font-semibold hover:bg-primary dark:text-white dark:bg-primary dark:hover:bg-primary",
                              children: t,
                            },
                            r
                          )
                        : (2 === t && e > 4) || (t === c - 1 && e < c - 3)
                        ? H(
                            "p",
                            {
                              className:
                                "py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white",
                              children: "...",
                            },
                            r
                          )
                        : 1 === t || t === c || (t >= e - 1 && t <= e + 1)
                        ? H(
                            "div",
                            {
                              className:
                                "py-2 px-4 rounded-lg border border-gray-2 text-black dark:bg-transparent bg-gray font-medium dark:border-strokedark dark:text-white",
                              children: t,
                            },
                            r
                          )
                        : null;
                    }),
                    H("button", {
                      disabled: e === c,
                      onClick: () => {
                        e < c &&
                          (t((e) => e + 1), d((e) => e + 4), n((e) => e + 4));
                      },
                      className:
                        "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                      children: "Next",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  ja = [
    {
      id: 1,
      nik: "1218052110020002",
      namaPegawai: "Gilbert Hutapea",
      Gender: "Male",
      titleJabatan: "HRD",
      gajiPokok: "Rp. 4.000.000",
      ransportationAllowance: "Rp. 600.000",
      uangMakan: "Rp. 400.000",
      jumlahPotongan: "Rp. 100.000",
      totalGaji: "Rp. 5.900.000",
    },
    {
      id: 2,
      nik: "1218052110020003",
      namaPegawai: "Layla Siregar",
      Gender: "Female",
      titleJabatan: "Staff Marketing",
      gajiPokok: "Rp. 2.500.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 0",
      totalGaji: "Rp. 3.000.000",
    },
    {
      id: 3,
      nik: "1218052110020004",
      namaPegawai: "Zilong Sibarani",
      Gender: "Male",
      titleJabatan: "Admin",
      gajiPokok: "Rp. 2.200.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 100.000",
      totalGaji: "Rp. 2.600.000",
    },
    {
      id: 4,
      nik: "1218052110020005",
      namaPegawai: "Nana Silaban",
      Gender: "Female",
      titleJabatan: "Sales",
      gajiPokok: "Rp. 2.500.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 0",
      totalGaji: "Rp. 3.000.000",
    },
    {
      id: 5,
      nik: "1218052110020005",
      namaPegawai: "Nana Silaban",
      Gender: "Female",
      titleJabatan: "Non Staf",
      gajiPokok: "Rp. 2.500.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 100.000",
      totalGaji: "Rp. 2.900.000",
    },
    {
      id: 6,
      nik: "1218052110020005",
      namaPegawai: "Nana Silaban",
      Gender: "Female",
      titleJabatan: "Supervisi",
      gajiPokok: "Rp. 2.200.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 0",
      totalGaji: "Rp. 2.700.000",
    },
    {
      id: 7,
      nik: "1218052110020005",
      namaPegawai: "Nana Silaban",
      Gender: "Female",
      titleJabatan: "Designer",
      gajiPokok: "Rp. 2.500.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 100.000",
      totalGaji: "Rp. 2.900.000",
    },
    {
      id: 8,
      nik: "1218052110020005",
      namaPegawai: "Nana Silaban",
      Gender: "Female",
      titleJabatan: "Manager",
      gajiPokok: "Rp. 4.000.000",
      ransportationAllowance: "Rp. 600.000",
      uangMakan: "Rp. 400.000",
      jumlahPotongan: "Rp. 0",
      totalGaji: "Rp. 6.000.000",
    },
  ],
  Ea = () => {
    const [e, t] = r.useState(1),
      [l, d] = r.useState(0),
      [i, n] = r.useState(4),
      [o, s] = r.useState([]),
      c = Math.ceil(ja.length / 4);
    r.useEffect(() => {
      s(ja.slice(l, i));
    }, [l, i]);
    return V(Le, {
      children: [
        H(Z, { pageName: "Salary Data  Employee" }),
        V("div", {
          className:
            "rounded-sm border border-stroke bg-white px-5 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-10 mt-6",
          children: [
            H("div", {
              className: "border-b border-stroke py-2 dark:border-strokedark",
              children: H("h3", {
                className: "font-medium text-black dark:text-white",
                children: "Filter Employee Salary Data",
              }),
            }),
            V("div", {
              className:
                "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
              children: [
                H("div", {
                  className: "relative w-full md:w-1/4 md:mr-2 mb-4 md:mb-0",
                  children: V("div", {
                    className: "relative",
                    children: [
                      H("span", { className: "px-4", children: " Month" }),
                      H("span", {
                        className:
                          "absolute top-1/2 left-55 z-30 -translate-y-1/2 text-xl",
                        children: H(x, {}),
                      }),
                      V("select", {
                        className:
                          "relative appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input",
                        children: [
                          H("option", { value: "", children: "Select Month" }),
                          H("option", { value: "", children: "January" }),
                          H("option", { value: "", children: "February" }),
                          H("option", { value: "", children: "March" }),
                          H("option", { value: "", children: "April" }),
                          H("option", { value: "", children: "May" }),
                          H("option", { value: "", children: "June" }),
                          H("option", { value: "", children: "July" }),
                          H("option", { value: "", children: "August" }),
                          H("option", { value: "", children: "September" }),
                          H("option", { value: "", children: "October" }),
                          H("option", { value: "", children: "November" }),
                          H("option", { value: "", children: "December" }),
                        ],
                      }),
                    ],
                  }),
                }),
                H("div", {
                  className: "relative w-full md:w-1/4 md:mr-2 mb-4 md:mb-0",
                  children: V("div", {
                    className: "relative",
                    children: [
                      H("span", { className: "px-4", children: "Year" }),
                      H("span", {
                        className:
                          "absolute top-1/2 left-55 z-30 -translate-y-1/2 text-xl",
                        children: H(x, {}),
                      }),
                      V("select", {
                        className:
                          "relative appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input",
                        children: [
                          H("option", { value: "", children: "Select Year" }),
                          H("option", { value: "", children: "2020" }),
                          H("option", { value: "", children: "2021" }),
                          H("option", { value: "", children: "2022" }),
                          H("option", { value: "", children: "2023" }),
                          H("option", { value: "", children: "2024" }),
                          H("option", { value: "", children: "2025" }),
                          H("option", { value: "", children: "2026" }),
                          H("option", { value: "", children: "2027" }),
                        ],
                      }),
                    ],
                  }),
                }),
                V("div", {
                  className:
                    "flex flex-col md:flex-row w-full md:w-1/2 justify-between text-center",
                  children: [
                    H("div", {
                      className: "relative w-full md:w-1/2 mb-4 md:mb-0 ",
                      children: H(a, {
                        to: "/admin/transaksi/data-gaji",
                        children: V(Y, {
                          className: "bg-primary",
                          children: [
                            H("span", { children: "Show Data" }),
                            H("span", { children: H(G, {}) }),
                          ],
                        }),
                      }),
                    }),
                    H("div", {
                      className: "relative w-full md:w-1/2  mb-4 md:mb-0",
                      children: H(a, {
                        to: "/admin/transaksi/data-gaji",
                        children: V(Y, {
                          children: [
                            H("span", { children: "Print Salary List" }),
                            H("span", { children: H(C, {}) }),
                          ],
                        }),
                      }),
                    }),
                  ],
                }),
              ],
            }),
            H("div", {
              className: "bg-gray-2 text-left dark:bg-meta-4 mt-6",
              children: V("h2", {
                className: "px-4 py-2 text-black dark:text-white",
                children: [
                  "Displaying Employee Salary Data for Month:",
                  H("span", { className: "font-medium", children: " April" }),
                  " Year:",
                  H("span", { className: "font-medium", children: " 2023" }),
                ],
              }),
            }),
          ],
        }),
        V("div", {
          className:
            "rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6",
          children: [
            H("div", {
              className:
                "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
              children: V("div", {
                className: "relative flex-2 mb-4 md:mb-0",
                children: [
                  H("input", {
                    type: "text",
                    placeholder: "Type to search..",
                    className:
                      "rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0",
                  }),
                  H("span", {
                    className: "absolute left-2 py-3 text-xl",
                    children: H(k, {}),
                  }),
                ],
              }),
            }),
            H("div", {
              className: "max-w-full overflow-x-auto py-4",
              children: V("table", {
                className: "w-full table-auto-full",
                children: [
                  H("thead", {
                    children: V("tr", {
                      className: "bg-gray-2  dark:bg-meta-4",
                      children: [
                        H("th", {
                          className:
                            "py-2 px-2 font-medium text-black dark:text-white",
                          children: "NIK",
                        }),
                        V("th", {
                          className:
                            "py-2 px-2 font-medium text-black dark:text-white",
                          children: ["Nama ", H("br", {}), " Employee"],
                        }),
                        H("th", {
                          className:
                            "py-2 px-2 font-medium text-black dark:text-white",
                          children: "Gender",
                        }),
                        H("th", {
                          className:
                            "py-2 px-2 font-medium text-black dark:text-white",
                          children: "Position",
                        }),
                        H("th", {
                          className:
                            "py-2 px-2 font-medium text-black dark:text-white",
                          children: "Basic Salary",
                        }),
                        V("th", {
                          className:
                            "py-2 px-2 font-medium text-black dark:text-white",
                          children: ["Transport ", H("br", {}), " Allowence"],
                        }),
                        V("th", {
                          className:
                            "py-2 px-2 font-medium text-black dark:text-white",
                          children: ["Meal ", H("br", {}), " Allowance"],
                        }),
                        V("th", {
                          className:
                            "py-2 px-2 font-medium text-black dark:text-white",
                          children: ["Salary ", H("br", {}), " Deduction"],
                        }),
                        V("th", {
                          className:
                            "py-2 px-2 font-medium text-black dark:text-white",
                          children: ["Total ", H("br", {}), " Salary"],
                        }),
                        H("th", {
                          className:
                            "py-2 px-2 font-medium text-black dark:text-white",
                          children: "Actions",
                        }),
                      ],
                    }),
                  }),
                  H("tbody", {
                    children: o.map((e) =>
                      V(
                        "tr",
                        {
                          children: [
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.nik,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.namaPegawai,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.Gender,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.titleJabatan,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.gajiPokok,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.ransportationAllowance,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.uangMakan,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.jumlahPotongan,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.totalGaji,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark",
                              children: V("div", {
                                className: "flex items-center space-x-3.5",
                                children: [
                                  H("button", {
                                    className: "hover:text-black",
                                    children: H(F, {
                                      className:
                                        "text-primary text-xl hover:text-black dark:hover:text-white",
                                    }),
                                  }),
                                  H("button", {
                                    className: "hover:text-black",
                                    children: H(O, {
                                      className:
                                        "text-danger text-xl hover:text-black dark:hover:text-white",
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          ],
                        },
                        e.id
                      )
                    ),
                  }),
                ],
              }),
            }),
            V("div", {
              className:
                "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
              children: [
                H("div", {
                  className: "flex items-center space-x-2",
                  children: V("span", {
                    className: "text-gray-5 dark:text-gray-4 text-sm py-4",
                    children: [
                      "Showing ",
                      l,
                      "-",
                      i,
                      " of ",
                      ja.length,
                      " Salary Data  Employee",
                    ],
                  }),
                }),
                V("div", {
                  className: "flex space-x-2 py-4",
                  children: [
                    H("button", {
                      disabled: 1 === e,
                      onClick: () => {
                        e > 1 &&
                          (t((e) => e - 1), d((e) => e - 4), n((e) => e - 4));
                      },
                      className:
                        "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                      children: "Prev",
                    }),
                    [...Array(Math.min(c, 5))].map((a, r) => {
                      const t = r + 1;
                      return t === e
                        ? H(
                            "div",
                            {
                              className:
                                "py-2 px-4 rounded-lg border border-primary bg-primary text-white font-semibold hover:bg-primary dark:text-white dark:bg-primary dark:hover:bg-primary",
                              children: t,
                            },
                            r
                          )
                        : (2 === t && e > 4) || (t === c - 1 && e < c - 3)
                        ? H(
                            "p",
                            {
                              className:
                                "py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white",
                              children: "...",
                            },
                            r
                          )
                        : 1 === t || t === c || (t >= e - 1 && t <= e + 1)
                        ? H(
                            "div",
                            {
                              className:
                                "py-2 px-4 rounded-lg border border-gray-2 text-black dark:bg-transparent bg-gray font-medium dark:border-strokedark dark:text-white",
                              children: t,
                            },
                            r
                          )
                        : null;
                    }),
                    H("button", {
                      disabled: e === c,
                      onClick: () => {
                        e < c &&
                          (t((e) => e + 1), d((e) => e + 4), n((e) => e + 4));
                      },
                      className:
                        "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                      children: "Next",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  Ra = [
    { id: 1, potonganGaji: "Alpha", jumlahPotongan: "Rp. 100.000" },
    { id: 2, potonganGaji: "Sakit", jumlahPotongan: "Rp. 0" },
  ],
  La = () => {
    const [e, t] = r.useState(1),
      [l, d] = r.useState(0),
      [i, n] = r.useState(4),
      [o, s] = r.useState([]),
      c = Math.ceil(Ra.length / 4);
    r.useEffect(() => {
      s(Ra.slice(l, i));
    }, [l, i]);
    return V(Le, {
      children: [
        H(Z, { pageName: "Setting Salary Deduction " }),
        H(a, {
          to: "/admin/transaksi/setting-potongan-gaji/form-setting-potongan-gaji",
          children: V(Y, {
            children: [
              H("span", { children: "Add Salary" }),
              H("span", { children: H(T, {}) }),
            ],
          }),
        }),
        V("div", {
          className:
            "rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6",
          children: [
            H("div", {
              className:
                "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
              children: V("div", {
                className: "relative flex-2 mb-4 md:mb-0",
                children: [
                  H("input", {
                    type: "text",
                    placeholder: "Type to search..",
                    className:
                      "rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0",
                  }),
                  H("span", {
                    className: "absolute left-2 py-3 text-xl",
                    children: H(k, {}),
                  }),
                ],
              }),
            }),
            H("div", {
              className: "max-w-full overflow-x-auto py-4",
              children: V("table", {
                className: "w-full table-auto",
                children: [
                  H("thead", {
                    children: V("tr", {
                      className: "bg-gray-2 text-left dark:bg-meta-4",
                      children: [
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Salary Deduction",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Attendance",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Actions",
                        }),
                      ],
                    }),
                  }),
                  H("tbody", {
                    children: o.map((e) =>
                      V(
                        "tr",
                        {
                          children: [
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.potonganGaji,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.jumlahPotongan,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: V("div", {
                                className: "flex items-center space-x-3.5",
                                children: [
                                  H("button", {
                                    className: "hover:text-black",
                                    children: H(F, {
                                      className:
                                        "text-primary text-xl hover:text-black dark:hover:text-white",
                                    }),
                                  }),
                                  H("button", {
                                    className: "hover:text-black",
                                    children: H(O, {
                                      className:
                                        "text-danger text-xl hover:text-black dark:hover:text-white",
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          ],
                        },
                        e.id
                      )
                    ),
                  }),
                ],
              }),
            }),
            V("div", {
              className:
                "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
              children: [
                H("div", {
                  className: "flex items-center space-x-2",
                  children: V("span", {
                    className: "text-gray-5 dark:text-gray-4 text-sm py-4",
                    children: [
                      "Showing ",
                      l,
                      "-",
                      i,
                      " of ",
                      Ra.length,
                      " Setting Salary Deduction",
                    ],
                  }),
                }),
                V("div", {
                  className: "flex space-x-2 py-4",
                  children: [
                    H("button", {
                      disabled: 1 === e,
                      onClick: () => {
                        e > 1 &&
                          (t((e) => e - 1), d((e) => e - 4), n((e) => e - 4));
                      },
                      className:
                        "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                      children: "Prev",
                    }),
                    [...Array(Math.min(c, 5))].map((a, r) => {
                      const t = r + 1;
                      return t === e
                        ? H(
                            "div",
                            {
                              className:
                                "py-2 px-4 rounded-lg border border-primary bg-primary text-white font-semibold hover:bg-primary dark:text-white dark:bg-primary dark:hover:bg-primary",
                              children: t,
                            },
                            r
                          )
                        : (2 === t && e > 4) || (t === c - 1 && e < c - 3)
                        ? H(
                            "p",
                            {
                              className:
                                "py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white",
                              children: "...",
                            },
                            r
                          )
                        : 1 === t || t === c || (t >= e - 1 && t <= e + 1)
                        ? H(
                            "div",
                            {
                              className:
                                "py-2 px-4 rounded-lg border border-gray-2 text-black dark:bg-transparent bg-gray font-medium dark:border-strokedark dark:text-white",
                              children: t,
                            },
                            r
                          )
                        : null;
                    }),
                    H("button", {
                      disabled: e === c,
                      onClick: () => {
                        e < c &&
                          (t((e) => e + 1), d((e) => e + 4), n((e) => e + 4));
                      },
                      className:
                        "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                      children: "Next",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  Aa = () => {
    const { loanId: e } = I(),
      { state: a, dispatch: t } = ue(),
      [l, d] = r.useState(!0),
      [i, n] = r.useState(null),
      [o, s] = r.useState(null),
      [c, m] = r.useState([]),
      [p, h] = r.useState(!1),
      [b, x] = r.useState(null),
      [k, f] = r.useState({ amount: "", date: "", image: null, comments: "" }),
      [g, y] = r.useState(1),
      [v, w] = r.useState(0),
      [N, C] = r.useState(5);
    r.useEffect(() => {
      e &&
        (async () => {
          try {
            d(!0);
            const a = await Pe(Ue(e));
            n(a.data);
            const r = await Pe(Fe(a.data.customer_id));
            s(r.data);
            const t = await Pe(Be(e));
            m(t.data);
          } catch (a) {
            u.error("Failed to fetch loan details"),
              console.error("Error fetching loan details:", a);
          } finally {
            d(!1);
          }
        })();
    }, [e]);
    const S = [
        {
          title: "Total Amount Paid",
          amount: `₹${
            null == c
              ? void 0
              : c.reduce((e, a) => e + parseFloat(a.amount), 0).toFixed(2)
          }`,
          bgColor: "bg-success/10",
          textColor: "text-success",
        },
        {
          title: "Balance Remaining",
          amount: `₹${(null == i ? void 0 : i.remaining_balance) || 0}`,
          bgColor: "bg-danger/10",
          textColor: "text-danger",
        },
        {
          title: "Total Interest",
          amount: `₹${(
            0.1 * parseFloat((null == i ? void 0 : i.loan_amount) || 0)
          ).toFixed(2)}`,
          bgColor: "bg-warning/10",
          textColor: "text-warning",
        },
      ],
      j = () => {
        f({
          amount: "",
          date: "",
          image: null,
          comments: "",
          transaction_type: "credit",
        });
        const e = document.querySelector('input[type="file"]');
        e && (e.value = "");
      },
      E = ({ transaction: e, onClose: a }) =>
        H("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",
          children: V("div", {
            className:
              "relative w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-boxdark",
            children: [
              H("button", {
                onClick: a,
                className:
                  "absolute right-4 top-4 text-gray-500 hover:text-gray-700",
                children: H("svg", {
                  className: "h-6 w-6",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: H("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    d: "M6 18L18 6M6 6l12 12",
                  }),
                }),
              }),
              H("h3", {
                className: "mb-4 text-xl font-semibold",
                children: "Transaction Receipt",
              }),
              V("div", {
                className: "space-y-4",
                children: [
                  V("div", {
                    children: [
                      V("p", {
                        className: "text-sm font-medium",
                        children: ["Transaction ID: ", e.id],
                      }),
                      V("p", {
                        className: "text-sm font-medium",
                        children: ["Date: ", e.date],
                      }),
                      V("p", {
                        className: "text-sm font-medium",
                        children: ["Amount: $", e.amount],
                      }),
                      V("p", {
                        className: "text-sm font-medium",
                        children: ["Comments: ", e.comments],
                      }),
                    ],
                  }),
                  H("div", {
                    className: "flex justify-center",
                    children: H("img", {
                      src: e.receipt,
                      alt: "Receipt",
                      className: "max-h-[500px] rounded-lg object-contain",
                    }),
                  }),
                ],
              }),
            ],
          }),
        });
    return l
      ? H(Le, {
          children: H("div", {
            className: "flex items-center justify-center min-h-screen",
            children: H("div", {
              className:
                "animate-spin rounded-full h-12 w-12 border-b-2 border-primary",
            }),
          }),
        })
      : V(Le, {
          children: [
            H(Z, { pageName: "Loan Details" }),
            H("div", {
              className: "mb-6 grid grid-cols-1 gap-4 md:grid-cols-3",
              children: S.map((e, a) =>
                V(
                  "div",
                  {
                    className: `rounded-lg p-4 ${e.bgColor}`,
                    children: [
                      H("h3", {
                        className: "text-sm font-medium",
                        children: e.title,
                      }),
                      H("p", {
                        className: `text-2xl font-bold ${e.textColor}`,
                        children: e.amount,
                      }),
                    ],
                  },
                  a
                )
              ),
            }),
            V("div", {
              className: "grid grid-cols-1 gap-6 md:grid-cols-2",
              children: [
                V("div", {
                  className:
                    "rounded-lg bg-white p-6 shadow-default dark:bg-boxdark",
                  children: [
                    H("h2", {
                      className: "mb-4 text-xl font-semibold",
                      children: "Customer Details",
                    }),
                    V("div", {
                      className: "space-y-4",
                      children: [
                        V("div", {
                          children: [
                            H("label", {
                              className: "mb-1 block text-sm font-medium",
                              children: "Customer ID",
                            }),
                            H("input", {
                              type: "text",
                              className:
                                "w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                              value: (null == o ? void 0 : o.user_id) || "",
                              disabled: !0,
                            }),
                          ],
                        }),
                        V("div", {
                          children: [
                            H("label", {
                              className: "mb-1 block text-sm font-medium",
                              children: "Customer Name",
                            }),
                            H("input", {
                              type: "text",
                              className:
                                "w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                              value: (null == o ? void 0 : o.username) || "",
                              disabled: !0,
                            }),
                          ],
                        }),
                        V("div", {
                          children: [
                            H("label", {
                              className: "mb-1 block text-sm font-medium",
                              children: "Email",
                            }),
                            H("input", {
                              type: "text",
                              className:
                                "w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                              value: (null == o ? void 0 : o.email) || "",
                              disabled: !0,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                V("div", {
                  className:
                    "rounded-lg bg-white p-6 shadow-default dark:bg-boxdark",
                  children: [
                    H("h2", {
                      className: "mb-4 text-xl font-semibold",
                      children: "Loan Details",
                    }),
                    V("div", {
                      className: "space-y-4",
                      children: [
                        V("div", {
                          children: [
                            H("label", {
                              className: "mb-1 block text-sm font-medium",
                              children: "Loan ID",
                            }),
                            H("input", {
                              type: "text",
                              className:
                                "w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                              value: (null == i ? void 0 : i.loan_id) || "",
                              disabled: !0,
                            }),
                          ],
                        }),
                        V("div", {
                          children: [
                            H("label", {
                              className: "mb-1 block text-sm font-medium",
                              children: "Loan Amount",
                            }),
                            H("input", {
                              type: "text",
                              className:
                                "w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                              value: `₹${
                                (null == i ? void 0 : i.loan_amount) || 0
                              }`,
                              disabled: !0,
                            }),
                          ],
                        }),
                        V("div", {
                          children: [
                            H("label", {
                              className: "mb-1 block text-sm font-medium",
                              children: "Status",
                            }),
                            H("input", {
                              type: "text",
                              className:
                                "w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                              value: (null == i ? void 0 : i.status) || "",
                              disabled: !0,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            V("div", {
              className:
                "mt-6 rounded-lg bg-white p-6 shadow-default dark:bg-boxdark",
              children: [
                H("h2", {
                  className: "mb-4 text-xl font-semibold",
                  children: "Add Transaction",
                }),
                H("form", {
                  onSubmit: async (r) => {
                    var t, l;
                    r.preventDefault();
                    const d = u.loading("Adding transaction...");
                    try {
                      const r = new FormData();
                      r.append("loan_id", e),
                        r.append("customer_id", a.user.user_id),
                        r.append("amount", k.amount),
                        r.append("transaction_type", "credit"),
                        r.append("date", k.date),
                        r.append("comments", k.comments),
                        k.image && r.append("receipt", k.image),
                        await Me(qe, r, {
                          headers: { "Content-Type": "multipart/form-data" },
                        }),
                        await (async () => {
                          try {
                            const [a, r] = await Promise.all([
                              Pe(Be(e)),
                              Pe(Ue(e)),
                            ]);
                            m(a.data), n(r.data), y(1), w(0), C(5);
                          } catch (a) {
                            console.error("Error refreshing data:", a),
                              u.error("Failed to refresh transaction data");
                          }
                        })(),
                        j(),
                        u.success("Transaction added successfully", { id: d });
                    } catch (i) {
                      console.error("Transaction error:", i),
                        u.error(
                          (null ==
                          (l = null == (t = i.response) ? void 0 : t.data)
                            ? void 0
                            : l.message) || "Failed to add transaction",
                          { id: d }
                        );
                    }
                  },
                  id: "transactionForm",
                  children: V("div", {
                    className: "grid grid-cols-1 gap-6 md:grid-cols-2",
                    children: [
                      V("div", {
                        children: [
                          H("label", {
                            className: "mb-1 block text-sm font-medium",
                            children: "Amount",
                          }),
                          H("input", {
                            type: "number",
                            className:
                              "w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                            value: k.amount,
                            onChange: (e) =>
                              f({ ...k, amount: e.target.value }),
                            required: !0,
                          }),
                        ],
                      }),
                      V("div", {
                        children: [
                          H("label", {
                            className: "mb-1 block text-sm font-medium",
                            children: "Date",
                          }),
                          H("input", {
                            type: "date",
                            className:
                              "w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                            value: k.date,
                            onChange: (e) => f({ ...k, date: e.target.value }),
                            required: !0,
                          }),
                        ],
                      }),
                      V("div", {
                        children: [
                          H("label", {
                            className: "mb-1 block text-sm font-medium",
                            children: "Upload Receipt",
                          }),
                          H("input", {
                            type: "file",
                            className:
                              "w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                            onChange: (e) =>
                              f({ ...k, image: e.target.files[0] }),
                            accept: "image/*",
                          }),
                        ],
                      }),
                      V("div", {
                        children: [
                          H("label", {
                            className: "mb-1 block text-sm font-medium",
                            children: "Comments",
                          }),
                          H("input", {
                            type: "text",
                            className:
                              "w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input",
                            value: k.comments,
                            onChange: (e) =>
                              f({ ...k, comments: e.target.value }),
                          }),
                        ],
                      }),
                      V("div", {
                        className: "md:col-span-2 flex gap-4",
                        children: [
                          H(Y, { type: "submit", children: "Add Transaction" }),
                          H(Y, {
                            type: "button",
                            onClick: j,
                            children: "Reset Form",
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
            V("div", {
              className:
                "mt-6 rounded-lg bg-white p-6 shadow-default dark:bg-boxdark",
              children: [
                H("h2", {
                  className: "mb-4 text-xl font-semibold",
                  children: "Transaction History",
                }),
                H("div", {
                  className: "overflow-x-auto",
                  children: V("table", {
                    className: "w-full",
                    children: [
                      H("thead", {
                        children: V("tr", {
                          className: "bg-gray-2 dark:bg-meta-4",
                          children: [
                            H("th", {
                              className: "px-4 py-4 text-left",
                              children: "Transaction ID",
                            }),
                            H("th", {
                              className: "px-4 py-4 text-left",
                              children: "Date",
                            }),
                            H("th", {
                              className: "px-4 py-4 text-left",
                              children: "Amount",
                            }),
                            H("th", {
                              className: "px-4 py-4 text-left",
                              children: "Receipt",
                            }),
                            H("th", {
                              className: "px-4 py-4 text-left",
                              children: "Comments",
                            }),
                          ],
                        }),
                      }),
                      H("tbody", {
                        children: c.slice(v, N).map((e, a) =>
                          V(
                            "tr",
                            {
                              children: [
                                H("td", {
                                  className:
                                    "border-b border-[#eee] px-4 py-4 dark:border-strokedark",
                                  children: e.id,
                                }),
                                H("td", {
                                  className:
                                    "border-b border-[#eee] px-4 py-4 dark:border-strokedark",
                                  children: e.date,
                                }),
                                V("td", {
                                  className:
                                    "border-b border-[#eee] px-4 py-4 dark:border-strokedark",
                                  children: ["₹", e.amount],
                                }),
                                H("td", {
                                  className:
                                    "border-b border-[#eee] px-4 py-4 dark:border-strokedark",
                                  children: H("button", {
                                    className: "text-primary hover:underline",
                                    onClick: () => {
                                      x(e), h(!0);
                                    },
                                    children: "View Receipt",
                                  }),
                                }),
                                H("td", {
                                  className:
                                    "border-b border-[#eee] px-4 py-4 dark:border-strokedark",
                                  children: e.comments,
                                }),
                              ],
                            },
                            e.id || a
                          )
                        ),
                      }),
                    ],
                  }),
                }),
                V("div", {
                  className: "mt-4 flex items-center justify-between",
                  children: [
                    H("button", {
                      onClick: () => {
                        g > 1 &&
                          (y((e) => e - 1), w((e) => e - 5), C((e) => e - 5));
                      },
                      disabled: 1 === g,
                      className:
                        "rounded-lg border border-primary px-4 py-2 text-primary hover:bg-primary hover:text-white disabled:opacity-50",
                      children: "Previous",
                    }),
                    V("span", {
                      children: ["Page ", g, " of ", Math.ceil(c.length / 5)],
                    }),
                    H("button", {
                      onClick: () => {
                        g < Math.ceil(c.length / 5) &&
                          (y((e) => e + 1), w((e) => e + 5), C((e) => e + 5));
                      },
                      disabled: g === Math.ceil(c.length / 5),
                      className:
                        "rounded-lg border border-primary px-4 py-2 text-primary hover:bg-primary hover:text-white disabled:opacity-50",
                      children: "Next",
                    }),
                  ],
                }),
              ],
            }),
            p && H(E, { transaction: b, onClose: () => h(!1) }),
          ],
        });
  },
  Pa = ({ children: e }) => {
    const [a, t] = r.useState(!1);
    return H("div", {
      className: "dark:bg-boxdark-2 dark:text-bodydark",
      children: V("div", {
        className: "flex h-screen overflow-hidden",
        children: [
          H(aa, { sidebarOpen: a, setSidebarOpen: t }),
          V("div", {
            className:
              "relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden",
            children: [
              H(Ke, { sidebarOpen: a, setSidebarOpen: t }),
              H("main", {
                children: H("div", {
                  className: "mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10",
                  children: e,
                }),
              }),
              H(Re, {}),
            ],
          }),
        ],
      }),
    });
  },
  Ma = () =>
    V(Pa, {
      children: [
        H(W, { pageName: "Dashboard" }),
        H("div", {
          className: "mt-6",
          children: H("h2", {
            className:
              "px-4 py-2 text-meta-3 font-medium text-center md:text-left",
            children: "Selamat Datang, Anda Login Sebagai Employee.",
          }),
        }),
        H("div", {
          className: "py-2 px-4 md:px-6 dark:border-strokedark text-lg",
          children: H("h3", {
            className:
              "font-medium text-black dark:text-white text-center md:text-left",
            children: "Employee Data",
          }),
        }),
        V("div", {
          className:
            "flex flex-col md:flex-row rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-2",
          children: [
            H("div", {
              className:
                "md:w-1/3 w-full px-4 py-4 flex justify-center md:justify-start",
              children: H("img", {
                className: "rounded-xl h-80 w-full md:w-80 object-cover",
                src: je,
                alt: "Gilbert Hutapea",
              }),
            }),
            H("div", {
              className: "md:w-2/3 px-4 md:px-20 py-4 md:py-20",
              children: V("div", {
                className: "w-full md:text-lg",
                children: [
                  V("h2", {
                    className:
                      "font-medium mb-4 block text-black dark:text-white",
                    children: [
                      H("span", {
                        className: "inline-block w-32 md:w-40",
                        children: "Employee Name ",
                      }),
                      H("span", {
                        className: "inline-block w-7",
                        children: ":",
                      }),
                      " Gilbert Hutapea",
                    ],
                  }),
                  V("h2", {
                    className:
                      "font-medium mb-4 block text-black dark:text-white",
                    children: [
                      H("span", {
                        className: "inline-block w-32 md:w-40",
                        children: "Position",
                      }),
                      H("span", {
                        className: "inline-block w-7",
                        children: ":",
                      }),
                      " ",
                      H("span", {
                        className: "pl-[-10] md:pl-0",
                        children: "FullStack Developer",
                      }),
                    ],
                  }),
                  V("h2", {
                    className:
                      "font-medium mb-4 block text-black dark:text-white",
                    children: [
                      H("span", {
                        className: "inline-block w-32 md:w-40",
                        children: "Date of Joining",
                      }),
                      H("span", {
                        className: "inline-block w-7",
                        children: ":",
                      }),
                      " 15-01-2023",
                    ],
                  }),
                  V("h2", {
                    className:
                      "font-medium mb-4 block text-black dark:text-white",
                    children: [
                      H("span", {
                        className: "inline-block w-32 md:w-40",
                        children: "Status",
                      }),
                      H("span", {
                        className: "inline-block w-7",
                        children: ":",
                      }),
                      H("span", {
                        className: "pl-[-8] md:pl-0",
                        children: " Permanent Employee",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
      ],
    }),
  _a = [
    {
      id: 1,
      bulanTahun: "01/2023",
      gajiPokok: "Rp. 4.000.000",
      ransportationAllowance: "Rp. 600.000",
      uangMakan: "Rp. 400.000",
      jumlahPotongan: "Rp. 100.000",
      totalGaji: "Rp. 5.900.000",
    },
    {
      id: 2,
      bulanTahun: "02/2023",
      gajiPokok: "Rp. 2.500.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 0",
      totalGaji: "Rp. 3.000.000",
    },
    {
      id: 3,
      bulanTahun: "03/2023",
      gajiPokok: "Rp. 2.200.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 100.000",
      totalGaji: "Rp. 2.600.000",
    },
    {
      id: 4,
      bulanTahun: "04/2023",
      gajiPokok: "Rp. 2.500.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 0",
      totalGaji: "Rp. 3.000.000",
    },
    {
      id: 5,
      bulanTahun: "05/2023",
      gajiPokok: "Rp. 2.500.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 100.000",
      totalGaji: "Rp. 2.900.000",
    },
    {
      id: 6,
      bulanTahun: "06/2023",
      gajiPokok: "Rp. 2.200.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 0",
      totalGaji: "Rp. 2.700.000",
    },
    {
      id: 7,
      bulanTahun: "07/2023",
      gajiPokok: "Rp. 2.500.000",
      ransportationAllowance: "Rp. 300.000",
      uangMakan: "Rp. 200.000",
      jumlahPotongan: "Rp. 100.000",
      totalGaji: "Rp. 2.900.000",
    },
    {
      id: 8,
      bulanTahun: "08/2023",
      gajiPokok: "Rp. 4.000.000",
      ransportationAllowance: "Rp. 600.000",
      uangMakan: "Rp. 400.000",
      jumlahPotongan: "Rp. 0",
      totalGaji: "Rp. 6.000.000",
    },
  ],
  Da = () => {
    const [e, a] = r.useState(1),
      [t, l] = r.useState(0),
      [d, i] = r.useState(4),
      [n, o] = r.useState([]),
      s = Math.ceil(_a.length / 4);
    r.useEffect(() => {
      o(_a.slice(t, d));
    }, [t, d]);
    return V(Pa, {
      children: [
        H(W, { pageName: "Salary Data " }),
        V("div", {
          className:
            "rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6",
          children: [
            H("div", {
              className: "max-w-full overflow-x-auto py-4",
              children: V("table", {
                className: "w-full table-auto",
                children: [
                  H("thead", {
                    children: V("tr", {
                      className: "bg-gray-2 text-left dark:bg-meta-4",
                      children: [
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Bulan/Tahun",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Basic Salary",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Tansportation Allowanceasi",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Meal Money",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Salary",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Total Salary",
                        }),
                        H("th", {
                          className:
                            "py-4 px-4 font-medium text-black dark:text-white",
                          children: "Cetak Slip",
                        }),
                      ],
                    }),
                  }),
                  H("tbody", {
                    children: n.map((e) =>
                      V(
                        "tr",
                        {
                          children: [
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.bulanTahun,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.gajiPokok,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.ransportationAllowance,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.uangMakan,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.jumlahPotongan,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark",
                              children: H("p", {
                                className: "text-black dark:text-white",
                                children: e.totalGaji,
                              }),
                            }),
                            H("td", {
                              className:
                                "border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center",
                              children: H("div", {
                                className: "items-center ",
                                children: H("button", {
                                  className: "hover:text-black",
                                  children: H(C, {
                                    className:
                                      "text-primary text-xl hover:text-black dark:hover:text-white",
                                  }),
                                }),
                              }),
                            }),
                          ],
                        },
                        e.id
                      )
                    ),
                  }),
                ],
              }),
            }),
            V("div", {
              className:
                "flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between",
              children: [
                H("div", {
                  className: "flex items-center space-x-2",
                  children: V("span", {
                    className: "text-gray-5 dark:text-gray-4 text-sm py-4",
                    children: [
                      "Showing ",
                      t,
                      "-",
                      d,
                      " of ",
                      _a.length,
                      " Salary Data",
                    ],
                  }),
                }),
                V("div", {
                  className: "flex space-x-2 py-4",
                  children: [
                    H("button", {
                      disabled: 1 === e,
                      onClick: () => {
                        e > 1 &&
                          (a((e) => e - 1), l((e) => e - 4), i((e) => e - 4));
                      },
                      className:
                        "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                      children: "Prev",
                    }),
                    [...Array(Math.min(s, 5))].map((a, r) => {
                      const t = r + 1;
                      return t === e
                        ? H(
                            "div",
                            {
                              className:
                                "py-2 px-4 rounded-lg border border-primary bg-primary text-white font-semibold hover:bg-primary dark:text-white dark:bg-primary dark:hover:bg-primary",
                              children: t,
                            },
                            r
                          )
                        : (2 === t && e > 4) || (t === s - 1 && e < s - 3)
                        ? H(
                            "p",
                            {
                              className:
                                "py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white",
                              children: "...",
                            },
                            r
                          )
                        : 1 === t || t === s || (t >= e - 1 && t <= e + 1)
                        ? H(
                            "div",
                            {
                              className:
                                "py-2 px-4 rounded-lg border border-gray-2 text-black dark:bg-transparent bg-gray font-medium dark:border-strokedark dark:text-white",
                              children: t,
                            },
                            r
                          )
                        : null;
                    }),
                    H("button", {
                      disabled: e === s,
                      onClick: () => {
                        e < s &&
                          (a((e) => e + 1), l((e) => e + 4), i((e) => e + 4));
                      },
                      className:
                        "py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50",
                      children: "Next",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  Ta = () => {
    b(), ue();
    return V("div", {
      className: "min-h-screen bg-white dark:bg-boxdark",
      children: [
        V("div", {
          className: "flex flex-wrap items-center min-h-screen",
          children: [
            H("div", {
              className: "hidden w-full xl:block xl:w-1/2",
              children: V("div", {
                className: "py-18.5 px-26 text-center",
                children: [
                  V("span", {
                    className: "mb-5.5 inline-block",
                    children: [
                      H("img", {
                        className: "hidden dark:block",
                        src: "/assets/logo-500eb1a0.svg",
                        alt: "Logo",
                      }),
                      H("img", {
                        className: "dark:hidden",
                        src: Xe,
                        alt: "Logo",
                      }),
                    ],
                  }),
                  H("p", {
                    className: "2xl:px-20",
                    children: "Welcome back! Please login to continue.",
                  }),
                  H("img", {
                    className: "mt-15 inline-block",
                    src: "/assets/login-2ceea3dc.svg",
                    alt: "Login",
                  }),
                ],
              }),
            }),
            H("div", {
              className:
                "w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2",
              children: V("div", {
                className: "w-full p-4 sm:p-12.5 xl:p-17.5",
                children: [
                  H("h2", {
                    className:
                      "mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2",
                    children: "Employee to  Login",
                  }),
                  V("form", {
                    onSubmit: (e) => {
                      e.preventDefault();
                    },
                    children: [
                      V("div", {
                        className: "mb-4",
                        children: [
                          H("label", {
                            className:
                              "mb-2.5 block font-medium text-black dark:text-white",
                            children: "Username",
                          }),
                          V("div", {
                            className: "relative",
                            children: [
                              H("input", {
                                type: "username",
                                placeholder: "Enter your username",
                                className:
                                  "w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                              H(_, {
                                className: "absolute right-4 top-4 text-xl",
                              }),
                            ],
                          }),
                        ],
                      }),
                      V("div", {
                        className: "mb-6",
                        children: [
                          H("label", {
                            className:
                              "mb-2.5 block font-medium text-black dark:text-white",
                            children: "Password",
                          }),
                          V("div", {
                            className: "relative",
                            children: [
                              H("input", {
                                type: "password",
                                placeholder: "Enter your password",
                                className:
                                  "w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                              H(D, {
                                className: "absolute right-4 top-4 text-xl",
                              }),
                            ],
                          }),
                        ],
                      }),
                      H("div", {
                        className: "mb-5",
                        children: H(a, {
                          to: "/pegawai/dashboard",
                          children: H("input", {
                            type: "submit",
                            value: "Login",
                            className:
                              "w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90",
                          }),
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
        H("div", {
          className: "border-t border-stroke dark:border-strokedark",
          children: H("div", {
            className: "container mx-auto",
            children: H(sa, { type: "staff" }),
          }),
        }),
        H("footer", {
          className:
            "bg-white dark:bg-boxdark py-4 border-t border-stroke dark:border-strokedark",
          children: H("div", {
            className:
              "container mx-auto px-4 text-center text-gray-600 dark:text-gray-400",
            children: H("p", {
              children: "© 2024 Raghav Elite Projects. All rights reserved.",
            }),
          }),
        }),
      ],
    });
  },
  Fa = () =>
    V(Pa, {
      children: [
        H(W, { pageName: "Change Password Form" }),
        H("div", {
          className: "sm:grid-cols-2",
          children: H("div", {
            className: "flex flex-col gap-9",
            children: V("div", {
              className:
                "rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
              children: [
                H("div", {
                  className:
                    "border-b border-stroke py-4 px-6.5 dark:border-strokedark",
                  children: H("h3", {
                    className: "font-medium text-black dark:text-white",
                    children: "Change Password Form",
                  }),
                }),
                H("form", {
                  action: "#",
                  children: V("div", {
                    className: "p-6.5",
                    children: [
                      V("div", {
                        className: "mb-4.5 ",
                        children: [
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-4 block text-black dark:text-white",
                                children: [
                                  "New Password ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "password",
                                placeholder: "Enter new password",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                            ],
                          }),
                          V("div", {
                            className: "w-full mb-4",
                            children: [
                              V("label", {
                                className:
                                  "mb-4 block text-black dark:text-white",
                                children: [
                                  "Repeat New Password ",
                                  H("span", {
                                    className: "text-meta-1",
                                    children: "*",
                                  }),
                                ],
                              }),
                              H("input", {
                                type: "password",
                                placeholder: "Re-enter new password",
                                className:
                                  "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                              }),
                              H(D, {
                                className: "absolute right-4 top-4 text-xl",
                              }),
                            ],
                          }),
                        ],
                      }),
                      H("div", {
                        className:
                          "flex flex-col md:flex-row w-full gap-3 text-center",
                        children: H(a, {
                          to: "",
                          children: H(Y, {
                            children: H("span", { children: "Save" }),
                          }),
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      ],
    }),
  Oa = () =>
    V($, {
      children: [
        H(J, { exact: !0, path: "/admin/login", element: H(fa, {}) }),
        H(J, { exact: !0, path: "/", element: H(fa, {}) }),
        H(J, { exact: !0, path: "/admin/dashboard", element: H(ta, {}) }),
        H(J, { path: "/admin/master-data/data-pegawai", element: H(wa, {}) }),
        H(J, {
          path: "/admin/master-data/data-pegawai/form-data-pegawai",
          element: H(Ve, {}),
        }),
        H(J, { path: "/admin/master-data/data-jabatan", element: H(ya, {}) }),
        H(J, {
          path: "/admin/master-data/data-jabatan/form-data-jabatan",
          element: H(He, {}),
        }),
        H(J, { path: "/admin/transaksi/data-absensi", element: H(Sa, {}) }),
        H(J, {
          path: "/admin/transaksi/setting-potongan-gaji",
          element: H(La, {}),
        }),
        H(J, {
          path: "/admin/transaksi/setting-potongan-gaji/form-setting-potongan-gaji",
          element: H(Ze, {}),
        }),
        H(J, { path: "/admin/transaksi/data-gaji", element: H(Ea, {}) }),
        H(J, { path: "/admin/laporan/laporan-gaji", element: H(da, {}) }),
        H(J, { path: "/admin/laporan/laporan-absensi", element: H(la, {}) }),
        H(J, { path: "/admin/laporan/slip-gaji", element: H(ia, {}) }),
        H(J, { path: "/admin/pengaturan/ubah-password", element: H(Na, {}) }),
        H(J, { exact: !0, path: "/pegawai/login", element: H(Ta, {}) }),
        H(J, { exact: !0, path: "/pegawai/dashboard", element: H(Ma, {}) }),
        H(J, { exact: !0, path: "/pegawai/data-gaji", element: H(Da, {}) }),
        H(J, {
          exact: !0,
          path: "/pegawai/pengaturan/ubah-password",
          element: H(Fa, {}),
        }),
        H(J, { exact: !0, path: "*", element: H(ra, {}) }),
        H(J, { path: "/admin/lending/:loanId", element: H(Aa, {}) }),
        H(J, {
          path: "/admin/master-data/lending/add-lending",
          element: H(He, {}),
        }),
        H(J, {
          path: "/admin/master-data/lending/edit/:loanId",
          element: H(He, {}),
        }),
      ],
    });
function za() {
  const [e, a] = r.useState(!0),
    t = document.getElementById("preloader");
  return (
    t &&
      setTimeout(() => {
        (t.style.display = "none"), a(!1);
      }, 2e3),
    r.useEffect(() => {
      setTimeout(() => a(!1), 1e3);
    }, []),
    !e && H(be, { children: H(Oa, {}) })
  );
}
U.createRoot(document.getElementById("root")).render(
  H(t.StrictMode, { children: H(B, { children: H(za, {}) }) })
);
