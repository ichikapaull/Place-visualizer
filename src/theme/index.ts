import { createTheme } from '@mui/material/styles';

// Brand colors from brandingGuideline.md
const brandColors = {
  deepBlue: '#0A2540', // Koyu Mavi (Deep Blue) - Güven, otorite
  accentTeal: '#00C49F', // Vurgu Rengi (Accent Teal) - Modernlik, eylem
  neutralGray: '#425466', // Nötr Gri (Neutral Gray) - Metinler
  offWhite: '#F6F9FC', // Arka Plan (Off-White) - Temiz çalışma alanı
};

// Create MUI theme with brand colors and Inter font
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.deepBlue,
      contrastText: '#ffffff',
    },
    secondary: {
      main: brandColors.accentTeal,
      contrastText: '#ffffff',
    },
    background: {
      default: brandColors.offWhite,
      paper: '#ffffff',
    },
    text: {
      primary: brandColors.deepBlue,
      secondary: brandColors.neutralGray,
    },
    grey: {
      500: brandColors.neutralGray,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700, // Bold
      fontSize: '2rem', // 32px
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700, // Bold
      fontSize: '1.5rem', // 24px
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600, // Semi-bold
      fontSize: '1.125rem', // 18px
      lineHeight: 1.4,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400, // Regular
      fontSize: '1rem', // 16px
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400, // Regular
      fontSize: '0.875rem', // 14px
      lineHeight: 1.4,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500, // Medium
      textTransform: 'none', // Prevent ALL CAPS
    },
  },
  shape: {
    borderRadius: 6, // Slightly rounded corners (4-8px as per guidelines)
  },
  components: {
    // Customize MUI components to match brand guidelines
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 196, 159, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(10, 37, 64, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
