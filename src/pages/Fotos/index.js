import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles'
import Loading from '../../components/Loading';
import { Title, Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Fotos({ match }) {
    const dispatch = useDispatch();

    const id = get(match, 'params.id', '');

    const [isLoading, setIsLoading] = useState(false);
    const [foto, setFoto] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/alunos/${id}`);
                setFoto(get(data, 'Fotos[0].url', ''));
                setIsLoading(false);
            } catch {
                toast.error('Erro ao carregar a imagem');
                setIsLoading(false);
                history.push('/');
            }
        }
        getData();
    }, []);

    const handlechange = async event => {
        const file = event.target.files[0];
        const fileURL = URL.createObjectURL(file);

        setFoto(fileURL);

        const formData = new FormData();
        formData.append('aluno_id', id);
        formData.append('foto', file);

        try {
            setIsLoading(true);
            await axios.post('/fotos/', formData, {
                headers: {
                    'Content-type': 'multpart/forma-data',
                }
            });

            toast.success('Foto enviada com sucesso!');
        } catch (error) {
            const { status } = get(error, 'status', '');
            toast.error('Erro ao enviar foto.');

            if (status === 401) {
                dispatch(actions.loginFailure());
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <Loading isLoading={isLoading} />

            <Title>Fotos</Title>

            <Form>
                <label htmlFor='foto'>
                    {foto ? <img src={foto} alt='Foto' /> : 'Selecionar'}
                    <input type='file' id='foto' onChange={handlechange} />
                </label>
            </Form>
        </ Container>
    )
}

Fotos.propTypes = {
    match: PropTypes.shape({}).isRequired
};
