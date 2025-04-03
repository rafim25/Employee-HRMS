module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"], // For the brand name
      },
      animation: {
        "bounce-slow": "bounce 3s infinite",
      },
      colors: {
        status: {
          warning: {
            light: '#FFF4DE',
            DEFAULT: '#FFA800',
          },
          info: {
            light: '#E1F0FF',
            DEFAULT: '#3699FF',
          },
          success: {
            light: '#E8FFF3',
            DEFAULT: '#1BC5BD',
          },
          primary: {
            light: '#EEE5FF',
            DEFAULT: '#8950FC',
          },
          danger: {
            light: '#FFE2E5',
            DEFAULT: '#F64E60',
          },
          gray: {
            light: '#F3F6F9',
            DEFAULT: '#B5B5C3',
          },
        },
      },
    },
  },
  // ... rest of your config
};
