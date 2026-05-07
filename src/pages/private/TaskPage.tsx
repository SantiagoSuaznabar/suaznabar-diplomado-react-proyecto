import { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, List, ListItem, 
  ListItemText, IconButton, Checkbox, Pagination, CircularProgress, 
  Dialog, DialogTitle, DialogContent, DialogActions, Chip 
} from '@mui/material';
import { Delete, Edit, AddCircleOutlined } from '@mui/icons-material';
import { useTareas } from '../../hooks/useTareas'; 
import type { Tarea } from '../../interfaces/tarea.interface';

export const TaskPage = () => {

  const { 
    tareas, cargando, paginaActual, totalPaginas, obtenerTareas, 
    crearTarea, editarTarea, cambiarEstadoTarea, eliminarTarea 
  } = useTareas(); 

  const [nuevaTarea, setNuevaTarea] = useState('');
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [textoEdicion, setTextoEdicion] = useState('');

  useEffect(() => { 
    obtenerTareas(1); 
  }, [obtenerTareas]);

  const actionCrear = async (formData: FormData) => {
    const nombreTarea = formData.get('nombreTarea') as string;
    if (!nombreTarea || !nombreTarea.trim()) return;
    await crearTarea(nombreTarea);
  };

  return (
    <Box sx={{ p: 4, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Tareas
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" action={actionCrear} sx={{ display: 'flex', gap: '16px' }}>
          <TextField 
            fullWidth 
            label="Nueva Tarea" 
            name="nombreTarea"
            variant="outlined"
          />
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<AddCircleOutlined />}
            disabled={cargando}
          >
            Añadir
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {cargando ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {tareas.map((tarea) => (
              <ListItem 
                key={tarea.id} 
                divider
                secondaryAction={
                  <Box>
                    <IconButton 
                      onClick={() => { setTareaEditando(tarea); setTextoEdicion(tarea.name); }} 
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => eliminarTarea(tarea.id)} 
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <Checkbox 
                  checked={tarea.done} 
                  onChange={(e) => cambiarEstadoTarea(tarea.id, e.target.checked)} 
                />
                <ListItemText 
                  primary={tarea.name} 
                  sx={{ textDecoration: tarea.done ? 'line-through' : 'none' }}
                  secondary={
                    <Chip 
                      label={tarea.done ? 'Finalizada' : 'Pendiente'} 
                      color={tarea.done ? 'success' : 'warning'} 
                      size="small" 
                      sx={{ mt: 0.5 }}
                    />
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Pagination 
        count={totalPaginas} 
        page={paginaActual} 
        onChange={(_, v) => obtenerTareas(v)} 
        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} 
      />

      <Dialog open={!!tareaEditando} onClose={() => setTareaEditando(null)}>
        <DialogTitle>Editar Tarea</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            value={textoEdicion} 
            onChange={(e) => setTextoEdicion(e.target.value)} 
            sx={{ mt: 1 }} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTareaEditando(null)}>Cancelar</Button>
          <Button 
            onClick={() => { 
              if(tareaEditando) editarTarea(tareaEditando.id, textoEdicion); 
              setTareaEditando(null); 
            }} 
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};