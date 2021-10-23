import NodeCache from "node-cache";

const CachService = new NodeCache({ stdTTL: 100, checkperiod: 3000 });

export default CachService;
