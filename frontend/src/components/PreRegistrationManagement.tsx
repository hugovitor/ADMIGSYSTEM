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
  Chip,
  MenuItem,
  Grid,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Edit,
  CheckCircle,
  Delete,
  Email,
  Phone,
} from '@mui/icons-material';
import { 
  musicSchoolService, 
  MusicSchoolPreRegistration, 
  UpdatePreRegistrationRequest, 
  ConvertPreRegistrationRequest 
} from '../services/musicSchoolService';


interface PreRegistrationManagementProps {
  onRefresh?: () => void;
}

const PreRegistrationManagement: React.FC<PreRegistrationManagementProps> = ({ onRefresh }) => {
  const [preRegistrations, setPreRegistrations] = useState<MusicSchoolPreRegistration[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados dos dialogs
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedPreRegistration, setSelectedPreRegistration] = useState<MusicSchoolPreRegistration | null>(null);
  
  // Estados dos formulários
  const [updateData, setUpdateData] = useState<UpdatePreRegistrationRequest>({
    status: '',
    adminNotes: '',
    isProcessed: false
  });
  
  const [convertData, setConvertData] = useState<ConvertPreRegistrationRequest>({
    teacher: '',
    classSchedule: '',
    monthlyFee: 0
  });

  useEffect(() => {
    loadPreRegistrations();
  }, []);

  const loadPreRegistrations = async () => {
    try {
      const data = await musicSchoolService.getPreRegistrations();
      setPreRegistrations(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar pré-matrículas');
    }
  };

  const handleUpdateOpen = (preRegistration: MusicSchoolPreRegistration) => {
    setSelectedPreRegistration(preRegistration);
    setUpdateData({
      status: preRegistration.status,
      adminNotes: preRegistration.adminNotes || '',
      isProcessed: preRegistration.isProcessed
    });
    setUpdateDialogOpen(true);
  };

  const handleConvertOpen = (preRegistration: MusicSchoolPreRegistration) => {
    setSelectedPreRegistration(preRegistration);
    setConvertData({
      teacher: '',
      classSchedule: preRegistration.preferredSchedule || '',
      monthlyFee: 0
    });
    setConvertDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedPreRegistration) return;
    
    try {
      await musicSchoolService.updatePreRegistration(selectedPreRegistration.id, updateData);
      setSuccess('Pré-matrícula atualizada com sucesso!');
      setUpdateDialogOpen(false);
      loadPreRegistrations();
      onRefresh?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar pré-matrícula');
    }
  };

  const handleConvert = async () => {
    if (!selectedPreRegistration) return;
    
    try {
      await musicSchoolService.convertPreRegistration(selectedPreRegistration.id, convertData);
      setSuccess('Pré-matrícula convertida em matrícula com sucesso!');
      setConvertDialogOpen(false);
      loadPreRegistrations();
      onRefresh?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao converter pré-matrícula');
    }
  };

  const handleDelete = async (preRegistration: MusicSchoolPreRegistration) => {
    const confirmed = window.confirm(`Deseja excluir a pré-matrícula de ${preRegistration.name}?`);
    if (!confirmed) return;

    try {
      await musicSchoolService.deletePreRegistration(preRegistration.id);
      setSuccess('Pré-matrícula excluída com sucesso!');
      loadPreRegistrations();
      onRefresh?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir pré-matrícula');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'warning';
      case 'Contatado': return 'info';
      case 'Matriculado': return 'success';
      case 'Rejeitado': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const pendingCount = preRegistrations.filter(p => p.status === 'Pendente').length;
  const contactedCount = preRegistrations.filter(p => p.status === 'Contatado').length;
  const enrolledCount = preRegistrations.filter(p => p.status === 'Matriculado').length;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Estatísticas das pré-matrículas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3cd' }}>
            <Typography variant="h4" color="#856404">{pendingCount}</Typography>
            <Typography variant="body2" color="#856404">Pendentes</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#d1ecf1' }}>
            <Typography variant="h4" color="#0c5460">{contactedCount}</Typography>
            <Typography variant="body2" color="#0c5460">Contatados</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#d4edda' }}>
            <Typography variant="h4" color="#155724">{enrolledCount}</Typography>
            <Typography variant="body2" color="#155724">Matriculados</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell>Instrumento</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preRegistrations.map((preRegistration) => (
              <TableRow key={preRegistration.id}>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{preRegistration.name}</Typography>
                    {preRegistration.parentName && (
                      <Typography variant="caption" color="textSecondary">
                        Responsável: {preRegistration.parentName}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" />
                      <Typography variant="caption">{preRegistration.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{preRegistration.instrument}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Nível: {preRegistration.level} | {preRegistration.preferredClassType}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{formatDate(preRegistration.preRegistrationDate)}</TableCell>
                <TableCell>
                  <Chip 
                    label={preRegistration.status} 
                    color={getStatusColor(preRegistration.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Atualizar Status">
                      <IconButton 
                        size="small" 
                        onClick={() => handleUpdateOpen(preRegistration)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    {preRegistration.status !== 'Matriculado' && (
                      <Tooltip title="Converter para Matrícula">
                        <IconButton 
                          size="small" 
                          onClick={() => handleConvertOpen(preRegistration)}
                          color="success"
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Excluir Pré-matrícula">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(preRegistration)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para atualizar pré-matrícula */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Atualizar Pré-matrícula</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={updateData.status}
                  label="Status"
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                >
                  <MenuItem value="Pendente">Pendente</MenuItem>
                  <MenuItem value="Contatado">Contatado</MenuItem>
                  <MenuItem value="Rejeitado">Rejeitado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações Administrativas"
                multiline
                rows={4}
                value={updateData.adminNotes}
                onChange={(e) => setUpdateData({ ...updateData, adminNotes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained">Atualizar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para converter pré-matrícula */}
      <Dialog open={convertDialogOpen} onClose={() => setConvertDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Converter para Matrícula</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Professor"
                value={convertData.teacher}
                onChange={(e) => setConvertData({ ...convertData, teacher: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Horário das Aulas"
                value={convertData.classSchedule}
                onChange={(e) => setConvertData({ ...convertData, classSchedule: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensalidade"
                type="number"
                value={convertData.monthlyFee}
                onChange={(e) => setConvertData({ ...convertData, monthlyFee: parseFloat(e.target.value) || 0 })}
                inputProps={{ step: "0.01" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConvertDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleConvert} variant="contained" color="success">
            Converter para Matrícula
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PreRegistrationManagement;