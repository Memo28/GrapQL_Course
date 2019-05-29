const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

app.use(bodyParser.json());

//Con graphql solo se tiene un END POINT y de ahí graphql funciona como middleware para manejar las peticiones
app.use('/graphql', graphqlHttp({
	//Le inidicamos donde encontrara los resolvers(rootValue) y los schemas
	//Dentro de RootQuery and RootMutation definimos los get y funciones de modificacione
	// ! No permite que sean NULL, pueden estar VACIOS pero NO NULL
	schema : buildSchema( `
			type Event {
				_id : ID!
				title : String!
				description : String!
				price : Float!
				date : String!

			}

			input EventInput{
				title: String!
				description: String!
				price: Float!
				date: String!
			}

			type RootQuery {
				events : [Event!]!

			}

			type RootMutation {
				createEvent(eventInput: EventInput): Event
			}
			schema {
				query : RootQuery
				mutation : RootMutation
			}
		`),
	//Los root value deben de coincidir con los RootQuery y los RootMutations
	rootValue : {
		events: () =>{
			return events;
		},
		createEvent : (args) =>{
			const event =  {
				_id : Math.random().toString(),
				title : args.eventInput.title,
				description : args.eventInput.description,
				price : +args.eventInput.price,
				date : args.eventInput.date
			};
			events.push(event);
			return event;
		} 
	},
	graphiql : true
}));

app.listen(3000);
