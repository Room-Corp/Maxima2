// components/vcdParser.ts
interface Signal {
  name: string;
  width: number;
  wave: [number, string][];
  hierarchy: string[];
}

interface VCDData {
  signals: Signal[];
  timescale: number;
  maxCycles: number;
}

const parseTimescale = (str: string): number => {
  const m = str.trim().match(/^(\d+)\s*(\w+)$/);
  if (!m) return 0;
  const value = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  const unitMap: { [key: string]: number } = {
    s: 0,
    ms: -3,
    us: -6,
    ns: -9,
    ps: -12,
    fs: -15,
  };
  return Math.log10(value) + (unitMap[unit] || 0);
};

export const parseVCD = async (vcdContent: string): Promise<VCDData> => {
  return new Promise((resolve, reject) => {
    const lines = vcdContent.split("\n");
    const signals: { [key: string]: Signal } = {};
    let currentTime = 0;
    let timescale = 0;
    let maxTime = 0;
    let currentScope: string[] = [];
    let idMap: { [key: string]: string } = {}; // Map VCD IDs to signal names
    let inDefinitions = true;

    const getFullName = (name: string) => [...currentScope, name].join(".");

    const processChunk = (start: number) => {
      const end = Math.min(start + 10000, lines.length);
      for (let i = start; i < end; i++) {
        const line = lines[i].trim();

        // Skip comments
        if (line.startsWith("//") || line.startsWith("/*")) continue;

        if (inDefinitions) {
          if (line.startsWith("$var")) {
            const parts = line.split(/\s+/);
            const id = parts[3];
            const name = getFullName(parts[4]);
            idMap[id] = name;
            signals[name] = {
              name: name,
              width: parseInt(parts[2], 10),
              wave: [],
              hierarchy: [...currentScope],
            };
          } else if (line.startsWith("$timescale")) {
            const timescaleParts = line.split(/\s+/);
            if (timescaleParts.length > 1) {
              timescale = parseTimescale(timescaleParts[1]);
            }
          } else if (line.startsWith("$scope")) {
            const parts = line.split(/\s+/);
            currentScope.push(parts[2]);
          } else if (line.startsWith("$upscope")) {
            currentScope.pop();
          } else if (line.startsWith("$enddefinitions")) {
            inDefinitions = false;
          }
        } else {
          if (line.startsWith("#")) {
            currentTime = parseInt(line.substring(1), 10);
            maxTime = Math.max(maxTime, currentTime);
          } else if (line.match(/^[01zxZX]\S+/)) {
            const value = line[0].toLowerCase();
            const id = line.substring(1);
            const name = idMap[id];
            if (signals[name]) {
              signals[name].wave.push([currentTime, value]);
            }
          } else if (line.startsWith("b")) {
            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
              const value = parts[0].substring(1);
              const id = parts[1];
              const name = idMap[id];
              if (signals[name]) {
                const paddedValue = value.padStart(signals[name].width, "0");
                signals[name].wave.push([currentTime, paddedValue]);
              }
            }
          } else if (line.startsWith("r") || line.startsWith("R")) {
            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
              const value = parts[0].substring(1);
              const id = parts[1];
              const name = idMap[id];
              if (signals[name]) {
                signals[name].wave.push([currentTime, value]);
              }
            }
          }
        }
      }

      if (end < lines.length) {
        setTimeout(() => processChunk(end), 0);
      } else {
        finalize();
      }
    };

    const finalize = () => {
      const maxCycles = Math.ceil(maxTime / Math.pow(10, timescale));

      // Ensure all signals have a value at time 0
      Object.values(signals).forEach((signal) => {
        if (signal.wave.length === 0 || signal.wave[0][0] > 0) {
          signal.wave.unshift([0, "x".repeat(signal.width)]);
        }
        signal.wave.sort((a, b) => a[0] - b[0]);
      });

      resolve({
        signals: Object.values(signals),
        timescale: Math.pow(10, timescale),
        maxCycles,
      });
    };

    try {
      processChunk(0);
    } catch (error) {
      reject(error);
    }
  });
};
