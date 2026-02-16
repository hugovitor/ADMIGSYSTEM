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
  Grid,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Payment,
  CheckCircle,
  MusicNote,
  School,
  TrendingUp,
  AttachMoney,
  People,
  Event,
  Person,
} from '@mui/icons-material';
import { musicSchoolService, MusicSchoolStudent, MusicSchoolStats } from '../services/musicSchoolService';
import PreRegistrationManagement from '../components/PreRegistrationManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const MusicSchoolPage: React.FC = () => {
  const theme = useTheme();
  const [students, setStudents] = useState<MusicSchoolStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<MusicSchoolStudent[]>([]);
  const [stats, setStats] = useState<MusicSchoolStats | null>(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<MusicSchoolStudent>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    parentName: '',
    parentPhone: '',
    instrument: '',
    level: 'Iniciante',
    teacher: '',
    classType: 'Individual',
    classSchedule: '',
    monthlyFee: 0,
    paymentStatus: 'Em dia',
    status: 'Ativo',
    notes: '',
    progress: '',
    totalClasses: 0,
    attendedClasses: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstrument, setFilterInstrument] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [mainTabValue, setMainTabValue] = useState(0); // Tab principal: 0 = Alunos, 1 = Pré-matrículas

  useEffect(() => {
    loadStudents();
    loadStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, searchTerm, filterInstrument, filterLevel, filterPaymentStatus]);

  const loadStudents = async () => {
    try {
      const data = await musicSchoolService.getAll();
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
      const data = await musicSchoolService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas');
    }
  };

  const applyFilters = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.instrument.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterInstrument) {
      filtered = filtered.filter((s) => s.instrument === filterInstrument);
    }

    if (filterLevel) {
      filtered = filtered.filter((s) => s.level === filterLevel);
    }

    if (filterPaymentStatus) {
      filtered = filtered.filter((s) => s.paymentStatus === filterPaymentStatus);
    }

    setFilteredStudents(filtered);
  };

  const handleOpen = (student?: MusicSchoolStudent) => {
    if (student) {
      setCurrentStudent(student);
      setEditMode(true);
    } else {
      setCurrentStudent({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        parentName: '',
        parentPhone: '',
        instrument: '',
        level: 'Iniciante',
        teacher: '',
        classType: 'Individual',
        classSchedule: '',
        monthlyFee: 0,
        paymentStatus: 'Em dia',
        status: 'Ativo',
        notes: '',
        progress: '',
        totalClasses: 0,
        attendedClasses: 0,
      });
      setEditMode(false);
    }
    setOpen(true);
    setError('');
    setTabValue(0);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    // Validação de campos obrigatórios
    const missingFields: string[] = [];
    if (!currentStudent.name.trim()) missingFields.push('Nome Completo');
    if (!currentStudent.email.trim()) missingFields.push('Email');
    if (!currentStudent.phone.trim()) missingFields.push('Telefone');
    if (!currentStudent.instrument.trim()) missingFields.push('Instrumento');
    if (!currentStudent.level.trim()) missingFields.push('Nível');

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
        await musicSchoolService.update(currentStudent.id, currentStudent);
      } else {
        await musicSchoolService.create(currentStudent);
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
    if (window.confirm('Tem certeza que deseja remover este aluno?')) {
      try {
        await musicSchoolService.delete(id);
        await loadStudents();
        await loadStats();
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Aluno não encontrado.');
        } else if (err.response?.status === 500) {
          setError('Erro no servidor ao remover aluno. Tente novamente.');
        } else {
          setError(err.response?.data?.message || 'Erro ao remover aluno. Verifique sua conexão e tente novamente.');
        }
      }
    }
  };

  const handleRegisterPayment = async (id: number) => {
    if (!window.confirm('Confirmar o registro de pagamento para este aluno?')) {
      return;
    }
    
    try {
      await musicSchoolService.registerPayment(id);
      setSuccess('Pagamento registrado com sucesso!');
      setError('');
      await loadStudents();
      await loadStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Aluno não encontrado.');
      } else if (err.response?.status === 500) {
        setError('Erro no servidor ao registrar pagamento. Tente novamente.');
      } else {
        setError(err.response?.data?.message || 'Erro ao registrar pagamento. Verifique sua conexão e tente novamente.');
      }
    }
  };

  const handleRegisterAttendance = async (id: number) => {
    if (!window.confirm('Confirmar o registro de presença para este aluno?')) {
      return;
    }
    
    try {
      await musicSchoolService.registerAttendance(id);
      setSuccess('Presença registrada com sucesso!');
      setError('');
      await loadStudents();
      await loadStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Aluno não encontrado.');
      } else if (err.response?.status === 500) {
        setError('Erro no servidor ao registrar presença. Tente novamente.');
      } else {
        setError(err.response?.data?.message || 'Erro ao registrar presença. Verifique sua conexão e tente novamente.');
      }
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Em dia':
        return 'success';
      case 'Pendente':
        return 'warning';
      case 'Atrasado':
        return 'error';
      default:
        return 'default';
    }
  };

  const instruments = [...new Set(students.map((s) => s.instrument))].filter(Boolean);
  const levels = ['Iniciante', 'Intermediário', 'Avançado'];
  const paymentStatuses = ['Em dia', 'Pendente', 'Atrasado'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          <MusicNote sx={{ mr: 1, verticalAlign: 'middle' }} />
          Escola de Música Som do Céu
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          size="large"
        >
          Novo Aluno
        </Button>
      </Box>

      {/* Abas principais */}
      <Tabs 
        value={mainTabValue} 
        onChange={(_, newValue) => setMainTabValue(newValue)} 
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab icon={<School />} label="Alunos" />
        <Tab icon={<Person />} label="Pré-matrículas" />
      </Tabs>

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

      <TabPanel value={mainTabValue} index={0}>
        {/* Conteúdo da aba de Alunos */}

      {/* Dashboard de Estatísticas */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Total de Alunos
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {stats.activeStudents}
                    </Typography>
                  </Box>
                  <People sx={{ fontSize: 48, color: theme.palette.primary.main, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Receita Mensal
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      R$ {stats.totalMonthlyRevenue.toFixed(2)}
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 48, color: theme.palette.success.main, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Instrumentos
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {Object.keys(stats.studentsByInstrument).length}
                    </Typography>
                  </Box>
                  <School sx={{ fontSize: 48, color: theme.palette.secondary.main, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Pagamentos Pendentes
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {stats.studentsWithPendingPayment}
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 48, color: theme.palette.warning.main, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filtros */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar por nome, email ou instrumento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <TextField
              fullWidth
              select
              label="Instrumento"
              value={filterInstrument}
              onChange={(e) => setFilterInstrument(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {instruments.map((inst) => (
                <MenuItem key={inst} value={inst}>
                  {inst}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <TextField
              fullWidth
              select
              label="Nível"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {levels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <TextField
              fullWidth
              select
              label="Pagamento"
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {paymentStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setFilterInstrument('');
                setFilterLevel('');
                setFilterPaymentStatus('');
              }}
              sx={{ height: '56px' }}
            >
              Limpar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela de Alunos */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nome</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Instrumento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nível</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Professor</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Mensalidade</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Pagamento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Frequência</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {student.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {student.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{student.instrument}</TableCell>
                <TableCell>
                  <Chip label={student.level} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>{student.teacher || '-'}</TableCell>
                <TableCell>R$ {student.monthlyFee.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={student.paymentStatus}
                    size="small"
                    color={getPaymentStatusColor(student.paymentStatus)}
                  />
                </TableCell>
                <TableCell>
                  {student.totalClasses > 0
                    ? `${student.attendedClasses}/${student.totalClasses} (${Math.round(
                        (student.attendedClasses / student.totalClasses) * 100
                      )}%)`
                    : '-'}
                </TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => handleOpen(student)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Registrar Pagamento">
                    <IconButton
                      size="small"
                      onClick={() => student.id && handleRegisterPayment(student.id)}
                      color="success"
                    >
                      <Payment />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Registrar Presença">
                    <IconButton
                      size="small"
                      onClick={() => student.id && handleRegisterAttendance(student.id)}
                      color="info"
                    >
                      <CheckCircle />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remover">
                    <IconButton
                      size="small"
                      onClick={() => student.id && handleDelete(student.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      </TabPanel>

      <TabPanel value={mainTabValue} index={1}>
        {/* Conteúdo da aba de Pré-matrículas */}
        <PreRegistrationManagement onRefresh={() => { loadStats(); }} />
      </TabPanel>

      {/* Dialog de Edição/Criação */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Aluno' : 'Novo Aluno'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
            <Tab icon={<Person />} label="Dados Pessoais" />
            <Tab icon={<School />} label="Acadêmico" />
            <Tab icon={<AttachMoney />} label="Pagamento" />
            <Tab icon={<Event />} label="Progresso" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome Completo"
                  fullWidth
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Data de Nascimento"
                  type="date"
                  fullWidth
                  value={currentStudent.birthDate || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, birthDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={currentStudent.email}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Telefone"
                  fullWidth
                  value={currentStudent.phone}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome do Responsável"
                  fullWidth
                  value={currentStudent.parentName || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, parentName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Telefone do Responsável"
                  fullWidth
                  value={currentStudent.parentPhone || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, parentPhone: e.target.value })}
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Instrumento"
                  fullWidth
                  value={currentStudent.instrument}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, instrument: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Nível"
                  fullWidth
                  value={currentStudent.level}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, level: e.target.value })}
                  required
                >
                  <MenuItem value="Iniciante">Iniciante</MenuItem>
                  <MenuItem value="Intermediário">Intermediário</MenuItem>
                  <MenuItem value="Avançado">Avançado</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Professor"
                  fullWidth
                  value={currentStudent.teacher || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, teacher: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Tipo de Aula"
                  fullWidth
                  value={currentStudent.classType}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, classType: e.target.value })}
                >
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Grupo">Grupo</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Horário das Aulas"
                  fullWidth
                  value={currentStudent.classSchedule || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, classSchedule: e.target.value })}
                  placeholder="Ex: Segunda e Quarta, 14h-15h"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Status"
                  fullWidth
                  value={currentStudent.status}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, status: e.target.value })}
                >
                  <MenuItem value="Ativo">Ativo</MenuItem>
                  <MenuItem value="Trancado">Trancado</MenuItem>
                  <MenuItem value="Concluído">Concluído</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mensalidade"
                  type="number"
                  fullWidth
                  value={currentStudent.monthlyFee}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, monthlyFee: parseFloat(e.target.value) || 0 })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Status de Pagamento"
                  fullWidth
                  value={currentStudent.paymentStatus}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, paymentStatus: e.target.value })}
                >
                  <MenuItem value="Em dia">Em dia</MenuItem>
                  <MenuItem value="Pendente">Pendente</MenuItem>
                  <MenuItem value="Atrasado">Atrasado</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Data do Último Pagamento"
                  type="date"
                  fullWidth
                  value={currentStudent.lastPaymentDate || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, lastPaymentDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Total de Aulas"
                  type="number"
                  fullWidth
                  value={currentStudent.totalClasses}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, totalClasses: parseInt(e.target.value) || 0 })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Aulas Frequentadas"
                  type="number"
                  fullWidth
                  value={currentStudent.attendedClasses}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, attendedClasses: parseInt(e.target.value) || 0 })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Avaliação/Progresso"
                  fullWidth
                  multiline
                  rows={3}
                  value={currentStudent.progress || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, progress: e.target.value })}
                  placeholder="Descreva o progresso e habilidades do aluno..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observações Gerais"
                  fullWidth
                  multiline
                  rows={3}
                  value={currentStudent.notes || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, notes: e.target.value })}
                  placeholder="Outras observações..."
                />
              </Grid>
            </Grid>
          </TabPanel>
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

export default MusicSchoolPage;
