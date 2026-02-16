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
  Avatar,
  Chip,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Person,
  Group,
  Church,
  FamilyRestroom,
} from '@mui/icons-material';
import { memberService, Member, MemberDetail, MemberStats, FamilyMember } from '../services/memberService';

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

const Members: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberDetail | null>(null);
  const [currentMember, setCurrentMember] = useState<Member>({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Não informado',
    maritalStatus: 'Solteiro(a)',
    membershipDate: new Date().toISOString().split('T')[0],
    membershipType: 'Membro',
    baptismStatus: 'Não batizado',
    city: 'Não informado',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMembers();
    loadStats();
  }, [includeInactive]);

  const loadMembers = async () => {
    try {
      const data = await memberService.getAll(includeInactive);
      setMembers(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Erro ao carregar lista de membros. Verifique sua conexão.');
      }
    }
  };

  const loadStats = async () => {
    try {
      const data = await memberService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const handleOpen = (member?: Member) => {
    if (member) {
      setCurrentMember(member);
      setEditMode(true);
    } else {
      setCurrentMember({
        fullName: '',
        email: '',
        phone: '',
        gender: 'Não informado',
        maritalStatus: 'Solteiro(a)',
        membershipDate: new Date().toISOString().split('T')[0],
        membershipType: 'Membro',
        baptismStatus: 'Não batizado',
        city: 'Não informado',
      });
      setEditMode(false);
    }
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setDetailOpen(false);
    setCurrentMember({
      fullName: '',
      email: '',
      phone: '',
      gender: 'Não informado',
      maritalStatus: 'Solteiro(a)',
      membershipDate: new Date().toISOString().split('T')[0],
      membershipType: 'Membro',
      baptismStatus: 'Não batizado',
      city: 'Não informado',
    });
    setSelectedMember(null);
  };

  const handleViewDetails = async (memberId: number) => {
    try {
      const data = await memberService.getById(memberId);
      setSelectedMember(data);
      setDetailOpen(true);
    } catch (err) {
      setError('Erro ao carregar detalhes do membro');
    }
  };

  const handleSave = async () => {
    // Validação de campos obrigatórios
    const missingFields: string[] = [];
    if (!currentMember.fullName.trim()) missingFields.push('Nome Completo');
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
        await memberService.update(currentMember.id, currentMember);
      } else {
        await memberService.create(currentMember);
      }
      await loadMembers();
      await loadStats();
      handleClose();
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Dados inválidos. Verifique os campos e tente novamente.');
      } else if (err.response?.status === 409) {
        setError('Já existe um membro cadastrado com este email.');
      } else {
        setError(err.response?.data?.message || 'Erro ao salvar membro.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este membro?')) {
      try {
        await memberService.delete(id);
        await loadMembers();
        await loadStats();
      } catch (err: any) {
        setError('Erro ao excluir membro.');
      }
    }
  };


  const getMembershipTypeColor = (type: string) => {
    switch (type) {
      case 'Pastor':
        return 'error';
      case 'Presbítero':
        return 'warning';
      case 'Diácono':
        return 'info';
      case 'Membro':
        return 'success';
      case 'Congregado':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'Masculino' ? '👨' : gender === 'Feminino' ? '👩' : '👤';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Membros da Igreja</Typography>
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
            Novo Membro
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Membros" />
          <Tab label="Estatísticas" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Foto</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Tipo de Membro</TableCell>
                <TableCell>Família</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar 
                      src={member.photoPath ? `http://localhost:5000${member.photoPath}` : undefined}
                      sx={{ width: 40, height: 40 }}
                    >
                      {getGenderIcon(member.gender)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{member.fullName}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={member.membershipType}
                      color={getMembershipTypeColor(member.membershipType) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge badgeContent={0} color="primary">
                      <FamilyRestroom />
                    </Badge>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="info" onClick={() => handleViewDetails(member.id!)}>
                      <Visibility />
                    </IconButton>
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
                  <TableCell colSpan={7} align="center">
                    Nenhum membro cadastrado
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
                        Total de Membros
                      </Typography>
                      <Typography variant="h4">
                        {stats.totalMembers}
                      </Typography>
                    </Box>
                    <Person sx={{ fontSize: 40, color: 'primary.main' }} />
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
                        Membros Ativos
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {stats.activeMembers}
                      </Typography>
                    </Box>
                    <Group sx={{ fontSize: 40, color: 'success.main' }} />
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
                        Famílias
                      </Typography>
                      <Typography variant="h4">
                        {stats.membersWithFamily}
                      </Typography>
                    </Box>
                    <FamilyRestroom sx={{ fontSize: 40, color: 'info.main' }} />
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
                        Batizados
                      </Typography>
                      <Typography variant="h4">
                        {stats.baptismStats.batizadoAguas + stats.baptismStats.ambos}
                      </Typography>
                    </Box>
                    <Church sx={{ fontSize: 40, color: 'secondary.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tipos de Membros
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary={`Pastor: ${stats.membershipTypes.pastor}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Presbítero: ${stats.membershipTypes.presbitero}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Diácono: ${stats.membershipTypes.diacono}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Membro: ${stats.membershipTypes.membro}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Congregado: ${stats.membershipTypes.congregado}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Visitante: ${stats.membershipTypes.visitante}`} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribuição por Faixa Etária
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary={`Crianças (0-12): ${stats.ageGroups.children}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Adolescentes (13-17): ${stats.ageGroups.teens}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Jovens (18-29): ${stats.ageGroups.youngAdults}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Adultos (30-59): ${stats.ageGroups.adults}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Idosos (60+): ${stats.ageGroups.seniors}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Não informado: ${stats.ageGroups.unknown}`} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Dialog para criar/editar membro */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>{editMode ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Dados Pessoais */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Dados Pessoais
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome Completo"
                fullWidth
                value={currentMember.fullName}
                onChange={(e) => setCurrentMember({ ...currentMember, fullName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={currentMember.email}
                onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="CPF"
                fullWidth
                value={currentMember.cpf || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, cpf: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="RG"
                fullWidth
                value={currentMember.rg || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, rg: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Data de Nascimento"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentMember.birthDate ? currentMember.birthDate.split('T')[0] : ''}
                onChange={(e) => setCurrentMember({ ...currentMember, birthDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Sexo</InputLabel>
                <Select
                  value={currentMember.gender}
                  label="Sexo"
                  onChange={(e) => setCurrentMember({ ...currentMember, gender: e.target.value })}
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                  <MenuItem value="Não informado">Não informado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Estado Civil</InputLabel>
                <Select
                  value={currentMember.maritalStatus}
                  label="Estado Civil"
                  onChange={(e) => setCurrentMember({ ...currentMember, maritalStatus: e.target.value })}
                >
                  <MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
                  <MenuItem value="Casado(a)">Casado(a)</MenuItem>
                  <MenuItem value="Divorciado(a)">Divorciado(a)</MenuItem>
                  <MenuItem value="Viúvo(a)">Viúvo(a)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Profissão"
                fullWidth
                value={currentMember.profession || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, profession: e.target.value })}
              />
            </Grid>

            {/* Contato */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                Contato
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefone Principal"
                fullWidth
                value={currentMember.phone}
                onChange={(e) => setCurrentMember({ ...currentMember, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefone Alternativo"
                fullWidth
                value={currentMember.alternativePhone || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, alternativePhone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Endereço"
                fullWidth
                value={currentMember.address || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Bairro"
                fullWidth
                value={currentMember.neighborhood || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, neighborhood: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Cidade"
                fullWidth
                value={currentMember.city || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="CEP"
                fullWidth
                value={currentMember.zipCode || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, zipCode: e.target.value })}
              />
            </Grid>

            {/* Dados Eclesiásticos */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                Dados Eclesiásticos
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Data de Membresia"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentMember.membershipDate ? currentMember.membershipDate.split('T')[0] : ''}
                onChange={(e) => setCurrentMember({ ...currentMember, membershipDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Membro</InputLabel>
                <Select
                  value={currentMember.membershipType}
                  label="Tipo de Membro"
                  onChange={(e) => setCurrentMember({ ...currentMember, membershipType: e.target.value })}
                >
                  <MenuItem value="Visitante">Visitante</MenuItem>
                  <MenuItem value="Congregado">Congregado</MenuItem>
                  <MenuItem value="Membro">Membro</MenuItem>
                  <MenuItem value="Diácono">Diácono</MenuItem>
                  <MenuItem value="Presbítero">Presbítero</MenuItem>
                  <MenuItem value="Pastor">Pastor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status de Batismo</InputLabel>
                <Select
                  value={currentMember.baptismStatus || ''}
                  label="Status de Batismo"
                  onChange={(e) => setCurrentMember({ ...currentMember, baptismStatus: e.target.value })}
                >
                  <MenuItem value="Não batizado">Não batizado</MenuItem>
                  <MenuItem value="Batizado nas águas">Batizado nas águas</MenuItem>
                  <MenuItem value="Batizado no Espírito Santo">Batizado no Espírito Santo</MenuItem>
                  <MenuItem value="Ambos">Ambos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data do Batismo"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentMember.baptismDate ? currentMember.baptismDate.split('T')[0] : ''}
                onChange={(e) => setCurrentMember({ ...currentMember, baptismDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Observações"
                fullWidth
                multiline
                rows={3}
                value={currentMember.notes || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, notes: e.target.value })}
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

      {/* Dialog para detalhes do membro */}
      <Dialog open={detailOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes do Membro</DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar 
                  src={selectedMember.photoPath ? `http://localhost:5000${selectedMember.photoPath}` : undefined}
                  sx={{ width: 80, height: 80 }}
                >
                  {getGenderIcon(selectedMember.gender)}
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {selectedMember.fullName}
                  </Typography>
                  <Chip
                    label={selectedMember.membershipType}
                    color={getMembershipTypeColor(selectedMember.membershipType) as any}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography>{selectedMember.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Telefone</Typography>
                  <Typography>{selectedMember.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Idade</Typography>
                  <Typography>{selectedMember.age ? `${selectedMember.age} anos` : 'Não informado'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Estado Civil</Typography>
                  <Typography>{selectedMember.maritalStatus}</Typography>
                </Grid>
                
                {selectedMember.familyMembers && selectedMember.familyMembers.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Familiares
                    </Typography>
                    <List dense>
                      {selectedMember.familyMembers.map((family) => (
                        <ListItem key={family.id}>
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          <ListItemText 
                            primary={family.name}
                            secondary={`${family.relationship} - ${family.age ? `${family.age} anos` : 'Idade não informada'}`}
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

export default Members;