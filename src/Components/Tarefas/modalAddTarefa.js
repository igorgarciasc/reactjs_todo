import React,{useState, useEffect} from 'react';
import { Modal, Button, Form, } from 'react-bootstrap';
import { Input,FormGroup, Label } from 'reactstrap';
import axios from 'axios';



function ModalAddTarefa({show, closeModal, tarefaSelecionada, realoadTarefas}) {

    const initialState = {
        ido: null,
        titulo: '',
        descricao: '',
        prioridade: 0,
        pessoa: 0
    }

    const [tarefa, setTarefa] = useState(initialState);
    
    function clearForm(){
        setTarefa(initialState);
    }

    function resolveRequest(result){
            clearForm(); 
            closeModal(false)
            realoadTarefas();
            alert(result.data.messages.success)
    }

    function handleClose() {
        closeModal(false);
        clearForm();
    }

    function handleSubmit(e) {
        e.preventDefault();

        const params = new URLSearchParams();
        params.append('titulo', tarefa.titulo);
        params.append('descricao', tarefa.descricao);
        params.append('prioridade', tarefa.prioridade);
        params.append('pessoa', tarefa.pessoa);

        if(!tarefa.ido){
            axios.post(process.env.REACT_APP_API_URL+'tarefa',params).then(result=>{
                resolveRequest(result)
            }).catch(error => {
                alert(error.response.data.messages.error);
            })
        }else{
            axios.put(process.env.REACT_APP_API_URL+'tarefa/'+tarefa.ido,params).then(result=>{
                resolveRequest(result)
            }).catch(error => {
                alert(error.response.data.messages.error);
            })
        }
    }

    function handleDeleteTarefa(){
        let decisao = window.confirm('Você está certo disso?');
        if(decisao){
            axios.delete(process.env.REACT_APP_API_URL+'tarefa/'+tarefa.ido).then(result=>{
                resolveRequest(result)
            })
        }else{
            closeModal(true)
        }
    }

    useEffect(()=>{
        if(tarefaSelecionada){
            console.log(tarefaSelecionada)
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
                            value={tarefa.pessoa}
                            defaultValue={0}
                            onChange={(e)=>setTarefa({...tarefa,pessoa:e.target.value})}
                        >
                            <option value="0" >Selecione</option>
                            <option value="1">Fulano de Tal</option>
                            <option value="2">Ciclano de Tal</option>
                        </Input>
                    </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                {
                    tarefa.ido && (
                        <>
                             <Button variant="secondary" onClick={handleClose}>
                                Fechar
                            </Button>
                            <Button variant="danger" onClick={handleDeleteTarefa}>
                                Deletar
                            </Button>
                            <Button variant="primary" type="submit">
                                Salvar
                            </Button>
                        </>
                    )
                }
                {
                    !tarefa.ido && (
                        <>
                             <Button variant="secondary" onClick={handleClose}>
                                Fechar
                            </Button>
                            <Button variant="success" type="submit">
                                Adicionar
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