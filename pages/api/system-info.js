import os from 'os';

function convertBytesToGB(bytes) {
  return (bytes / 1024 / 1024 / 1024).toFixed(2);
}

export default function handler(req, res) {
  const systemInfo = {
      hostname: os.hostname(),
      platform: os.platform(),
      architecture: os.arch(),
      cpus: os.cpus(),
      totalMemory: os.totalmem(),
      totalMemory: convertBytesToGB(os.totalmem()),
      freeMemory: convertBytesToGB(os.freemem()),
      diskSpace: os.homedir(),
  };

  res.status(200).json(systemInfo);
}