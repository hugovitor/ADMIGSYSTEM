import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MusicSchool from './pages/MusicSchool';
import JiuJitsu from './pages/JiuJitsu';
import MensGroup from './pages/MensGroup';
import Users from './pages/Users';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { authService } from './services/authService';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0A1628',
      light: '#1E3A5F',
      dark: '#050B14',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    info: {
      main: '#3B82F6',
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
            {authService.isAdmin() && <Route path="users" element={<Users />} />}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
