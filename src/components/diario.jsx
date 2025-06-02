import React, {useState,useEffect} from "react";
import { Row, Col, Image, Button, Form, FormControl, InputGroup, Card } from 'react-bootstrap';
import BarChart from "./graphics";
import '../styles/diario.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ObtenerDiario , ObtenerPaciente ,GuardarDiario } from "../api/glicemiappService";
import moment from "moment";
import * as XLSX from 'xlsx/xlsx.mjs';
const PData = (props) => {
    const  fecha = new Date(props.fecha);
    return (
        <tr>
            <th className="fw-normal" scope="row">{fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()}</th>
            <td>{props.hora}</td>
            <td>{props.glucosa}</td>
            <td>{props.Insulina}</td>
        </tr>
    );
}

const Seguiminto = ({actualizar}) => {
    const [datos,setDatos]=useState([])
    
    const {cedula}=useParams();
    const obtener_datos = async() => { 
        const datos = await ObtenerDiario(cedula);
        setDatos(datos.data)
    }
    useEffect(() => {
        obtener_datos();
    }, [actualizar]);
    
    const exportdata=()=>{
        const sheet =XLSX.utils.json_to_sheet(datos.map((item)=>{return {fecha:moment(item.fecha).format("DD/MM/YYYY"),hora:moment(item.hora,"HH:mm:ss").format("HH:mm"),glucosa:item.glucosa,insulina:item.insulina}}))
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook,sheet,"datos")
        XLSX.writeFile(workbook,"diario_datos.xlsx")
    }
    return(
        <div className="page-content">
                <div className="table-responsive text-center">
                    <table className="table table-hover mb-0">
                        <thead className="Table-thead">
                            <tr>
                                <th scope="col">Fecha</th>
                                <th scope="col">Hora</th>
                                <th scope="col">Glucosa(mg/dl)</th>
                                <th scope="col">Insulina(ml)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                datos!==undefined? datos.map((dato) => {
                                    return (
                                        <PData fecha={dato.fecha} hora={dato.hora} glucosa={dato.glucosa} Insulina={dato.insulina} />
                                    )   
                                } ):null
                            }
                        </tbody>

                    </table>
                    <div className="text-center">
                    <Button className="my-3" onClick={exportdata}>Exportar</Button>
                </div>
                </div>
                <div className="page-content-1">        
            <BarChart datos={datos} />
            </div>
            </div>
    ) 
} 

const Diario = () => {
    const history = useNavigate();
    const [paciente, setPaciente] = useState({});
    const [datos,userdatos]=useState({})
    const [actualizar,setActualizar]=useState({})
    let {cedula}=useParams();
    const obtener_paciente = async() => {
        const res = await ObtenerPaciente(cedula);
        if(res.data===null){
            history('/pacientes');
        }
        setPaciente({...res.data}); 
        userdatos({
            glucosa: "",
            Insulina: "",
            fecha: new Date(),
            hora: new Date().toLocaleTimeString()
        });
        
    }
    useEffect(() => {
        obtener_paciente();
    }, []);


    //guardar hora y fecha actual
    const fecha = new Date();
    const hora = fecha.getHours() + ":" + fecha.getMinutes();
    const fechaActual = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
    
    const handleonChange = (e) => {
        userdatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    
    }
    const handleSubmit = async (e) => {

        e.preventDefault();
       const {data}= ObtenerDiario(cedula,datos)
         setActualizar(data)
    }
    
    return (
        <>
            <Card className="mx-auto" style={{ maxWidth: '23rem' }}>
                <Card.Header>
                    <Row>
                        <Col className="mx-auto text-center">
                            <Image className="my-1" src={paciente.foto===""?"userIcon.png":import.meta.env.VITE_APP_URI+"/public/"+paciente.foto} roundedCircle />
                            <h2 className="fs-3">{paciente.nombre}</h2>
                            <h4 className="fs-5">Edad:{paciente.edad}</h4>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <h3 className="text-center">Diario</h3>
                    <h5 className="text-center">Registro de azúcar</h5>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup className="mb-md-2 mb-2">
                            <FormControl placeholder="Nivel de azúcar" aria-label="Nivel de azúcar" aria-describedby="basic-addon2" name="glucosa" onChange={handleonChange}/>
                            <InputGroup.Text className="fw-bold">mg/dl</InputGroup.Text>
                        </InputGroup>
                        <InputGroup>
                            <FormControl placeholder="Insulina" aria-label="Insulina" aria-describedby="basic-addon2" name="Insulina" onChange={handleonChange}/>
                            <InputGroup.Text className="fw-bold">ml</InputGroup.Text>
                        </InputGroup>
                        <div className="text-center">
                            <Button className="mt-3" type='submit'>Registrar</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <Seguiminto actualizar={actualizar} />
            

        </>
    );
}
export default Diario;