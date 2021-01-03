import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../store/modules/auth/actions';

import { Container } from '../../styles/GlobalStyles'
import { Form } from './styled';

import Loading from '../../components/Loading';

export default function Register() {
    const dispatch = useDispatch();
    const id = useSelector(state=>state.auth.user.id);
    const nameStored = useSelector(state=>state.auth.user.nome);
    const emailStored = useSelector(state=>state.auth.user.email);
    const isLoading = useSelector(state=>state.auth.isLoading);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!id) return;
        setName(nameStored);
        setEmail(emailStored);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formErrors = false;
        if (name.length < 3 || name.length > 255) {
            formErrors = true;
            toast.error('O campo nome deve ter entre 3 e 255 caracteres.');
        }

        if (!isEmail(email)) {
            formErrors = true;
            toast.error('E-mail inválido');
        }

        if (!id && (password.length < 6 || password.length > 255)) {
            formErrors = true;
            toast.error('O campo senha deve ter entre 6 e 255 caracteres.');
        }

        if (formErrors) return;

        dispatch(actions.registerRequest({id, name, email, password}));


    }

    return (
        <Container>
            <Loading isLoading={isLoading} />
            <h1>{id ? 'Editar dados' : 'Crie sua conta'}</h1>
            <Form onSubmit={handleSubmit}>
                <label htmlFor='name'>
                    Nome:
                    <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)}
                        placeholder='Seu nome' />
                </label>

                <label htmlFor='email'>
                    E-mail:
                    <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder='Seu e-mail' />
                </label>

                <label htmlFor='password'>
                    Senha:
                    <input type='password' id='password' value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Sua senha' />
                </label>

                <button type='submit'>{id ? 'Salvar' : 'Crie sua conta'} </button>
            </Form>
        </ Container>
    )
}