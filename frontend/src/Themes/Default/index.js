const { createTheme } = require("@mui/material");

const theme = createTheme({
  components: {
    ChihuoTable: {
      styleOverrides: {
        root: {},
        "&.ChihuoTableHeader": {
          fontSize: 1,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Preferences-Button": {
            color: "#677684",
            padding: "8px 8px",
            height: "26px",
            borderRadius: 0,
            border: "1px solid #CECECE",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.Preferences-Input": {
            border: "1px solid #CECECE",
            padding: "8px 8px",
            height: "26px",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          "&.Preferences-Title": {
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
          },
        }),
      },
    },
  },
});

export default theme;
