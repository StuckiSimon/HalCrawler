import Immutable from "immutable";
import { createConfig, crawl, Command, Schema, Resource, action, getResourceFromStore } from "hal-crawler";

import { createHalux, haluxReducer, createHaluxAction, nestHaluxActions } from 'halux';
import { createStore, applyMiddleware, combineReducers } from 'redux';

const client = new Schema("client", ["id"], [action.GET]);
const mostImportantClient = new Schema("mostImportantClient", ["id"], [action.GET]);
const clients = new Schema("clients", [], [action.GET], [[client], mostImportantClient]);
const languages = new Schema("languages", [], [action.GET]);

// [] => list of resources, if only one can occur the [] can be removed
const root = new Schema("root", [], [action.GET], [clients, languages]);

const config = createConfig({
  root: "rootClientModel.json"
});

const fetchRoot = () => createHaluxAction({
    schema: root,
    identifiers: undefined
});

const fetchClients = () => createHaluxAction({
    schema: clients,
    identifiers: undefined,
    handlers: {
        errorHandler: (error) => console.log(error.toString())
    }
});

const fetchClient = (clientObject) => createHaluxAction({
    schema: client,
    identifiers: {
      id: clientObject.id
    },
    handlers: {
        errorHandler: (error) => console.log(error.toString())
    }
});

const fetchLanguages = () => createHaluxAction({
    schema: languages,
    identifiers: undefined
});

const nestedClients = () => nestHaluxActions(fetchRoot, fetchClients)({}, {});
const nestedClient = (client) => nestHaluxActions(nestedClients, fetchClient)({}, client);
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
store.dispatch(fetchRoot());
store.dispatch(nestedLanguages());
setTimeout(() => {
  store.dispatch(fetchRoot());
}, 500);

setTimeout(() => {
  console.log(store.getState());
}, 3000);
