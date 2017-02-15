import Immutable from "immutable";
import { createConfig, crawl, Command, Schema, Resource, action, getResourceFromStore } from "hal-crawler";

const admins = new Schema("ea:admin", ["id"], [action.GET]);
const orders = new Schema("ea:order", ["id"], [action.GET]);

// [] => list of resources, if only one can occur the [] can be removed
const root = new Schema("root", [], [action.GET], [[admins], [orders]]);

const config = createConfig({
  root: "root.json"
});

crawl(config, new Command(new Resource(root))).then(store => {
  const rootInstance = getResourceFromStore(store, new Resource(root));
  const adminLinks = rootInstance.getChildLink(admins);

  crawl(config, new Command(new Resource(admins, adminLinks[0]), action.GET), store).then(store => {
    console.log(getResourceFromStore(store, new Resource(admins, undefined, {id: 2})));
  });

  const orderLinks = rootInstance.getChildLink(orders);

  crawl(config, new Command(new Resource(orders, orderLinks[0]), action.GET), store).then(store => {
    console.log(getResourceFromStore(store, new Resource(orders, undefined, {id: 2})));
  });
});
