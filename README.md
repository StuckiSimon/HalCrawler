# HalCrawler

wip

## Introduction
HAL Crawler is a client for consuming any API which is HAL (HATEOAS) compliant.
Have a look at the spec of [HALSpec] if you're not familiar with it.

## Schemas
Schemas define the data structure

```
import { createConfig, crawl, Command, Schema, Resource, action } from "hal-crawler";
const admins = new Schema("ea:admin", ["id"], [action.GET]);
const orders = new Schema("ea:order", ["id"], [action.GET]);

// [] => list of resources, if only one can occur the [] can be removed
const root = new Schema("root", [], [action.GET], [[admins], [orders]]);
```

## configuration
the crawler needs some basic information, this must be passed using configuration objects, only the root resource is mandatory, but others such as "http-headers" are also possible
```
const config = createConfig({
  root: "root.json"
});
```

## Resource
A resource represents data from an endpoint. There are different kinds of resources:
- Full Resource: contains all links, data
- Shallow Link Resource: contains only the link to itself (used by crawl and getResourceFromStore)
- Shallow identifiers Resource: contains only the identifiers (used by getResourceFromStore)
```
new Resource(root, [link], [data]);
```
In order to get child links of a resource use the ``` getChildLink(schema) ``` helper. This returns the link or an array of links which is available on a resource

## Command
a command defines an action which should be performed on a given resource.
The resource as well as the action is mandatory
```
new Command(Resource, action.GET, [ignoreStore]);
```
Only for the root resource action is not required
```
new Command(new Resource(root));
```

## crawl
crawl is the main API, it executes a given command
```
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
```

## getResourceFromStore
getResourceFromStore is responsible for retrieving a resource from the store, it accepts shallow link resources as well as shallow identifier resources.
```
getResourceFromStore(store, shallowResourceInstance);
```

[HALSpec]: http://stateless.co/hal_specification.html
