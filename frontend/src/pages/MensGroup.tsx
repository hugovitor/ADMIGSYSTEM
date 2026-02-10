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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { mensGroupService, MensGroupMember } from '../services/mensGroupService';

const MensGroup: React.FC = () => {
  const [members, setMembers] = useState<MensGroupMember[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState<MensGroupMember>({
    name: '',
    email: '',
    phone: '',
    role: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await mensGroupService.getAll();
      setMembers(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Erro ao carregar lista de membros. Verifique sua conexão.');
      }
    }
  };

  const handleOpen = (member?: MensGroupMember) => {
    if (member) {
      setCurrentMember(member);
      setEditMode(true);
    } else {
      setCurrentMember({
        name: '',
        email: '',
        phone: '',
        role: '',
        notes: '',
      });
      setEditMode(false);
    }
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentMember({
      name: '',
      email: '',
      phone: '',
      role: '',
      notes: '',
    });
  };

  const handleSave = async () => {
    // Validação de campos obrigatórios
    const missingFields: string[] = [];
    if (!currentMember.name.trim()) missingFields.push('Nome');
    if (!currentMember.email.trim()) missingFields.push('Email');
    if (!currentMember.phone.trim()) missingFields.push('Telefone');

    if (missingFields.length > 0) {
      setError(`Por favor, preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentMember.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (editMode && currentMember.id) {
        await mensGroupService.update(currentMember.id, currentMember);
      } else {
        await mensGroupService.create(currentMember);
      }
      await loadMembers();
      handleClose();
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Dados inválidos. Verifique os campos e tente novamente.');
      } else if (err.response?.status === 409) {
        setError('Já existe um membro cadastrado com este email.');
      } else if (err.response?.status === 500) {
        setError('Erro no servidor. Tente novamente mais tarde.');
      } else {
        setError(err.response?.data?.message || 'Erro ao salvar membro. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este membro?')) {
      try {
        await mensGroupService.delete(id);
        await loadMembers();
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Membro não encontrado.');
        } else if (err.response?.status === 500) {
          setError('Erro no servidor ao excluir membro. Tente novamente.');
        } else {
          setError(err.response?.data?.message || 'Erro ao excluir membro. Verifique sua conexão e tente novamente.');
        }
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Grupo de Homens</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Novo Membro
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
              <TableCell>Função</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.role || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(member)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(member.id!)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum membro cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={currentMember.name}
            onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={currentMember.email}
            onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
            required
          />
          <TextField
            label="Telefone"
            fullWidth
            margin="normal"
            value={currentMember.phone}
            onChange={(e) => setCurrentMember({ ...currentMember, phone: e.target.value })}
            required
          />
          <TextField
            label="Função"
            fullWidth
            margin="normal"
            value={currentMember.role || ''}
            onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
          />
          <TextField
            label="Observações"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentMember.notes || ''}
            onChange={(e) => setCurrentMember({ ...currentMember, notes: e.target.value })}
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

export default MensGroup;
