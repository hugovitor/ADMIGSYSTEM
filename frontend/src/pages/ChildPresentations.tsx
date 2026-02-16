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
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Download,
  ChildCare,
  Cake,
  People,
  Assignment,
} from '@mui/icons-material';
import { childPresentationService, ChildPresentation, ChildPresentationDetail, ChildPresentationStats } from '../services/childPresentationService';

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

const ChildPresentations: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [presentations, setPresentations] = useState<ChildPresentation[]>([]);
  const [stats, setStats] = useState<ChildPresentationStats | null>(null);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState<ChildPresentationDetail | null>(null);
  const [currentPresentation, setCurrentPresentation] = useState<ChildPresentation>({
    childName: '',
    birthDate: '',
    gender: 'Masculino',
    fatherName: '',
    motherName: '',
    presentationDate: new Date().toISOString().split('T')[0],
    pastor: '',
    biblicalVerse: '"Deixai vir a mim os pequeninos" - Mateus 19:14',
    churchName: 'Igreja',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPresentations();
    loadStats();
  }, []);

  const loadPresentations = async () => {
    try {
      const data = await childPresentationService.getAll();
      setPresentations(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Erro ao carregar lista de apresentações.');
      }
    }
  };

  const loadStats = async () => {
    try {
      const data = await childPresentationService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const handleOpen = (presentation?: ChildPresentation) => {
    if (presentation) {
      setCurrentPresentation(presentation);
      setEditMode(true);
    } else {
      setCurrentPresentation({
        childName: '',
        birthDate: '',
        gender: 'Masculino',
        fatherName: '',
        motherName: '',
        presentationDate: new Date().toISOString().split('T')[0],
        pastor: '',
        biblicalVerse: '"Deixai vir a mim os pequeninos" - Mateus 19:14',
        churchName: 'Igreja',
      });
      setEditMode(false);
    }
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setDetailOpen(false);
    setCurrentPresentation({
      childName: '',
      birthDate: '',
      gender: 'Masculino',
      fatherName: '',
      motherName: '',
      presentationDate: new Date().toISOString().split('T')[0],
      pastor: '',
      biblicalVerse: '"Deixai vir a mim os pequeninos" - Mateus 19:14',
      churchName: 'Igreja',
    });
    setSelectedPresentation(null);
  };

  const handleViewDetails = async (presentationId: number) => {
    try {
      const data = await childPresentationService.getById(presentationId);
      setSelectedPresentation(data);
      setDetailOpen(true);
    } catch (err) {
      setError('Erro ao carregar detalhes da apresentação');
    }
  };

  const handleSave = async () => {
    // Validação de campos obrigatórios
    const missingFields: string[] = [];
    if (!currentPresentation.childName.trim()) missingFields.push('Nome da Criança');
    if (!currentPresentation.birthDate) missingFields.push('Data de Nascimento');
    if (!currentPresentation.fatherName.trim()) missingFields.push('Nome do Pai');
    if (!currentPresentation.motherName.trim()) missingFields.push('Nome da Mãe');
    if (!currentPresentation.pastor.trim()) missingFields.push('Pastor');

    if (missingFields.length > 0) {
      setError(`Por favor, preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (editMode && currentPresentation.id) {
        await childPresentationService.update(currentPresentation.id, currentPresentation);
      } else {
        await childPresentationService.create(currentPresentation);
      }
      await loadPresentations();
      await loadStats();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar apresentação.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta apresentação?')) {
      try {
        await childPresentationService.delete(id);
        await loadPresentations();
        await loadStats();
      } catch (err: any) {
        setError('Erro ao excluir apresentação.');
      }
    }
  };

  const handleGenerateCertificate = async (id: number) => {
    try {
      setLoading(true);
      await childPresentationService.generateCertificate(id);
      await loadPresentations();
      if (selectedPresentation?.id === id) {
        await handleViewDetails(id);
      }
      setError('');
      alert('Certificado gerado com sucesso!');
    } catch (err: any) {
      setError('Erro ao gerar certificado.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (id: number, childName: string) => {
    try {
      const blob = await childPresentationService.downloadCertificate(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificado_${childName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError('Erro ao baixar certificado.');
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'Masculino' ? '👶' : '👧';
  };

  const getGenderColor = (gender: string) => {
    return gender === 'Masculino' ? 'primary' : 'secondary';
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    
    if (ageInMonths < 12) {
      return `${ageInMonths} meses`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years} anos e ${months} meses` : `${years} anos`;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Apresentação de Crianças</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nova Apresentação
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Apresentações" />
          <Tab label="Estatísticas" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Criança</TableCell>
                <TableCell>Idade</TableCell>
                <TableCell>Sexo</TableCell>
                <TableCell>Pais</TableCell>
                <TableCell>Data Apresentação</TableCell>
                <TableCell>Pastor</TableCell>
                <TableCell>Certificado</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presentations.map((presentation) => (
                <TableRow key={presentation.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getGenderIcon(presentation.gender)}
                      {presentation.childName}
                    </Box>
                  </TableCell>
                  <TableCell>{calculateAge(presentation.birthDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={presentation.gender}
                      color={getGenderColor(presentation.gender) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{presentation.fatherName}</Typography>
                      <Typography variant="body2" color="textSecondary">{presentation.motherName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(presentation.presentationDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{presentation.pastor}</TableCell>
                  <TableCell>
                    {presentation.certificateGenerated ? (
                      <Chip label="Gerado" color="success" size="small" />
                    ) : (
                      <Chip label="Pendente" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="info" onClick={() => handleViewDetails(presentation.id!)}>
                      <Visibility />
                    </IconButton>
                    <IconButton 
                      color="success" 
                      onClick={() => handleGenerateCertificate(presentation.id!)}
                      disabled={loading}
                    >
                      <Assignment />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleOpen(presentation)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(presentation.id!)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {presentations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Nenhuma apresentação cadastrada
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
                        Total Apresentações
                      </Typography>
                      <Typography variant="h4">
                        {stats.totalPresentations}
                      </Typography>
                    </Box>
                    <ChildCare sx={{ fontSize: 40, color: 'primary.main' }} />
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
                        Este Ano
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {stats.presentationsThisYear}
                      </Typography>
                    </Box>
                    <Cake sx={{ fontSize: 40, color: 'success.main' }} />
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
                        Este Mês
                      </Typography>
                      <Typography variant="h4">
                        {stats.presentationsThisMonth}
                      </Typography>
                    </Box>
                    <People sx={{ fontSize: 40, color: 'info.main' }} />
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
                        Certificados Gerados
                      </Typography>
                      <Typography variant="h4">
                        {stats.certificatesGenerated}
                      </Typography>
                    </Box>
                    <Assignment sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribuição por Sexo
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>👶</ListItemIcon>
                      <ListItemText primary={`Meninos: ${stats.genderStats.boys}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>👧</ListItemIcon>
                      <ListItemText primary={`Meninas: ${stats.genderStats.girls}`} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribuição por Idade
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary={`Menos de 1 ano: ${stats.ageStats.under1Year}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`1-2 anos: ${stats.ageStats.age1to2}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`3-5 anos: ${stats.ageStats.age3to5}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Mais de 5 anos: ${stats.ageStats.over5Years}`} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Dialog para criar/editar apresentação */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Editar Apresentação' : 'Nova Apresentação'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Dados da Criança */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Dados da Criança
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome da Criança"
                fullWidth
                value={currentPresentation.childName}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, childName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Data de Nascimento"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentPresentation.birthDate}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, birthDate: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Sexo</InputLabel>
                <Select
                  value={currentPresentation.gender}
                  label="Sexo"
                  onChange={(e) => setCurrentPresentation({ ...currentPresentation, gender: e.target.value })}
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Local de Nascimento"
                fullWidth
                value={currentPresentation.birthPlace || ''}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, birthPlace: e.target.value })}
              />
            </Grid>

            {/* Dados dos Pais */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                Dados dos Pais/Responsáveis
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome do Pai"
                fullWidth
                value={currentPresentation.fatherName}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, fatherName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Profissão do Pai"
                fullWidth
                value={currentPresentation.fatherProfession || ''}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, fatherProfession: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome da Mãe"
                fullWidth
                value={currentPresentation.motherName}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, motherName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Profissão da Mãe"
                fullWidth
                value={currentPresentation.motherProfession || ''}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, motherProfession: e.target.value })}
              />
            </Grid>

            {/* Dados da Apresentação */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                Dados da Apresentação
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Data da Apresentação"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentPresentation.presentationDate}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, presentationDate: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pastor"
                fullWidth
                value={currentPresentation.pastor}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, pastor: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Versículo Bíblico"
                fullWidth
                value={currentPresentation.biblicalVerse || ''}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, biblicalVerse: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mensagem Especial"
                fullWidth
                multiline
                rows={3}
                value={currentPresentation.specialMessage || ''}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, specialMessage: e.target.value })}
              />
            </Grid>

            {/* Dados da Igreja */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                Dados da Igreja
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome da Igreja"
                fullWidth
                value={currentPresentation.churchName}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, churchName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Endereço da Igreja"
                fullWidth
                value={currentPresentation.churchAddress || ''}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, churchAddress: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Observações"
                fullWidth
                multiline
                rows={3}
                value={currentPresentation.notes || ''}
                onChange={(e) => setCurrentPresentation({ ...currentPresentation, notes: e.target.value })}
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

      {/* Dialog para detalhes da apresentação */}
      <Dialog open={detailOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes da Apresentação</DialogTitle>
        <DialogContent>
          {selectedPresentation && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h5">
                  {getGenderIcon(selectedPresentation.gender)} {selectedPresentation.childName}
                </Typography>
                <Chip
                  label={selectedPresentation.gender}
                  color={getGenderColor(selectedPresentation.gender) as any}
                  size="small"
                />
                {selectedPresentation.certificateGenerated && (
                  <Chip label="Certificado Gerado" color="success" size="small" />
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Idade</Typography>
                  <Typography>{calculateAge(selectedPresentation.birthDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Data da Apresentação</Typography>
                  <Typography>{new Date(selectedPresentation.presentationDate).toLocaleDateString('pt-BR')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Pai</Typography>
                  <Typography>{selectedPresentation.fatherName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Mãe</Typography>
                  <Typography>{selectedPresentation.motherName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Pastor</Typography>
                  <Typography>{selectedPresentation.pastor}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Igreja</Typography>
                  <Typography>{selectedPresentation.churchName}</Typography>
                </Grid>
                
                {selectedPresentation.biblicalVerse && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">Versículo Bíblico</Typography>
                    <Typography sx={{ fontStyle: 'italic' }}>{selectedPresentation.biblicalVerse}</Typography>
                  </Grid>
                )}
                
                {selectedPresentation.specialMessage && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">Mensagem Especial</Typography>
                    <Typography>{selectedPresentation.specialMessage}</Typography>
                  </Grid>
                )}
              </Grid>

              {selectedPresentation.certificateGenerated && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => handleDownloadCertificate(selectedPresentation.id!, selectedPresentation.childName)}
                  >
                    Baixar Certificado
                  </Button>
                </Box>
              )}
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

export default ChildPresentations;