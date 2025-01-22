import dotenv from 'dotenv';
dotenv.config();

import util from 'util'
import express, { Express, Request, Response } from "express";
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { engine } from 'express-handlebars';

import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

const app: Express = express();
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'views');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use( cookieParser() )

const port = process.env.PORT || 3000;

app.get( '/'
, async( req: Request, res: Response )=>{
    res.render( 'home', { title: 'Home' });
});

app.get( '/search'
, async( req: Request, res: Response )=>{
    res.render( 'search', { title: 'Search' });
});

app.post( '/user'
, async( req: Request, res: Response )=>{
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    });
    console.log( user )
    if( user === null ){
        res.redirect( '/search' )
    }
    else{ // if user not null
        res.cookie( 'username', user.name, { maxAge: 3_600_000 })
        res.redirect( '/user' )
    }
});

app.get( '/user'
, async( req: Request, res: Response )=>{
    const username = req.cookies.username
    res.render( 'user', { title: 'User', userName: username });
});

app.listen(
    port
,   () => {
        console.log( `[server]: Server is running at http://localhost:${port}` );
});

