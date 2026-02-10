import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { userService, UserDto } from '../services/userService';

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserDto>({
    name: '',
    email: '',
    password: '',
    role: 'User',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Erro ao carregar lista de usuários. Verifique sua conexão.');
      }
    }
  };

  const handleOpen = (user?: UserDto) => {
    if (user) {
      setCurrentUser({ ...user, password: '' });
      setEditMode(true);
    } else {
      setCurrentUser({
        name: '',
        email: '',
        password: '',
        role: 'User',
      });
      setEditMode(false);
    }
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser({
      name: '',
      email: '',
      password: '',
      role: 'User',
    });
  };

  const handleSave = async () => {
    // Validação de campos obrigatórios
    const missingFields: string[] = [];
    if (!currentUser.name.trim()) missingFields.push('Nome');
    if (!currentUser.email.trim()) missingFields.push('Email');
    if (!editMode && (!currentUser.password || !currentUser.password.trim())) missingFields.push('Senha');
    if (!currentUser.role.trim()) missingFields.push('Perfil');

    if (missingFields.length > 0) {
      setError(`Por favor, preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentUser.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    // Validação de senha (apenas para novo usuário)
    if (!editMode && currentUser.password && currentUser.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (editMode && currentUser.id) {
        await userService.update(currentUser.id, currentUser);
      } else {
        await userService.create(currentUser);
      }
      await loadUsers();
      handleClose();
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Dados inválidos. Verifique os campos e tente novamente.');
      } else if (err.response?.status === 409) {
        setError('Já existe um usuário cadastrado com este email.');
      } else if (err.response?.status === 500) {
        setError('Erro no servidor. Tente novamente mais tarde.');
      } else {
        setError(err.response?.data?.message || 'Erro ao salvar usuário. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja desativar este usuário?')) {
      try {
        await userService.delete(id);
        await loadUsers();
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Usuário não encontrado.');
        } else if (err.response?.status === 500) {
          setError('Erro no servidor ao desativar usuário. Tente novamente.');
        } else {
          setError(err.response?.data?.message || 'Erro ao desativar usuário. Verifique sua conexão e tente novamente.');
        }
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Usuários</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Novo Usuário
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Função</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'Admin' ? 'error' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'Ativo' : 'Inativo'}
                    color={user.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user.id!)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum usuário cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={currentUser.name}
            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={currentUser.email}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            required
          />
          <TextField
            label={editMode ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
            type="password"
            fullWidth
            margin="normal"
            value={currentUser.password}
            onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
            required={!editMode}
          />
          <TextField
            select
            label="Função"
            fullWidth
            margin="normal"
            value={currentUser.role}
            onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
            required
          >
            <MenuItem value="User">Usuário</MenuItem>
            <MenuItem value="Admin">Administrador</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
