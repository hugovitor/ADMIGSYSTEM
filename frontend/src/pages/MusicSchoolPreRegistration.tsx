import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Alert, 
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import { preRegistrationService, MusicSchoolPreRegistrationRequest } from '../services/preRegistrationService';
import { theme as customTheme } from '../theme/colors';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2, 0),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.secondary})`,
  color: 'white',
  padding: theme.spacing(6, 4),
  borderRadius: '16px 16px 0 0',
  marginBottom: theme.spacing(3),
  textAlign: 'center',
}));

const MusicSchoolPreRegistration: React.FC = () => {
  const [formData, setFormData] = useState<MusicSchoolPreRegistrationRequest>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    instrument: '',
    level: 'Iniciante',
    preferredClassType: 'Individual',
    preferredSchedule: '',
    hasMusicalExperience: false,
    musicalExperience: '',
    questions: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [instruments, setInstruments] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [classTypes, setClassTypes] = useState<string[]>([]);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const [instrumentsRes, levelsRes, classTypesRes] = await Promise.all([
        preRegistrationService.getAvailableInstruments(),
        preRegistrationService.getAvailableLevels(),
        preRegistrationService.getAvailableClassTypes()
      ]);
      
      setInstruments(instrumentsRes.instruments);
      setLevels(levelsRes.levels);
      setClassTypes(classTypesRes.classTypes);
    } catch (err) {
      console.error('Erro ao carregar dados do formulário:', err);
      setError('Erro ao carregar dados do formulário');
    }
  };

  const handleChange = (field: keyof MusicSchoolPreRegistrationRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await preRegistrationService.createMusicSchoolPreRegistration(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        instrument: '',
        level: 'Iniciante',
        preferredClassType: 'Individual',
        preferredSchedule: '',
        hasMusicalExperience: false,
        musicalExperience: '',
        questions: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar pré-matrícula');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const isMinor = formData.birthDate ? calculateAge(formData.birthDate) && calculateAge(formData.birthDate)! < 18 : false;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StyledPaper>
        <HeaderSection>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Pré-matrícula
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Escola de Música
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
            Interessado em aprender música? Preencha o formulário abaixo e nossa equipe entrará em contato!
          </Typography>
        </HeaderSection>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Pré-matrícula realizada com sucesso! Entraremos em contato em breve.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom sx={{ color: customTheme.colors.primary, fontWeight: 'bold', mt: 2, mb: 2 }}>
            Informações Pessoais
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome completo"
                required
                value={formData.name}
                onChange={handleChange('name')}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de nascimento"
                type="date"
                value={formData.birthDate}
                onChange={handleChange('birthDate')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange('email')}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                required
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="(11) 99999-9999"
                variant="outlined"
              />
            </Grid>
          </Grid>

          {isMinor && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ color: customTheme.colors.primary, fontWeight: 'bold' }}>
                Informações do Responsável
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nome do responsável"
                    value={formData.parentName}
                    onChange={handleChange('parentName')}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Telefone do responsável"
                    value={formData.parentPhone}
                    onChange={handleChange('parentPhone')}
                    placeholder="(11) 99999-9999"
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email do responsável"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange('parentEmail')}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom sx={{ color: customTheme.colors.primary, fontWeight: 'bold' }}>
            Preferências Musicais
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Instrumento</InputLabel>
                <Select
                  value={formData.instrument}
                  label="Instrumento"
                  onChange={handleChange('instrument')}
                >
                  {instruments.map((instrument) => (
                    <MenuItem key={instrument} value={instrument}>
                      {instrument}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Nível</InputLabel>
                <Select
                  value={formData.level}
                  label="Nível"
                  onChange={handleChange('level')}
                >
                  {levels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de aula preferido</InputLabel>
                <Select
                  value={formData.preferredClassType}
                  label="Tipo de aula preferido"
                  onChange={handleChange('preferredClassType')}
                >
                  {classTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Horário preferido"
                value={formData.preferredSchedule}
                onChange={handleChange('preferredSchedule')}
                placeholder="Ex: Terça e quinta, 14h às 15h"
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom sx={{ color: customTheme.colors.primary, fontWeight: 'bold' }}>
            Experiência Musical
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasMusicalExperience}
                    onChange={handleChange('hasMusicalExperience')}
                    color="primary"
                  />
                }
                label="Já possui experiência musical"
              />
            </Grid>
            
            {formData.hasMusicalExperience && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descreva sua experiência musical"
                  multiline
                  rows={3}
                  value={formData.musicalExperience}
                  onChange={handleChange('musicalExperience')}
                  placeholder="Conte-nos sobre sua experiência com música, instrumentos que já tocou, tempo de estudo, etc."
                  variant="outlined"
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Perguntas ou observações"
                multiline
                rows={3}
                value={formData.questions}
                onChange={handleChange('questions')}
                placeholder="Tem alguma pergunta ou gostaria de nos contar algo específico sobre seus objetivos musicais?"
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: customTheme.colors.primary,
                '&:hover': { bgcolor: customTheme.colors.secondary },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Enviando...' : 'Enviar Pré-matrícula'}
            </Button>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default MusicSchoolPreRegistration;