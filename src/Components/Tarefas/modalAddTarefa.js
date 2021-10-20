import React,{useState, useEffect} from 'react';
import { Modal, Button, Form, Spinner, } from 'react-bootstrap';
import { Input,FormGroup, Label } from 'reactstrap';
import axios from 'axios';



function ModalAddTarefa({show, closeModal, tarefaSelecionada, realoadTarefas}) {

    const initialState = {
        ido: null,
        titulo: '',
        descricao: '',
        prioridade: 0,
        situacao:1,
        pessoa: 0
    }
    
    const [isLoading, setLoading] = useState(false);
    const [tarefa, setTarefa] = useState(initialState);
    
    function clearForm(){
        setTarefa(initialState);
    }

    function resolveRequest(result){
            clearForm(); 
            closeModal()
            realoadTarefas();
            setLoading(false);
            alert(result.data.messages.success)
    }

    function handleClose() {
        closeModal();
        clearForm();
    }

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const params = new URLSearchParams();
        params.append('titulo', tarefa.titulo);
        params.append('descricao', tarefa.descricao);
        params.append('prioridade', tarefa.prioridade);
        params.append('pessoa', tarefa.pessoa);

        if(!tarefa.ido){
            axios.post(process.env.REACT_APP_API_URL+'tarefa',params).then(result=>{
                resolveRequest(result)
            }).catch(error => {
                alert('Ops, aconteceu algum problema.\n'+ error.response.data.messages.error)
                setLoading(false);
            })
        }else{
            params.append('situacao', tarefa.situacao);
            axios.put(process.env.REACT_APP_API_URL+'tarefa/'+tarefa.ido,params).then(result=>{
                resolveRequest(result)
            }).catch(error => {
                alert('Ops, aconteceu algum problema.\n'+ error.response.data.messages.error)
                setLoading(false);
            })
        }
    }

    function handleDeleteTarefa(){
        let decisao = window.confirm('Você está certo disso?');
        if(decisao){
            setLoading(true);
            axios.delete(process.env.REACT_APP_API_URL+'tarefa/'+tarefa.ido).then(result=>{
                resolveRequest(result)
            })
        }else{
            closeModal(true)
        }
    }

    useEffect(()=>{
        if(tarefaSelecionada){
            setTarefa(tarefaSelecionada)
        }
    },[tarefaSelecionada])

  return (
    <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
            <Modal.Header>
                {
                    tarefa.ido && (
                        <Modal.Title>Editando #{tarefa.ido}</Modal.Title>
                    )
                }
                {
                    !tarefa.ido && (
                        <Modal.Title>Nova Tarefa</Modal.Title>
                    )
                }
            </Modal.Header>
            <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control value={tarefa.titulo} required type="text" placeholder="Digite o título" onChange={(e)=>setTarefa({...tarefa,titulo:e.target.value})} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control value={tarefa.descricao} required as="textarea"  placeholder="Digite a descrição" onChange={(e)=>setTarefa({...tarefa,descricao:e.target.value})} />
                    </Form.Group>
                    <FormGroup className="mb-3">
                        <Label>Prioridade</Label>
                        <Input
                            type="select"
                            required
                            value={tarefa.prioridade}
                            onChange={(e)=>setTarefa({...tarefa,prioridade:e.target.value})}
                        >
                            <option value="0" disabled>Selecione</option>
                            <option value="1">Crítica</option>
                            <option value="2">Alta</option>
                            <option value="3">Moderada</option>
                            <option value="4">Baixa</option>
                        </Input>
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <Label>Usuário</Label>
                        <Input
                            type="select"
                            value={tarefa.pessoa==null?0:tarefa.pessoa}
                            onChange={(e)=>setTarefa({...tarefa,pessoa:e.target.value})}
                        >
                            <option value="0" >Selecione</option>
                            <option value="1">Fulano de Tal</option>
                            <option value="2">Ciclano de Tal</option>
                        </Input>
                    </FormGroup>
                    {
                        tarefa.ido && (
                            <FormGroup className="mb-3">
                                <Label>Situação</Label>
                                <Input
                                    type="select"
                                    value={tarefa.situacao}
                                    onChange={(e)=>setTarefa({...tarefa,situacao:e.target.value})}
                                >
                                    <option value="0" disabled>Selecione</option>
                                    <option value="1">Pendente</option>
                                    <option value="2">Em Andamento</option>
                                    <option value="3">Concluída</option>
                                </Input>
                            </FormGroup>
                        )
                    }
            </Modal.Body>
            <Modal.Footer>
                {
                    tarefa.ido && (
                        <>
                             <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                                Fechar
                            </Button>
                            <Button variant="danger" onClick={handleDeleteTarefa} disabled={isLoading}>
                                {
                                    isLoading && (
                                        <Spinner animation="border" size="sm" />
                                    )
                                }
                                {
                                    !isLoading && (
                                        <span>Deletar</span>
                                    )
                                }
                            </Button>
                            <Button variant="primary" type="submit" disabled={isLoading}>
                                {   
                                    isLoading && (
                                        <Spinner animation="border" size="sm" />
                                    )
                                }
                                {
                                    !isLoading && (
                                        <span>Salvar</span>
                                    )
                                }
                            </Button>
                        </>
                    )
                }
                {
                    !tarefa.ido && (
                        <>
                             <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                                Fechar
                            </Button>
                            <Button variant="success" type="submit" disabled={isLoading}> 
                                {
                                    isLoading && (
                                        <Spinner animation="border" size="sm" />
                                    )
                                }
                                {
                                    !isLoading && (
                                        <span>Adicionar</span>
                                    )
                                }
                            </Button>
                        </>
                    )
                }
            </Modal.Footer>
        </Form>
    </Modal>
  );
}

export default ModalAddTarefa;