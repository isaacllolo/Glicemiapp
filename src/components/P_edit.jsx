import React, { useState } from 'react';
import UploadImage from "./UploadImage";
import { useNavigate } from 'react-router-dom';
import { Row, Col, Image as Imagen, Button, Form, Alert } from 'react-bootstrap';
import { EditarPaciente } from '../api/glicemiappService';

const P_edit = ({ userdata, changeData }) => {
    const history = useNavigate();
    const [datos, setDatos] = useState({ ...userdata });
    const [error, setError] = useState('');
    const [image, setImage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos({
            ...datos,
            [name]: value,
        });
    };

    const validarCampos = () => {
        const { nombre, telefono, cedula, edad, eps } = datos;
        if (!eps || !nombre || !telefono || !cedula || !edad) return "Todos los campos son obligatorios";
        if (!/^[0-9]{10}$/.test(telefono)) return "El teléfono no es válido";
        if (!/^[a-zA-Z ]+$/.test(nombre.trim())) return "El nombre no es válido";
        if (cedula !== userdata.cedula && !/^[0-9]{6,10}$/.test(cedula)) {
            setError("La cédula no es válida");
               return;
        }

        if (!/^[0-9]{1,3}$/.test(edad)) return "La edad no es válida";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const errorValidacion = validarCampos();
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        const data = {
            ...datos,
            nombre: datos.nombre.trim(),
        };

        if (image) {
            data.foto = image;
        }

        // Eliminar campos vacíos excepto cédula
        Object.keys(data).forEach((key) => {
            if ((data[key] === null || data[key] === '') && key !== 'cedula') {
                delete data[key];
            }
        });

        try {
            const pacienteEdit = await EditarPaciente(data.cedula, data);
            changeData(pacienteEdit, userdata.cedula);
            history(-1); // Volver atrás
        } catch (error) {
            setError(error.response?.data?.message || "Error al editar");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="text-center">
                    <Imagen
                        className="my-1 tamañoImg"
                        src={image || datos.foto || 'userIcon.png'}
                        roundedCircle
                    />
                    <UploadImage image={setImage} />
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    value={datos.nombre}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Teléfono"
                    name="telefono"
                    value={datos.telefono}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Cédula</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Cédula"
                    name="cedula"
                    value={datos.cedula}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Edad</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Edad"
                    name="edad"
                    value={datos.edad}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>EPS</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="EPS"
                    name="eps"
                    value={datos.eps}
                    onChange={handleChange}
                />
            </Form.Group>

            {error && (
                <Alert variant="danger" className="mt-2">
                    {error}
                </Alert>
            )}

            <div className="text-center">
                <Button variant="primary" type="submit">
                    Guardar cambios
                </Button>
            </div>
        </Form>
    );
};

export default P_edit;
