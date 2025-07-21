import React, { useState } from "react";
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, IconButton, Card as MCard } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import moment from 'moment';
import VerMedicamento from "./mostrarMedicamentos"; // Asegúrate de que esta ruta sea correcta
import { AgregarMedicamento, ActualizarMedicamento, EliminarAplicacionMedicamento } from "../api/glicemiappService"; // Asegúrate de que EliminarAplicacionMedicamento exista en tu servicio si lo necesitas
import Modal from "./Modales"; // Asegúrate de que esta ruta sea correcta

// --- Componente para AGREGAR un nuevo medicamento ---
const Medicamento = ({ onCloseModal }) => { // Recibe una función para cerrar el modal
    const navigate = useNavigate(); // Cambiado de 'history' a 'navigate'
    const { cedula } = useParams();
    const [datos, setDatos] = useState({});
    const [horarios, setHorarios] = useState([]);
    const [errorMensaje, setErrorMensaje] = useState("");

    const handleOnChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
        setErrorMensaje(""); // Limpiar error al escribir
    };

    const handleAgregarHora = () => {
        if (datos.hora && datos.hora.trim() !== "") {
            if (!horarios.includes(datos.hora)) { // Evita horas duplicadas
                setHorarios([...horarios, datos.hora]);
                setDatos({ ...datos, hora: "" }); // Limpia el input de hora
                setErrorMensaje("");
            } else {
                setErrorMensaje("Esta hora ya ha sido agregada.");
            }
        } else {
            setErrorMensaje("Por favor, ingrese una hora.");
        }
    };

    const handleEliminarHora = (itemToRemove) => {
        setHorarios(horarios.filter((item) => item !== itemToRemove));
        setErrorMensaje("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMensaje(""); // Reiniciar mensaje de error en cada intento

        // --- VALIDACIÓN FRONTTEND ---
        if (!datos.nombre || datos.nombre.trim() === "") { // Asegúrate de que el nombre del input sea 'nombre' o 'medicamento' según tu API
            setErrorMensaje("El nombre del medicamento es requerido.");
            return;
        }
        if (!datos.dosis || datos.dosis.trim() === "") {
            setErrorMensaje("La dosis ingerida es requerida.");
            return;
        }
        if (horarios.length === 0) {
            setErrorMensaje("Debe agregar al menos una hora de ingesta.");
            return;
        }
        // --- FIN VALIDACIÓN FRONTTEND ---

        const fechaActual = moment().format('YYYY-MM-DD');

        const horarios = horarios.map((horaStr, index) => ({
            numero: index + 1,
            fecha: fechaActual,
            hora: `${horaStr}:00`, // Formato HH:mm:ss
            tomado: false
        }));

        const datosAEnviar = {
            paciente: parseInt(cedula),
            nombre: datos.nombre, // Asegúrate de que el nombre del input sea 'nombre'
            dosis: datos.dosis,
            horarios // Array anidado
        };

        console.log("Datos enviados (Agregar Medicamento):", JSON.stringify(datosAEnviar, null, 2));

        try {
            await AgregarMedicamento(datosAEnviar);
            if (onCloseModal) onCloseModal(); // Cerrar modal al éxito
            navigate(`/paciente/${cedula}`); // Navegar para refrescar la vista
        } catch (error) {
            console.error("Error al registrar medicamento:", error.response?.data || error.message);
            const backendError = error.response?.data || error.message;
            if (typeof backendError === 'object' && backendError !== null) {
                const errorDetails = Object.values(backendError).flat().join(". ");
                setErrorMensaje(`Error al registrar: ${errorDetails}`);
            } else {
                setErrorMensaje(`Error al registrar: ${backendError}`);
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="mx-auto" style={{ width: '16rem' }}>
            <h4 className="text-center mb-4">Registrar Medicamento</h4>

            <Form.Group className="mb-3">
                <Form.Label>Nombre del Medicamento</Form.Label>
                <Form.Control
                    type="text"
                    name="nombre" // Asegúrate de que sea 'nombre' para coincidir con tu API
                    value={datos.nombre || ""}
                    onChange={handleOnChange}
                    placeholder="Ej: Insulina"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Dosis Ingerida</Form.Label>
                <Form.Control
                    type="text"
                    name="dosis"
                    value={datos.dosis || ""}
                    onChange={handleOnChange}
                    placeholder="Ej: 10 unidades"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Row className="align-items-end">
                    <Col xs={9}>
                        <Form.Label>Hora de ingesta</Form.Label>
                        <Form.Control
                            type="time"
                            name="hora"
                            value={datos.hora || ""}
                            onChange={handleOnChange}
                        />
                    </Col>
                    <Col xs={3} className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleAgregarHora}>
                            <AddIcon />
                        </Button>
                    </Col>
                </Row>
            </Form.Group>

            {horarios.length > 0 ? (
                <MCard className="my-3">
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 150,
                        }}
                    >
                        {[...new Set(horarios)].map((item) => ( // Renderiza horarios únicos
                            <ListItem
                                key={item}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleEliminarHora(item)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={moment(item, 'HH:mm').format('hh:mm A')} />
                            </ListItem>
                        ))}
                    </List>
                </MCard>
            ) : null}

            {errorMensaje && <div className="text-danger mb-3 text-center">{errorMensaje}</div>}

            <div className="text-center">
                <Button variant="primary" type="submit">
                    Registrar
                </Button>
            </div>
        </Form>
    );
};

