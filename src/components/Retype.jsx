import React,{useState,useEffect}from 'react';
import UploadImage from "./UploadImage";
import { Row, Col, Image as Imagen, Button, Form, Card } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';
import { CambiarTipo,RegistrarPaciente} from '../api/glicemiappService';
//cambiar las dimensiones de la imagen en base64 a 100x100 y regresarla como base 64

const P_reg = () => {
    const history = useNavigate();
    const [image, setImage] = useState('');
    const [datos, setDatos] = useState({}); 
    const [user, setUser] = useState({});

    const getdata = async () => {
       const usuarioString= localStorage.getItem('usuario');
       const usuario = JSON.parse(usuarioString);
       console.log(usuario);
        setUser(usuario);
    }

    

    useEffect(() => {
        getdata();
    }, []);
   

    const handleChange = async(e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
        
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
         await CambiarTipo('unico');
        localStorage.setItem('tipo', 'unico');

        await RegistrarPaciente({
            ...datos,
            nombre: user.nombre_completo,
            telefono: user.telefono,
        });
        history('/');
    }
    return(
        <Card className="mx-auto" style={{ maxWidth: '20rem'  }}>
            <Card.Header>
            <h2 className="fw-bold text-center">Paciente</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col className="text-center">
                            <Imagen className="my-1 tamañoImg" src={image? image:'userIcon.png'}  roundedCircle/>
                            <UploadImage image={setImage}/>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Cédula</Form.Label>
                        <Form.Control type="text" placeholder="Cédula" name="cedula" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Edad</Form.Label>
                        <Form.Control type="text" placeholder="Edad" name="edad" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>EPS</Form.Label>
                        <Form.Control type="text" placeholder="EPS" name="eps" onChange={handleChange}/>
                    </Form.Group>
                    <div className="text-center">
                    <Button variant="primary" type="submit">
                        Registrar
                    </Button>
                    </div>    
                </Form>
            </Card.Body>
    </Card> 
    );
}
export default P_reg