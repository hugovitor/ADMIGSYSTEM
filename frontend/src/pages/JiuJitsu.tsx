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
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Switch,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  People,
  MonetizationOn,
  EmojiEvents,
  CheckCircle,
  Cancel,
  Warning,
} from '@mui/icons-material';
import { jiuJitsuService, JiuJitsuStudent, JiuJitsuStudentDetail, JiuJitsuStats } from '../services/jiuJitsuService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const JiuJitsu: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState<JiuJitsuStudent[]>([]);
  const [stats, setStats] = useState<JiuJitsuStats | null>(null);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<JiuJitsuStudentDetail | null>(null);
  const [currentStudent, setCurrentStudent] = useState<JiuJitsuStudent>({
    name: '',
    email: '',
    phone: '',
    belt: 'Branca',
    stripes: 0,
    monthlyFee: 100,
    paymentStatus: 'Em dia',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
    loadStats();
  }, [includeInactive]);

  const loadStudents = async () => {
    try {
      const data = await jiuJitsuService.getAll(includeInactive);
      setStudents(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Erro ao carregar lista de alunos. Verifique sua conexão.');
      }
    }
  };

  const loadStats = async () => {
    try {
      const data = await jiuJitsuService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
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
        stripes: 0,
        monthlyFee: 100,
        paymentStatus: 'Em dia',
        notes: '',
      });
      setEditMode(false);
    }
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setDetailOpen(false);
    setCurrentStudent({
      name: '',
      email: '',
      phone: '',
      belt: 'Branca',
      stripes: 0,
      monthlyFee: 100,
      paymentStatus: 'Em dia',
      notes: '',
    });
    setSelectedStudent(null);
  };

  const handleViewDetails = async (studentId: number) => {
    try {
      const data = await jiuJitsuService.getById(studentId);
      setSelectedStudent(data);
      setDetailOpen(true);
    } catch (err) {
      setError('Erro ao carregar detalhes do aluno');
    }
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
      await loadStats();
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
        await loadStats();
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Em dia':
        return 'success';
      case 'Atrasado':
        return 'warning';
      case 'Inadimplente':
        return 'error';
      default:
        return 'default';
    }
  };

  const getBeltColor = (belt: string) => {
    switch (belt) {
      case 'Branca':
        return '#ffffff';
      case 'Azul':
        return '#1976d2';
      case 'Roxa':
        return '#9c27b0';
      case 'Marrom':
        return '#795548';
      case 'Preta':
        return '#424242';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Escola de Jiu-Jitsu</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
              />
            }
            label="Incluir inativos"
          />
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
            Novo Aluno
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Alunos" />
          <Tab label="Estatísticas" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Faixa</TableCell>
                <TableCell>Fitas</TableCell>
                <TableCell>Status Pagamento</TableCell>
                <TableCell>Mensalidade</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 12,
                          backgroundColor: getBeltColor(student.belt),
                          border: student.belt === 'Branca' ? '1px solid #ccc' : 'none',
                        }}
                      />
                      {student.belt}
                    </Box>
                  </TableCell>
                  <TableCell>{student.stripes || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.paymentStatus}
                      color={getPaymentStatusColor(student.paymentStatus || 'Em dia') as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>R$ {student.monthlyFee?.toFixed(2) || '0,00'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="info" onClick={() => handleViewDetails(student.id!)}>
                      <Visibility />
                    </IconButton>
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
                  <TableCell colSpan={8} align="center">
                    Nenhum aluno cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {stats && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total de Alunos
                      </Typography>
                      <Typography variant="h4">
                        {stats.totalStudents}
                      </Typography>
                    </Box>
                    <People sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Alunos Ativos
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {stats.activeStudents}
                      </Typography>
                    </Box>
                    <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Receita Mensal
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        R$ {stats.totalMonthlyRevenue.toFixed(2)}
                      </Typography>
                    </Box>
                    <MonetizationOn sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Graduações (Ano)
                      </Typography>
                      <Typography variant="h4">
                        {stats.totalGraduationsThisYear}
                      </Typography>
                    </Box>
                    <EmojiEvents sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribuição por Faixas
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Box sx={{ width: 20, height: 12, backgroundColor: '#ffffff', border: '1px solid #ccc' }} />
                      </ListItemIcon>
                      <ListItemText primary={`Branca: ${stats.beltDistribution.branca}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Box sx={{ width: 20, height: 12, backgroundColor: '#1976d2' }} />
                      </ListItemIcon>
                      <ListItemText primary={`Azul: ${stats.beltDistribution.azul}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Box sx={{ width: 20, height: 12, backgroundColor: '#9c27b0' }} />
                      </ListItemIcon>
                      <ListItemText primary={`Roxa: ${stats.beltDistribution.roxa}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Box sx={{ width: 20, height: 12, backgroundColor: '#795548' }} />
                      </ListItemIcon>
                      <ListItemText primary={`Marrom: ${stats.beltDistribution.marrom}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Box sx={{ width: 20, height: 12, backgroundColor: '#424242' }} />
                      </ListItemIcon>
                      <ListItemText primary={`Preta: ${stats.beltDistribution.preta}`} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Status de Pagamentos
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={`Em dia: ${stats.paymentStats.emDia}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={`Atrasado: ${stats.paymentStats.atrasado}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Cancel color="error" />
                      </ListItemIcon>
                      <ListItemText primary={`Inadimplente: ${stats.paymentStats.inadimplente}`} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Dialog para criar/editar aluno */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Editar Aluno' : 'Novo Aluno'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome"
                fullWidth
                value={currentStudent.name}
                onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={currentStudent.email}
                onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefone"
                fullWidth
                value={currentStudent.phone}
                onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CPF"
                fullWidth
                value={currentStudent.cpf || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, cpf: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data de Nascimento"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentStudent.birthDate ? currentStudent.birthDate.split('T')[0] : ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, birthDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mensalidade"
                type="number"
                fullWidth
                value={currentStudent.monthlyFee || 0}
                onChange={(e) => setCurrentStudent({ ...currentStudent, monthlyFee: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Endereço"
                fullWidth
                value={currentStudent.address || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Faixa</InputLabel>
                <Select
                  value={currentStudent.belt}
                  label="Faixa"
                  onChange={(e) => setCurrentStudent({ ...currentStudent, belt: e.target.value })}
                >
                  <MenuItem value="Branca">Branca</MenuItem>
                  <MenuItem value="Azul">Azul</MenuItem>
                  <MenuItem value="Roxa">Roxa</MenuItem>
                  <MenuItem value="Marrom">Marrom</MenuItem>
                  <MenuItem value="Preta">Preta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Fitas"
                type="number"
                fullWidth
                value={currentStudent.stripes || 0}
                onChange={(e) => setCurrentStudent({ ...currentStudent, stripes: parseInt(e.target.value) || 0 })}
                inputProps={{ min: 0, max: 4 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status Pagamento</InputLabel>
                <Select
                  value={currentStudent.paymentStatus || 'Em dia'}
                  label="Status Pagamento"
                  onChange={(e) => setCurrentStudent({ ...currentStudent, paymentStatus: e.target.value })}
                >
                  <MenuItem value="Em dia">Em dia</MenuItem>
                  <MenuItem value="Atrasado">Atrasado</MenuItem>
                  <MenuItem value="Inadimplente">Inadimplente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contato de Emergência"
                fullWidth
                value={currentStudent.emergencyContact || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, emergencyContact: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefone de Emergência"
                fullWidth
                value={currentStudent.emergencyPhone || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, emergencyPhone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Condições de Saúde"
                fullWidth
                value={currentStudent.healthConditions || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, healthConditions: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Observações"
                fullWidth
                multiline
                rows={3}
                value={currentStudent.notes || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para detalhes do aluno */}
      <Dialog open={detailOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes do Aluno</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedStudent.name}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography>{selectedStudent.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Telefone</Typography>
                  <Typography>{selectedStudent.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Faixa</Typography>
                  <Typography>{selectedStudent.belt} ({selectedStudent.stripes || 0} fitas)</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Idade</Typography>
                  <Typography>{selectedStudent.age ? `${selectedStudent.age} anos` : 'Não informado'}</Typography>
                </Grid>
                {selectedStudent.recentAttendances && selectedStudent.recentAttendances.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Presenças Recentes
                    </Typography>
                    <List dense>
                      {selectedStudent.recentAttendances.slice(0, 5).map((attendance) => (
                        <ListItem key={attendance.id}>
                          <ListItemIcon>
                            {attendance.isPresent ? <CheckCircle color="success" /> : <Cancel color="error" />}
                          </ListItemIcon>
                          <ListItemText 
                            primary={new Date(attendance.date).toLocaleDateString('pt-BR')}
                            secondary={attendance.classType}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
                {selectedStudent.recentPayments && selectedStudent.recentPayments.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Últimos Pagamentos
                    </Typography>
                    <List dense>
                      {selectedStudent.recentPayments.slice(0, 3).map((payment) => (
                        <ListItem key={payment.id}>
                          <ListItemIcon>
                            <MonetizationOn color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`R$ ${payment.amount.toFixed(2)} - ${payment.paymentMethod}`}
                            secondary={new Date(payment.paymentDate).toLocaleDateString('pt-BR')}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JiuJitsu;