const CambiarMedicamento = ({ medicamento, actualizar, onCloseModal }) => {
    const { cedula } = useParams();
    const [datos, setDatos] = useState(medicamento);
    // Mapea las horarios existentes a solo las horas en formato HH:mm
    const [horarios, setHorarios] = useState(
        medicamento.horarios
            ? medicamento.horarios.map((app) => moment(app.hora, 'HH:mm:ss').format('HH:mm'))
            : []
    );
    const [errorMensaje, setErrorMensaje] = useState("");

    const handleOnChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
        setErrorMensaje("");
    };

    const handleAgregarHora = () => {
        if (datos.hora && datos.hora.trim() !== "") {
            if (!horarios.includes(datos.hora)) {
                setHorarios([...horarios, datos.hora]);
                setDatos({ ...datos, hora: "" });
                setErrorMensaje("");
            } else {
                setErrorMensaje("Esta hora ya ha sido agregada.");
            }
        } else {
            setErrorMensaje("Por favor, ingrese una hora.");
        }
    };

    const handleEliminarHora = async (itemToRemove) => {
        // Encuentra la aplicación_medicamento original si existe para intentar eliminarla por ID
        const appToDelete = medicamento.horarios.find(app => moment(app.hora, 'HH:mm:ss').format('HH:mm') === itemToRemove);

        if (appToDelete && appToDelete.id) {
            try {
                // Llama a tu API para eliminar la aplicación específica por su ID
                await EliminarAplicacionMedicamento(appToDelete.id);
                console.log(`Aplicación con ID ${appToDelete.id} eliminada.`);
            } catch (error) {
                console.error("Error al eliminar aplicación de medicamento:", error.response?.data || error.message);
                setErrorMensaje("Error al eliminar hora. Por favor, intente de nuevo.");
                return; // No elimines del estado si falla la API
            }
        }
        setHorarios(horarios.filter((item) => item !== itemToRemove));
        setErrorMensaje("");
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMensaje("");

        const id = medicamento.id; // ID del medicamento a actualizar
        let envio = {}; // Objeto para enviar solo los campos que han cambiado

        // Validaciones básicas antes de enviar
        if (!datos.nombre || datos.nombre.trim() === "") {
            setErrorMensaje("El nombre del medicamento es requerido.");
            return;
        }
        if (!datos.dosis || datos.dosis.trim() === "") {
            setErrorMensaje("La dosis ingerida es requerida.");
            return;
        }
        if (horarios.length === 0) {
            setErrorMensaje("Debe agregar al menos una hora de ingesta.");
            return;
        }

        // 1. Verificar cambios en nombre y dosis
        if (datos.nombre !== medicamento.nombre) {
            envio = { ...envio, nombre: datos.nombre };
        }
        if (datos.dosis !== medicamento.dosis) {
            envio = { ...envio, dosis: datos.dosis };
        }

        // 2. Manejar cambios en las horarios (horarios)
        const fechaActual = moment().format('YYYY-MM-DD');

        // Horarios que ya estaban y siguen estando (para no enviarlos)
        const horariosOriginalesFormateados = medicamento.horarios
            ? medicamento.horarios.map(app => moment(app.hora, 'HH:mm:ss').format('HH:mm'))
            : [];

        // Horarios nuevos que deben ser creados (no estaban antes)
        const aplicacionesParaCrear = horarios.filter(
            horaFrontend => !horariosOriginalesFormateados.includes(horaFrontend)
        );

        // Si hay aplicaciones para crear, las añadimos al payload
        if (aplicacionesParaCrear.length > 0) {
            envio = {
                ...envio,
                horarios: aplicacionesParaCrear.map((horaStr, index) => ({
                    numero: medicamento.horarios.length + index + 1, // Asigna un nuevo número
                    fecha: fechaActual,
                    hora: `${horaStr}:00`,
                    tomado: false
                }))
            };
        }
        // Nota: La eliminación de aplicaciones se maneja en handleEliminarHora, no aquí en el envío principal.

        console.log("Datos a enviar (Actualizar Medicamento):", JSON.stringify(envio, null, 2));

        if (Object.keys(envio).length === 0) {
            setErrorMensaje("No hay cambios para guardar.");
            return;
        }

        try {
            await ActualizarMedicamento(id, envio);
            actualizar({ id: medicamento.id }); // Disparar la actualización en el componente padre
            if (onCloseModal) onCloseModal(); // Cerrar modal al éxito
        } catch (error) {
            console.error("Error al actualizar medicamento:", error.response?.data || error.message);
            const backendError = error.response?.data || error.message;
            if (typeof backendError === 'object' && backendError !== null) {
                const errorDetails = Object.values(backendError).flat().join(". ");
                setErrorMensaje(`Error al actualizar: ${errorDetails}`);
            } else {
                setErrorMensaje(`Error al actualizar: ${backendError}`);
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="mx-auto" style={{ width: '16rem' }}>
            <h4 className="text-center mb-4">Actualizar Medicamento</h4>

            <Form.Group className="mb-3">
                <Form.Label>Nombre del Medicamento</Form.Label>
                <Form.Control
                    type="text"
                    name="nombre"
                    value={datos.nombre || ""}
                    onChange={handleOnChange}
                    placeholder="Medicamento"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Dosis Ingerida</Form.Label>
                <Form.Control
                    type="text"
                    name="dosis"
                    value={datos.dosis || ""}
                    onChange={handleOnChange}
                    placeholder="Dosis"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Row className="align-items-end">
                    <Col xs={9}>
                        <Form.Label>Hora de ingesta</Form.Label>
                        <Form.Control
                            type="time"
                            name="hora"
                            value={datos.hora || ""}
                            onChange={handleOnChange}
                        />
                    </Col>
                    <Col xs={3} className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleAgregarHora}>
                            <AddIcon />
                        </Button>
                    </Col>
                </Row>
            </Form.Group>

            {horarios.length > 0 ? (
                <MCard className="my-3">
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 150,
                        }}
                    >
                        {[...new Set(horarios)].map((item) => (
                            <ListItem
                                key={item}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleEliminarHora(item)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={moment(item, 'HH:mm').format('hh:mm A')} />
                            </ListItem>
                        ))}
                    </List>
                </MCard>
            ) : null}

            {errorMensaje && <div className="text-danger mb-3 text-center">{errorMensaje}</div>}

            <div className="text-center">
                <Button variant="primary" type="submit">
                    Actualizar
                </Button>
            </div>
        </Form>
    );
};




