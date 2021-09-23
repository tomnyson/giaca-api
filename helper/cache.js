import NodeCache from "node-cache";

const CachService = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export default CachService;
