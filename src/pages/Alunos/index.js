import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Container } from '../../styles/GlobalStyles';
import axios from '../../services/axios';
import { AlunoContainer, ProfilePicture, NewAlumn } from './styled';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';

export default function Alunos() {
    const [alunos, setAlunos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        try {
            const getData = async () => {
                setIsLoading(true);
                const response = await axios('/alunos/');
                setAlunos(response.data);
                setIsLoading(false);
            }
            getData();
        } catch (e) {

        }
    }, []);

    const handleDeleteAsk = event => {
        event.preventDefault();
        const exclamation = event.currentTarget.nextSibling;
        exclamation.setAttribute('display', 'block');
        event.currentTarget.remove();
    };

    const handleDelete = async (event, id)=>{
        //event.persist();

        try{
            setIsLoading(true);
            await axios.delete(`/alunos/${id}`);
            const newAlunos = alunos.filter(alunos=>alunos.id !== id);
            console.log(isLoading);
            setAlunos(newAlunos);
            setIsLoading(false);
        }catch(error){
            const status = get(error, 'response.status', []);
            if (status === 401){
                toast.error('Você precisa fazer login');
            } else {
                toast.error('Ocorreu um erro ao excluir o aluno');
            }
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <Loading isLoading={isLoading} />
            <h1>Alunos</h1>

            <NewAlumn to='/aluno/'>Novo aluno</NewAlumn>

            <AlunoContainer>
                {alunos.map(aluno => (
                    <div key={String(aluno.id)}>
                        <ProfilePicture>
                            {get(aluno, 'Fotos[0].url', false) ? (
                                <img src={aluno.Fotos[0].url} alt='' />) : (
                                    <FaUserCircle size={36} />
                                )
                            }
                        </ProfilePicture>
                        <span>{aluno.nome}</span>
                        <span>{aluno.email}</span>
                        <Link to={`/aluno/${aluno.id}/edit`} size={16}><FaEdit /></Link>
                        <Link onClick={handleDeleteAsk}to={`/aluno/${aluno.id}/delete`} 
                        size={16}><FaWindowClose /></Link>

                        <FaExclamation size={16} display="none" cursor="pointer" 
                        onClick={event=>handleDelete(event, aluno.id)} />
                    </div>
                ))}
            </AlunoContainer>
        </ Container>
    )
}