import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MusicSchool from './pages/MusicSchool';
import JiuJitsu from './pages/JiuJitsu';
import MensGroup from './pages/MensGroup';
import Users from './pages/Users';
import Members from './pages/Members';
import ChildPresentations from './pages/ChildPresentations';
import MusicSchoolPreRegistration from './pages/MusicSchoolPreRegistration';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { authService } from './services/authService';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e40af', // Azul principal
      light: '#3b82f6', // Azul claro
      dark: '#1e3a8a', // Azul escuro
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0ea5e9', // Azul céu
      light: '#38bdf8',
      dark: '#0284c7',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#f8fafc',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    success: {
      main: '#0891b2', // Azul teal
    },
    warning: {
      main: '#0284c7', // Azul médio
    },
    error: {
      main: '#dc2626',
    },
    info: {
      main: '#0ea5e9', // Azul céu
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
  },
  shape: {
    borderRadius: 0,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(10, 22, 40, 0.1)',
    '0 4px 6px rgba(10, 22, 40, 0.15)',
    '0 10px 15px rgba(10, 22, 40, 0.2)',
    '0 20px 25px rgba(10, 22, 40, 0.25)',
    '0 2px 4px rgba(10, 22, 40, 0.1)',
    '0 4px 6px rgba(10, 22, 40, 0.15)',
    '0 10px 15px rgba(10, 22, 40, 0.2)',
    '0 20px 25px rgba(10, 22, 40, 0.25)',
    '0 2px 4px rgba(10, 22, 40, 0.1)',
    '0 4px 6px rgba(10, 22, 40, 0.15)',
    '0 10px 15px rgba(10, 22, 40, 0.2)',
    '0 20px 25px rgba(10, 22, 40, 0.25)',
    '0 2px 4px rgba(10, 22, 40, 0.1)',
    '0 4px 6px rgba(10, 22, 40, 0.15)',
    '0 10px 15px rgba(10, 22, 40, 0.2)',
    '0 20px 25px rgba(10, 22, 40, 0.25)',
    '0 2px 4px rgba(10, 22, 40, 0.1)',
    '0 4px 6px rgba(10, 22, 40, 0.15)',
    '0 10px 15px rgba(10, 22, 40, 0.2)',
    '0 20px 25px rgba(10, 22, 40, 0.25)',
    '0 2px 4px rgba(10, 22, 40, 0.1)',
    '0 4px 6px rgba(10, 22, 40, 0.15)',
    '0 10px 15px rgba(10, 22, 40, 0.2)',
    '0 20px 25px rgba(10, 22, 40, 0.25)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 0,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(10, 22, 40, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(10, 22, 40, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(10, 22, 40, 0.12)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(10, 22, 40, 0.15)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 2px 8px rgba(10, 22, 40, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(10, 22, 40, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/music-school/pre-registration" element={<MusicSchoolPreRegistration />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="music-school" element={<MusicSchool />} />
            <Route path="jiu-jitsu" element={<JiuJitsu />} />
            <Route path="mens-group" element={<MensGroup />} />
            <Route path="members" element={<Members />} />
            <Route path="child-presentations" element={<ChildPresentations />} />
            {authService.isAdmin() && <Route path="users" element={<Users />} />}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
