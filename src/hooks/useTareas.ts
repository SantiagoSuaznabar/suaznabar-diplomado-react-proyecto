import { useState, useCallback, useRef } from 'react'; // Añadimos useRef
import { useAxios } from './useAxios';
import { useAlert } from './useAlert';
import type { Tarea, RespuestaTareas } from '../interfaces/tarea.interface';

export const useTareas = () => {
  const axiosClient = useAxios();
  const { showAlert } = useAlert(); // Extraemos solo la función
  
  // Usamos una referencia para que showAlert no dispare el useCallback
  const showAlertRef = useRef(showAlert);
  showAlertRef.current = showAlert;

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const obtenerTareas = useCallback(async (page: number = 1) => {
    setCargando(true);
    try {
      const response = await axiosClient.get<RespuestaTareas>('/tasks', {
        params: { page, limit: 5, orderby: 'createdAt', orderDir: 'DESC' }
      });
      setTareas(response.data.data);
      setPaginaActual(response.data.page);
      setTotalPaginas(response.data.pages);
    } catch (error) {
      console.error(error);
      showAlertRef.current('Error al obtener las tareas', 'error');
    } finally {
      setCargando(false);
    }
  }, [axiosClient]);

  const crearTarea = async (name: string) => {
    try {
      await axiosClient.post('/tasks', { name });
      showAlert('Tarea creada', 'success');
      obtenerTareas(1); 
    } catch (error) {
      showAlert('Error al crear tarea', 'error');
    }
  };

  const editarTarea = async (id: number, name: string) => {
    try {
      await axiosClient.put(`/tasks/${id}`, { name });
      showAlert('Tarea actualizada', 'success');
      obtenerTareas(paginaActual);
    } catch (error) {
      showAlert('Error al actualizar', 'error');
    }
  };

  const cambiarEstadoTarea = async (id: number, done: boolean) => {
    try {
      await axiosClient.patch(`/tasks/${id}`, { done });
      showAlert(`Tarea ${done ? 'Finalizada' : 'Pendiente'}`, 'success');
      obtenerTareas(paginaActual);
    } catch (error) {
      showAlert('Error al cambiar estado', 'error');
    }
  };

  const eliminarTarea = async (id: number) => {
    try {
      await axiosClient.delete(`/tasks/${id}`);
      showAlert('Tarea eliminada', 'success');
      obtenerTareas(paginaActual);
    } catch (error) {
      showAlert('Error al eliminar', 'error');
    }
  };

  return { tareas, cargando, paginaActual, totalPaginas, obtenerTareas, crearTarea, editarTarea, cambiarEstadoTarea, eliminarTarea };
};