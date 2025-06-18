import React, { useState } from 'react';
import UploadImage from "./UploadImage";
import { useNavigate } from 'react-router-dom';
import { Row, Col, Image as Imagen, Button, Form, Card, Alert } from 'react-bootstrap';
import { RegistrarPaciente } from '../api/glicemiappService';

const P_reg = () => {
    const history = useNavigate();
    const [image, setImage] = useState('');
    const [datos, setDatos] = useState({});
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nombre_completo, telefono, cedula, edad, eps } = datos;

        // Validaciones
        if (!eps || !nombre_completo || !telefono || !cedula || !edad) {
            setError("Todos los campos son obligatorios");
            return;
        }
        if (!/^[0-9]{10}$/.test(telefono)) {
            setError("El teléfono no es válido");
            return;
        }
        if (!/^[a-zA-Z ]+$/.test(nombre_completo)) {
            setError("El nombre no es válido");
            return;
        }
        if (!/^[0-9]{10}$/.test(cedula)) {
            setError("La cédula no es válida");
            return;
        }
        if (!/^[0-9]{1,3}$/.test(edad)) {
            setError("La edad no es válida");
            return;
        }

        try {
            const paciente = {
                foto: image,
                nombre:datos.nombre_completo,
                cedula:datos.cedula,
                telefono:datos.telefono,
                edad:datos.edad,
                eps:datos.eps,
            };

            await RegistrarPaciente(paciente); // ✅ usa tu función de API
            history('/');
        } catch (error) {
            setError("Error al registrar: " + (error.response?.data || "Intenta más tarde."));
        }
    };

    return (
        <Card className="mx-auto" style={{ width: '20rem' }}>
            <Card.Header>
                <h2 className="fw-bold text-center">Paciente</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col className="text-center">
                            <Imagen className="my-1 tamañoImg" src={image ? image : 'userIcon.png'} roundedCircle />
                            <UploadImage image={setImage} />
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Nombre" name="nombre_completo" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control type="text" placeholder="Teléfono" name="telefono" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Cédula</Form.Label>
                        <Form.Control type="text" placeholder="Cédula" name="cedula" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Edad</Form.Label>
                        <Form.Control type="text" placeholder="Edad" name="edad" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>EPS</Form.Label>
                        <Form.Control type="text" placeholder="EPS" name="eps" onChange={handleChange} />
                    </Form.Group>
                    <div className="text-center">
                        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                        <Button variant="primary" type="submit">
                            Registrar
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default P_reg;
