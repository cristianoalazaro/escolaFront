import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmail, isInt, isFloat } from 'validator';
import { useDispatch } from 'react-redux';
import { FaEdit, FaUserCircle } from 'react-icons/fa';

import { Container } from '../../styles/GlobalStyles'
import { Title, Form, ProfilePicture } from './styled';
import Loading, { } from '../../components/Loading';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';
import { Link } from 'react-router-dom';

export default function Aluno({ match }) {
    const dispatch = useDispatch();

    const id = get(match, 'params.id', '');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [foto, setFoto] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        const getData = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/alunos/${id}`);
                const Foto = get(data, 'Fotos[0].url', '');

                setFoto(Foto);
                setName(data.nome);
                setLastName(data.sobrenome);
                setEmail(data.email);
                setAge(data.idade);
                setWeight(data.peso);
                setHeight(data.altura);
            } catch (error) {
                const status = get(error, 'response.status', 0);
                const errors = get(error, 'response.data.error', []);

                if (status === 400) errors.map(error => toast.error(error));
                history.push('/');
            } finally {
                setIsLoading(false);
            }
        }
        getData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formErrors = false;

        if (name.length < 3 || name.length > 255) {
            formErrors = true;
            toast.error('O campo nome deve ter entre 3 e 255 caracteres.');
        }

        if (lastName.length < 3 || lastName.length > 255) {
            formErrors = true;
            toast.error('O campo sobrenome deve ter entre 3 e 255 caracteres.');
        }

        if (!isEmail(email)) {
            formErrors = true;
            toast.error('E-mail inválido');
        }

        if (!isInt(String(age))) {
            formErrors = true;
            toast.error('Idade inválida');
        }

        if (!isFloat(String(weight))) {
            formErrors = true;
            toast.error('Peso inválido');
        }

        if (!isFloat(String(height))) {
            formErrors = true;
            toast.error('altura inválida');
        }

        if (formErrors) return;

        try {
            setIsLoading(true);
            if (id) {
                await axios.put(`/alunos/${id}`, {
                    nome: name, sobrenome: lastName, email, idade: age,
                    peso: weight, altura: height
                });
                toast.success('Aluno(a) editado(a) com sucesso!');
            } else {
                const { data } = await axios.post('/alunos/', {
                    nome: name, sobrenome: lastName, email, idade: age,
                    peso: weight, altura: height
                });
                toast.success('Aluno(a) criado(a) com sucesso!');
                history.push(`/aluno/${data.id}/edit`);
            }
        } catch (error) {
            const status = get(error, 'response.status', 0);
            const data = get(error, 'response.data', {});
            const errors = get(data, 'errors', []);

            if (errors.length > 0) {
                errors.map(err => toast.error(err));
            } else {
                toast.error('Erro desconhecido');
            }

            if (status === 401) dispatch(actions.loginFailure());
        } finally {
            setIsLoading(false);
        }

    }


    return (
        <Container>
            <Loading isLoading={isLoading} />
            <Title><h1>{id ? 'Editar aluno' : 'Novo aluno'}</h1></Title>
            
            {id && (
                <ProfilePicture>
                    {foto
                        ?
                        <img src={foto} alt={name} />
                        :
                        <FaUserCircle size={180} />}
                        <Link to={`/fotos/${id}`}>
                            <FaEdit size={24} />
                        </Link>
                </ProfilePicture>
            )}

            <Form onSubmit={handleSubmit}>
                <input type='text' value={name} onChange={e => setName(e.target.value)}
                    placeholder='Nome' />
                <input type='text' value={lastName} onChange={e => setLastName(e.target.value)}
                    placeholder='Sobrenome' />
                <input type='text' value={email} onChange={e => setEmail(e.target.value)}
                    placeholder='E-mail' />
                <input type='number' value={age} onChange={e => setAge(e.target.value)}
                    placeholder='Idade' />
                <input type='text' value={weight} onChange={e => setWeight(e.target.value)}
                    placeholder='Peso' />
                <input type='text' value={height} onChange={e => setHeight(e.target.value)}
                    placeholder='Altura' />

                <button type='submit'>Enviar</button>
            </Form>
        </ Container>
    )
}

Aluno.propTypes = {
    match: PropTypes.shape({}).isRequired,
};