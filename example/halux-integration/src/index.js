import Immutable from "immutable";
import { createConfig, crawl, Command, Schema, Resource, action, getResourceFromStore, schemaType } from "hal-crawler";

import { createHalux, haluxReducer, createHaluxAction, nestHaluxActions } from 'halux';
import { createStore, applyMiddleware, combineReducers } from 'redux';

const postFoods = new Schema("save-foods", schemaType.linkIdentifiedResource);
const foods = new Schema("foods", schemaType.linkIdentifiedResource);
const pet = new Schema("pet", ["id"], [action.GET], [[foods], [postFoods]]);
const client = new Schema("client", ["id"], [action.GET], [pet]);
const mostImportantClient = new Schema("mostImportantClient", ["nested.id"], [action.GET]);
const clients = new Schema("clients", schemaType.singleInstanceResource, [action.GET], [[client], mostImportantClient]);
const languages = new Schema("languages", schemaType.singleInstanceResource, [action.GET]);

// [] => list of resources, if only one can occur the [] can be removed
const root = new Schema("root", [], [action.GET], [clients, languages]);

const config = createConfig({
  root: "rootClientModel.json",
  fetchOptions: {
    headers: {
      'Accept-Language': 'en'
    }
  }
});

const fetchRoot = () => createHaluxAction({
    schema: root,
    identifiers: undefined,
    handlers: {
        pendingHandler: () => console.log('pending'),
        errorHandler: (store, error) => console.log(error.toString())
    }
});

const fetchClients = () => createHaluxAction({
    schema: clients,
    identifiers: undefined,
    handlers: {
        successHandler: (store, state) => console.log('fetchedClients'),
        errorHandler: (store, error) => console.log(error.toString())
    }
});

const fetchClient = (clientObject) => createHaluxAction({
    schema: client,
    identifiers: {
      id: clientObject.id
    },
    handlers: {
        errorHandler: (store, error) => console.log(error.toString())
    }
});

const fetchClientAndOverwrite = (clientObject) => createHaluxAction({
    schema: client,
    overwriteStore: true,
    identifiers: {
      id: clientObject.id
    },
    handlers: {
        errorHandler: (store, error) => console.log(error.toString())
    }
});


const fetchPet = () => createHaluxAction({
    schema: pet,
    identifiers: undefined,
    handlers: {
        errorHandler: (store, error) => console.log(error.toString())
    }
});

// fetches all foods
const fetchFoods = () => createHaluxAction({
    schema: foods,
    identifiers: undefined
});

const postToFoods = () => createHaluxAction({
  schema: postFoods,
  into: foods,
  overwriteStore: true
});

const fetchLanguages = () => createHaluxAction({
    schema: languages,
    identifiers: undefined,
    handlers: {
        errorHandler: (store, error) => console.log(error.toString())
    }
});

const nestedClients = () => nestHaluxActions(fetchRoot, fetchClients)({}, {});
const nestedClient = (client) => nestHaluxActions(nestedClients, fetchClient)({}, client);
const nestedClientAndOverwrite = (client) => nestHaluxActions(nestedClients, fetchClientAndOverwrite)({}, client);
const nestedPet = (client) => nestHaluxActions(nestedClient, fetchPet)(client, {});
const nestedFoods = (client) => nestHaluxActions(nestedPet, fetchFoods)(client, {});
const nestedLanguages = () => nestHaluxActions(fetchRoot, fetchLanguages)({}, {});

const trialReducer = (state = {}, action) => {
  return state;
}

const reducers = combineReducers({
    app: {}, // your app state
    data: combineReducers({
        halux: haluxReducer,
        somethingOther: trialReducer,
    })
});

const haluxMiddleware = createHalux(config, 'data.halux');

const store = createStore(
  reducers,
  undefined,
  applyMiddleware(haluxMiddleware)
)

store.dispatch(nestedClient({id: 2}));
store.dispatch(nestedPet({id: 2}));
store.dispatch(nestedPet({id: 1}));
store.dispatch(nestedFoods({id: 1}));
store.dispatch(fetchRoot());
store.dispatch(nestedLanguages());
setTimeout(() => {
  store.dispatch(fetchRoot());
  store.dispatch(nestedClientAndOverwrite({id: 2}));
}, 500);

setTimeout(() => {
  console.log(store.getState());
}, 3000);
