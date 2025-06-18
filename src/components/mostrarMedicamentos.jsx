import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import { Obtenermedicamento, EliminarMedicamento, ActualizarCheck } from "../api/glicemiappService";
import moment from 'moment';
import { generarICS } from '../utils/icsGenerator';

const ModalEliminar = ({ show: medicamento, setShow, eliminar }) => {
  const handleClose = () => setShow();

  const eliminarMedicamento = async () => {
    try {
      await EliminarMedicamento(medicamento.id);
      eliminar(medicamento.id);
      handleClose();
    } catch (error) {
      console.error("Error eliminando medicamento:", error);
    }
  };

  return (
    <Modal show={!!medicamento} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar medicamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Está seguro que desea eliminar este medicamento?</Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="danger" onClick={eliminarMedicamento}>
          Eliminar medicamento
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const verMedicamentos = ({ setEditar, actualizacion }) => {
  const { cedula } = useParams();
  const [medicamentos, setMedicamentos] = useState([]);
  const [mostrarModalICS, setMostrarModalICS] = useState(false);
  const [eliminar, setEliminar] = useState();

const setUso = async (id, hora, check) => {
  try {
    await ActualizarCheck(id, hora, check);
    setMedicamentos(prev =>
      prev.map(medicamento => {
        if (medicamento.id === id) {
          return {
            ...medicamento,
            horarios: medicamento.horarios.map(h =>
              h.hora === hora ? { ...h, fecha: check ? new Date() : null } : h
            ),
          };
        }
        return medicamento;
      })
    );
  } catch (error) {
    console.error("Error actualizando check:", error);
  }
};


  const handleDescargarRecordatorio = () => {
    const aplicaciones = medicamentos.flatMap(m =>
      m.horarios.map((h, i) => ({
        numero: i + 1,
        fecha: h.fecha,
        hora: h.hora,
        tomado: h.tomado,
      }))
    );
    generarICS(aplicaciones, "Paciente");
    setMostrarModalICS(false);
  };

  const obtener_medicamentos = async () => {
    try {
      const res = await Obtenermedicamento(cedula);
      console.log("Medicamentos:", res);
      setMedicamentos(res);
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
    }
  };

  useEffect(() => {
    obtener_medicamentos();
  }, []);

  useEffect(() => {
    setMedicamentos(medicamentos.map(medicamento =>
      medicamento.id === actualizacion.id ? actualizacion : medicamento
    ));
  }, [actualizacion]);

  const eliminarMedicamento = async (id) => {
    setMedicamentos(medicamentos.filter(medicamento => medicamento.id !== id));
  };

  if (medicamentos.length === 0) {
    return (
      <h5 className="text-center">No hay medicamentos</h5>
    );
  }

  return (
    <>
      <div className="text-center my-4">
        <Button variant="success" onClick={() => setMostrarModalICS(true)}>
          📅 Descargar Recordatorios
        </Button>
      </div>

      <div className="table-responsive text-center">
        <table className="table table-hover">
          <tbody className="text-center align-items-center">
            <tr>
              <th className="text-center align-middle">Medicamento</th>
              <th className="text-center align-middle">Dosis</th>
              <th className="text-center align-middle">Horario</th>
              <th className="text-center align-middle">Check</th>
              <th></th>
            </tr>
            {medicamentos.map((medicamento, index) => (
              <tr key={index}>
                <td className="text-center align-middle">{medicamento.nombre}</td>
                <td className="text-center align-middle">{medicamento.dosis}</td>
                <td className="text-center align-middle">
                  {medicamento.horarios.map((horario, i) => (
                    <div key={i}>
                      {moment(horario.hora, 'HH:mm').format('hh:mm A')}
                    </div>
                  ))}
                </td>
                <td className="text-center align-middle">
                  {medicamento.horarios.map((horario, i) => (
                    <div key={i}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!!horario.fecha}
                        onChange={(e) =>
                          setUso(medicamento.id, horario.hora, e.target.checked)
                        }
                      />
                    </div>
                  ))}
                </td>
                <td className="text-center align-middle">
                  <FaIcons.FaPen
                    onClick={() => setEditar(medicamento)}
                    style={{ cursor: "pointer" }}
                    className="fa-2x text-primary my-2"
                  />
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setEliminar(medicamento)}
                  >
                    <FaIcons.FaTrash className="fa-2x text-danger my-2" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalEliminar
        eliminar={eliminarMedicamento}
        show={eliminar}
        setShow={() => setEliminar()}
      />

      <Modal show={mostrarModalICS} onHide={() => setMostrarModalICS(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Descargar recordatorios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Se generará un archivo compatible con tu calendario con los horarios de los medicamentos. ¿Deseas continuar?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalICS(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleDescargarRecordatorio}>
            Descargar archivo .ICS
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default verMedicamentos;
