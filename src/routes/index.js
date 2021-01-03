import React from 'react';
import { Switch } from 'react-router-dom';

import MyRoute from '../routes/MyRoute.js';

import Aluno from '../pages/Aluno';
import Alunos from '../pages/Alunos';
import Fotos from '../pages/Fotos';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Page404 from '../pages/Page404';

export default function Routes() {
    return (
        <Switch>
            <MyRoute exact path='/' component={Alunos} isClosed={false}  />
            <MyRoute path='/aluno/:id/edit' component={Aluno} isClosed={true} />
            <MyRoute path='/aluno/' component={Aluno} isClosed={true} />
            <MyRoute path='/fotos/:id' component={Fotos} isClosed={true} />
            <MyRoute path='/login/' component={Login} isClosed={false} />
            <MyRoute path='/register/' component={Register} isClosed={false} />
            <MyRoute path='*' component={Page404} />
        </Switch>
    )
}