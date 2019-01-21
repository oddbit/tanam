import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import { join } from 'path';

enableProdMode();

const app = express();
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./server/main');

const appConfig = process.env.FIREBASE_CONFIG || {
    adminUrl: 'FROM HARD CODED',
    firebaseApp: {
        apiKey: 'AIzaSyAgQPU7GskiBovZeBGzhwQtbC6gXuxie-U',
        authDomain: 'tanam-e8e7d.firebaseapp.com',
        databaseURL: 'https://tanam-e8e7d.firebaseio.com',
        projectId: 'tanam-e8e7d',
        storageBucket: 'tanam-e8e7d.appspot.com',
        messagingSenderId: '572947425338',
    },
};

app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP),
        {
            provide: 'TanamConfig',
            useValue: appConfig,
        },
    ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    res.render('index', { req });
});

app.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`);
});
