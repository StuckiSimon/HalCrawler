# HalCrawler
wip

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

## crawl
crawl is the main API, it executes a given command
```
crawl(config, new Command(new Resource(root))).then(store => {
  const adminResources = store.get(admins.getName());
  const adminResource = adminResources.toList().get(0);
  console.log(crawl(config, new Command(adminResource, action.GET), store));
});
```
