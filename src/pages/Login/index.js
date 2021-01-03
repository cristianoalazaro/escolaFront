import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';

import { Container } from '../../styles/GlobalStyles'
import { Form } from './styled';
import * as actions from '../../store/modules/auth/actions';
import Loading from '../../components/Loading';

export default function Login(props) {
    const dispatch = useDispatch();

    const prevPath = get(props, 'location.state.prevPath', '/');

    const isLoading = useSelector(state=>state.auth.isLoading);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        let errorForm = false;
        if (!isEmail(email)) {
            errorForm = true;
            toast.error('E-mail inválido');
        }

        if (password.length < 6 || password.length > 50) {
            errorForm = true;
            toast.error('O campo senha deve ter entre 6 e 50 caracteres');
        }

        if (errorForm) return;

        dispatch(actions.loginRequest({ email, password, prevPath }));

    }

    return (
        <Container>
            <Loading isLoading={isLoading} />
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
                <input type='text' value={email} onChange={(event) => setEmail(event.target.value)}
                    placeholder='Seu E-mail' />

                <input type='password' value={password} onChange={(event) => setPassword(event.target.value)}
                    placeholder='Sua Senha' />

                <button type='submit'>Entrar</button>
            </Form>
        </ Container>
    )
}