const MostrarModal = () => {
    const [show, setShow] = useState(false); // Estado para el modal de Añadir Medicamento
    const [showEdit, setShowEdit] = useState(false); // Estado para el modal de Editar Medicamento
    const [medicamentoToEdit, setMedicamentoToEdit] = useState(null); // Datos del medicamento a editar
    const [updateTrigger, setUpdateTrigger] = useState(0); // Para forzar la actualización de VerMedicamento

    const handleShowAdd = () => setShow(true);
    const handleCloseAdd = () => {
        setShow(false);
        setUpdateTrigger(prev => prev + 1); // Disparar refresco de VerMedicamento
    };

    const handleShowEdit = (data) => {
        setMedicamentoToEdit(data);
        setShowEdit(true);
    };
    const handleCloseEdit = () => {
        setShowEdit(false);
        setUpdateTrigger(prev => prev + 1); // Disparar refresco de VerMedicamento
    };

    return (
        <>
            <Card className="mx-auto" style={{ maxWidth: '28rem' }}>
                <Card.Body>
                    <Card.Title className="text-center">Medicamentos</Card.Title>
                    {/* Pasa updateTrigger a VerMedicamento para que se refetch la data cuando se agregue/actualice/elimine */}
                    <VerMedicamento updateTrigger={updateTrigger} setEditar={handleShowEdit} />
                    <div className="text-center mt-3">
                        <Button variant="primary" onClick={handleShowAdd}>
                            Registrar medicamento
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal para añadir nuevo medicamento */}
            <Modal open={show} setOpen={setShow} nombre={"Nuevo medicamento"}>
                <Medicamento onCloseModal={handleCloseAdd} />
            </Modal>

            {/* Modal para editar medicamento existente */}
            {medicamentoToEdit && ( // Solo renderizar si hay un medicamento para editar
                <Modal open={showEdit} setOpen={setShowEdit} nombre={`Editar ${medicamentoToEdit.nombre}`}>
                    <CambiarMedicamento
                        medicamento={medicamentoToEdit}
                        actualizar={setMedicamentoToEdit} // Mantén esto si necesitas el estado del modal de edición
                        onCloseModal={handleCloseEdit}
                    />
                </Modal>
            )}
        </>
    );
};

export default MostrarModal;