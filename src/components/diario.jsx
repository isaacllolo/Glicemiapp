import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Image,
  Button,
  Form,
  FormControl,
  InputGroup,
  Card,
} from "react-bootstrap";
import BarChart from "./graphics";
import "../styles/diario.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  ObtenerDiario,
  ObtenerPaciente,
  GuardarDiario,
} from "../api/glicemiappService";
import moment from "moment";
import * as XLSX from "xlsx";

// Componente para cada fila de la tabla
const PData = ({ fecha, hora, glucosa, insulina }) => {
  const fechaObj = new Date(fecha);
  return (
    <tr>
      <th className="fw-normal" scope="row">
        {fechaObj.getDate()}/{fechaObj.getMonth() + 1}/{fechaObj.getFullYear()}
      </th>
      <td>{hora}</td>
      <td>{glucosa}</td>
      <td>{insulina}</td>
    </tr>
  );
};

// Tabla de seguimiento + exportación + gráfico
const Seguimiento = ({ actualizar }) => {
  const [datos, setDatos] = useState([]);
  const { cedula } = useParams();

  const obtenerDatos = async () => {
    const response = await ObtenerDiario(cedula);
    setDatos(response || []);
  };

  useEffect(() => {
    obtenerDatos();
  }, [actualizar]);

  const exportarDatos = () => {
    const dataExportada = datos.map((item) => ({
      Fecha: moment(item.fecha).format("DD/MM/YYYY"),
      Hora: moment(item.hora, "HH:mm:ss").format("HH:mm"),
      Glucosa: item.glucosa,
      Insulina: item.insulina,
    }));

    const hoja = XLSX.utils.json_to_sheet(dataExportada);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Datos");
    XLSX.writeFile(libro, "diario_datos.xlsx");
  };

  return (
    <div className="page-content">
      <div className="table-responsive text-center">
        <table className="table table-hover mb-0">
          <thead className="Table-thead">
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Glucosa (mg/dl)</th>
              <th>Insulina (ml)</th>
            </tr>
          </thead>
          <tbody>
            {datos?.length > 0 &&
              datos.map((dato, idx) => (
                <PData
                  key={idx}
                  fecha={dato.fecha}
                  hora={dato.hora}
                  glucosa={dato.glucosa}
                  insulina={dato.insulina}
                />
              ))}
          </tbody>
        </table>
        <div className="text-center">
          <Button className="my-3" onClick={exportarDatos}>
            Exportar
          </Button>
        </div>
      </div>

      <div className="page-content-1">
        <BarChart datos={datos} />
      </div>
    </div>
  );
};

// Componente principal Diario
const Diario = () => {
  const navigate = useNavigate();
  const { cedula } = useParams();

  const [paciente, setPaciente] = useState(null);
  const [datos, setDatos] = useState({ glucosa: "", insulina: "" });
  const [actualizar, setActualizar] = useState({});

  const obtenerPaciente = async () => {
    try {
      const res = await ObtenerPaciente(cedula);
      console.log(res);
      if (!res) {
        navigate("/pacientes");
      } else {
          setPaciente(res);
      }
    } catch (error) {
      console.error("Error al obtener paciente:", error);
      navigate("/pacientes");
    }
  };

  useEffect(() => {
    obtenerPaciente();
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const glucosa = parseFloat(datos.glucosa);
    const insulina = parseFloat(datos.insulina);

    if (isNaN(glucosa) || isNaN(insulina)) {
      alert("Por favor, ingresa valores válidos.");
      return;
    }

    const payload = { glucosa, insulina };

    try {
      const { data } = await GuardarDiario(cedula, payload);
      setActualizar(data);
      setDatos({ glucosa: "", insulina: "" });
    } catch (error) {
      console.error("Error al guardar el diario:", error);
    }
  };

  return (
    <>
      <Card className="mx-auto" style={{ maxWidth: "23rem" }}>
        <Card.Header>
          <Row>
            <Col className="mx-auto text-center">
              <Image
                className="my-1"
                src={paciente?.foto}
                roundedCircle
              />
              <h2 className="fs-3">{paciente?.nombre || "..."}</h2>
              <h4 className="fs-5">Edad: {paciente?.edad || "--"}</h4>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <h3 className="text-center">Diario</h3>
          <h5 className="text-center">Registro de azúcar</h5>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-2">
              <FormControl
                placeholder="Nivel de azúcar"
                name="glucosa"
                type="number"
                min="0"
                value={datos.glucosa}
                onChange={handleOnChange}
                required
              />
              <InputGroup.Text className="fw-bold">mg/dl</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-2">
              <FormControl
                placeholder="Insulina"
                name="insulina"
                type="number"
                min="0"
                value={datos.insulina}
                onChange={handleOnChange}
                required
              />
              <InputGroup.Text className="fw-bold">ml</InputGroup.Text>
            </InputGroup>
            <div className="text-center">
              <Button className="mt-3" type="submit">
                Registrar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Seguimiento actualizar={actualizar} />
    </>
  );
};

export default Diario;
