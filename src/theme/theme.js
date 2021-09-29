import { createMuiTheme } from "@material-ui/core";

const primary = "#5E72E4";
const secondary = "#5E72E4";

export default createMuiTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  palette: {
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
  },
  overrides: {
    MuiDialogActions: {
      root: {
        padding: "8px 24px 16px 24px",
      },
    },
    MuiButton: {
      root: {
        fontWeight: 600,
        textTransform: "none",
        color: secondary,
        padding: "6px 24px",
      },
      outlined: {
        borderRadius: "35px",
        borderColor: secondary,
        padding: "6px 20px",
      },
    },
    MuiSelect: {
      filled: {
        padding: "15px 0 15px 15px",
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: "white",
      },
      input: {
        height: "49px",
        padding: "0px 0 0 10px",
        backgroundColor: "white",
      },
    },
  },
});
