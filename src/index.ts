import dotenv from 'dotenv';
dotenv.config();

import util from 'util'
import express, { Express, Request, Response } from "express";
import bodyParser from 'body-parser'
import { engine } from 'express-handlebars';

import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

const app: Express = express();
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'views');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
    console.log( `req.query: ${ util.inspect( req.query )}` )
    res.send( user?.name )
    // res.redirect( '/user' )
});

app.get( '/user'
, async( req: Request, res: Response )=>{
    // res.render( 'user', { title: 'User', userName: user? });
    res.render( 'user', { title: 'User', userName: '?' });
});

app.listen( 
    port
,   () => {
        console.log( `[server]: Server is running at http://localhost:${port}` );
});
  
