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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { jiuJitsuService, JiuJitsuStudent } from '../services/jiuJitsuService';

const JiuJitsu: React.FC = () => {
  const [students, setStudents] = useState<JiuJitsuStudent[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<JiuJitsuStudent>({
    name: '',
    email: '',
    phone: '',
    belt: 'Branca',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await jiuJitsuService.getAll();
      setStudents(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Erro ao carregar lista de alunos. Verifique sua conexão.');
      }
    }
  };

  const handleOpen = (student?: JiuJitsuStudent) => {
    if (student) {
      setCurrentStudent(student);
      setEditMode(true);
    } else {
      setCurrentStudent({
        name: '',
        email: '',
        phone: '',
        belt: 'Branca',
        notes: '',
      });
      setEditMode(false);
    }
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentStudent({
      name: '',
      email: '',
      phone: '',
      belt: 'Branca',
      notes: '',
    });
  };

  const handleSave = async () => {
    // Validação de campos obrigatórios
    const missingFields: string[] = [];
    if (!currentStudent.name.trim()) missingFields.push('Nome');
    if (!currentStudent.email.trim()) missingFields.push('Email');
    if (!currentStudent.phone.trim()) missingFields.push('Telefone');
    if (!currentStudent.belt.trim()) missingFields.push('Faixa');

    if (missingFields.length > 0) {
      setError(`Por favor, preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentStudent.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (editMode && currentStudent.id) {
        await jiuJitsuService.update(currentStudent.id, currentStudent);
      } else {
        await jiuJitsuService.create(currentStudent);
      }
      await loadStudents();
      handleClose();
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Dados inválidos. Verifique os campos e tente novamente.');
      } else if (err.response?.status === 409) {
        setError('Já existe um aluno cadastrado com este email.');
      } else if (err.response?.status === 500) {
        setError('Erro no servidor. Tente novamente mais tarde.');
      } else {
        setError(err.response?.data?.message || 'Erro ao salvar aluno. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await jiuJitsuService.delete(id);
        await loadStudents();
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Aluno não encontrado.');
        } else if (err.response?.status === 500) {
          setError('Erro no servidor ao excluir aluno. Tente novamente.');
        } else {
          setError(err.response?.data?.message || 'Erro ao excluir aluno. Verifique sua conexão e tente novamente.');
        }
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Escola de Jiu-Jitsu</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Novo Aluno
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
              <TableCell>Telefone</TableCell>
              <TableCell>Faixa</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.belt}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(student)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(student.id!)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum aluno cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Editar Aluno' : 'Novo Aluno'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={currentStudent.name}
            onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={currentStudent.email}
            onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
            required
          />
          <TextField
            label="Telefone"
            fullWidth
            margin="normal"
            value={currentStudent.phone}
            onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
            required
          />
          <TextField
            select
            label="Faixa"
            fullWidth
            margin="normal"
            value={currentStudent.belt}
            onChange={(e) => setCurrentStudent({ ...currentStudent, belt: e.target.value })}
            required
          >
            <MenuItem value="Branca">Branca</MenuItem>
            <MenuItem value="Azul">Azul</MenuItem>
            <MenuItem value="Roxa">Roxa</MenuItem>
            <MenuItem value="Marrom">Marrom</MenuItem>
            <MenuItem value="Preta">Preta</MenuItem>
          </TextField>
          <TextField
            label="Observações"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentStudent.notes || ''}
            onChange={(e) => setCurrentStudent({ ...currentStudent, notes: e.target.value })}
          />
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

export default JiuJitsu;
