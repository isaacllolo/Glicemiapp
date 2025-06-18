import React , {useState}  from "react";
import { Button, Form, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Registro } from "../api/glicemiappService";

const Reg = () => {
    const history = useNavigate();
    const [user, setUser] = useState({});
    const [error, setError] = useState(false);
    const handleChange = (e) => {
    const { name, value } = e.target;
            setUser({ ...user, [name]: value });
        };
        const  handleSubmit = async (e) => { 
            const emailregex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            e.preventDefault();
            const { nombre_completo, telefono, email, password, confPassword:password2 } = user;
            if(!email || !nombre_completo || !telefono || !password){
                setError("Todos los campos son obligatorios");
                return;
            }
            if(!emailregex.test(email)){
                setError("El email no es válido");
                return;
            }
            if(password.length<8){
                setError("La contraseña debe tener al menos 8 caracteres");
                return;
            }
            if(!RegExp(/^[0-9]{10}$/).test(telefono)){
                setError("El teléfono no es válido");
                return;
            }
            if(!RegExp(/^[a-zA-Z ]+$/).test(nombre_completo)){
                setError("El nombre no es válido");
                return;
            }
   
            if(password !== password2){
                setError("Las contraseñas no coinciden");
                return;
            }
            try {
                    Registro(user);
                    history('/login');
                }
            catch (error) {
                setError(error.response.data);
            }
        };  
    return(
        <Card className="mx-auto my-5 logregcard" style={{ width: '22rem' , marginTop: 'auto'}}>
            <Card.Header>{
                }
            <h2 className="fw-bold text-center">Registro</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" name="nombre_completo" placeholder="Nombre" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control type="text" placeholder="Teléfono" name="telefono" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group  className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Email" name="email" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" placeholder="Contraseña" name="password" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPasswordConf">
                        <Form.Label>Confirmar contraseña</Form.Label>
                        <Form.Control type="password" placeholder="Confirmar contraseña" name="confPassword" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Label className='reglabel'>¿Ya tienes una cuenta? <Link to="/login">Ingresa aquí</Link></Form.Label>            
                    </Form.Group>
                    <div className="text-center">
                        <Alert variant="danger" className="mt-3" show={error}>
                            {error}
                        </Alert>
                        <Button variant="primary"  type="submit">
                            Registrar
                        </Button>   
                    </div>       
                </Form>
            </Card.Body>
        </Card>
    );
}
export default Reg