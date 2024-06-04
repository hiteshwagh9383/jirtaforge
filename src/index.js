import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('getText', (req) => {
    console.log(req);

    return 'Hello, world!';
});

export const handler = resolver.getDefinitions();
/*
forge craete
forge deploy
forge install 
in app npm install
then in static,hello-world do npm install
npm run build

*/