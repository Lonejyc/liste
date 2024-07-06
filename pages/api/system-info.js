import os from 'os';

export default function handler(req, res) {
  const systemInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    architecture: os.arch(),
    cpus: os.cpus(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
  };

  res.status(200).json(systemInfo);
}