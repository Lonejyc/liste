import os from 'os';

export default function handler(req, res) {
const systemInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    architecture: os.arch(),
    cpus: os.cpus(),
    totalMemory: os.totalmem() / 1024 / 1024 / 1024,
    freeMemory: os.freemem() / 1024 / 1024 / 1024,
    diskSpace: os.homedir(),
};

  res.status(200).json(systemInfo);
}