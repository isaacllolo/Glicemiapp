import React,{useState} from 'react';
import UploadImage from "./UploadImage";
import { useNavigate } from 'react-router-dom';
import { Row, Col, Image as Imagen, Button, Form, Alert } from 'react-bootstrap';
import { EditarPaciente } from '../api/glicemiappService';

const P_edit = ({userdata,changeData}) => {
    const history = useNavigate();
    const [datos,setDatos]=useState({...userdata})
    const [error,setError]=useState(false);
    const [image, setImage] = useState('');
    const handleChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = async(e) => {
        let data = datos;
        e.preventDefault();
        const { nombre, telefono, cedula, edad, eps} = datos;
        if (!eps || !nombre|| !telefono || !cedula || !edad) {
            setError("Todos los campos son obligatorios");
            return;
        }
        if (!RegExp(/^[0-9]{10}$/).test(telefono)) {
            setError("El teléfono no es válido");
            return;
        }
        if (!RegExp(/^[a-zA-Z ]+$/).test(nombre)) {
            setError("El nombre no es válido");
            return;
        }

        if (!RegExp(/^[0-9]{10}$/).test(cedula)) {
            setError("La cedula no es válida");
            return;
        }
        if (!RegExp(/^[0-9]{1,3}$/).test(edad)) {
            setError("La edad no es válida");
            return;
        }
        if (image !== '') {
            data.foto = image;
        }
        Object.keys(datos).forEach((key) => (data[key] == null || data[key] == ''|| data[key] == userdata[key]) && delete data[key]);
        try {

            console.log(paciente);
        const {data:pacienteEdit }= EditarPaciente(cedula,{...data});
        changeData(pacienteEdit.paciente,userdata.cedula);
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    return(
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col className="text-center">
                            <Imagen className="my-1 tamañoImg" src={image? image : datos.foto}  roundedCircle/>
                            <UploadImage image={setImage}/>
                            
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Nombre" name="nombre" value={datos.nombre}  onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control type="text" placeholder="Teléfono" name="telefono" value={datos.telefono}   onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Cédula</Form.Label>
                        <Form.Control type="text" placeholder="Cédula" name="cedula" value={datos.cedula}   onChange={handleChange}/>   
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Edad</Form.Label>
                        <Form.Control type="text" placeholder="Edad" name="edad" value={datos.edad}   onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>EPS</Form.Label>
                        <Form.Control type="text" placeholder="EPS" name="eps" value={datos.eps}   onChange={handleChange}/>
                    </Form.Group>
                    <div className="text-center">
                        <Alert variant="danger" className="mt-3" show={error}>
                            {error}
                        </Alert>
                    <Button variant="primary" type="submit">
                        Registrar
                    </Button>
                    </div>    
                </Form>
           
    );
}
export default P_edit