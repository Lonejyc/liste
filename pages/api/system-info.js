import os from 'os';

export default function handler(req, res) {
const systemInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    architecture: os.arch(),
    cpus: os.cpus(),
    totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024) / 10,
    freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024) / 10,
};

  res.status(200).json(systemInfo);
}