import React, { useEffect, useState }  from 'react'
import axios from 'axios'
import { Row, Table, Button, Col } from 'react-bootstrap';

import ModalAddTarefa from './modalAddTarefa';

function Prioridade({nivel}){
    switch(nivel){
        case '1':
            return <h5>Crítico</h5>
        case '2':
            return <h5>Alta</h5>
        case '3':
            return <h5>Moderada</h5>
        case '4':
            return <h5>Baixa</h5>
        default:
            return <h5>Ops</h5>
    }
}

function Tarefas() {

    const [tarefas, setTarefas] = useState([])
    const [showModalAddTarefa, setShowModalAddTarefa] = useState(false)
    const [tarefaSelecionada, setTarefaSelecionada] = useState(false)

    function loadTarefas(){
        axios.get(process.env.REACT_APP_API_URL+'tarefa').then(result=>{
            if(result.status===200){
                setTarefas(result.data.data.tarefas)
            }else{
                alert('Ops, aconteceu alguma coisa errada');
            }
        }).catch(err=>{
            alert('Ops, aconteceu algum problema. Consulte o Log para maiores informações')
            console.log(err);
        })
    }

    useEffect(()=>{
        loadTarefas();
    },[])

    function handleOpenModalAddTarefa() {
        setShowModalAddTarefa(true);
    }

    function handleOpenTarefa(tarefa){
        setTarefaSelecionada(tarefa)
        setShowModalAddTarefa(true);
    }

    function handleCloseModal(){
        setShowModalAddTarefa(false);
        setTarefaSelecionada(false);
    }

    return (
        <div className="starter-template">
            <Row>
                <h1>Tarefas <Button onClick={handleOpenModalAddTarefa}>Adicionar Tarefa</Button></h1>
            </Row>
            {
                tarefas && !!tarefas.length && (
                    <Row>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th className="text-center">Prioridade</th>
                                    <th className="text-center">Título</th>
                                    <th className="text-center">Situação</th>
                                    <th className="text-center">Descrição</th>
                                    <th className="text-center">Usuário</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tarefas && tarefas.map(tarefa=>{
                                        return (
                                            <tr key={tarefa.ido}>
                                                <td className="text-center">{tarefa.ido}</td>
                                                <td className="text-center">
                                                    <Prioridade nivel={tarefa.prioridade} />
                                                </td>
                                                <td><span style={{color:'blue', cursor:'pointer', textDecoration:'underline'}} onClick={()=>handleOpenTarefa(tarefa)}>{tarefa.titulo}</span></td>
                                                <td className="text-center">{tarefa.situacao_descricao}</td>
                                                <td >{tarefa.descricao}</td>
                                                <td className="text-center">{tarefa.pessoa_nome}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </Row>
                )
            }
            {
                tarefas && !!!tarefas.length && (
                    <Row className="text-center">
                        <Col>
                            Sem tarefas para exibir!    
                        </Col>
                    </Row>
                )
            }
            
            <ModalAddTarefa show={showModalAddTarefa} closeModal={handleCloseModal} tarefaSelecionada={tarefaSelecionada} clearTarefa={setTarefaSelecionada} realoadTarefas={loadTarefas}/>
            
        </div>
    );
}

export default Tarefas;
