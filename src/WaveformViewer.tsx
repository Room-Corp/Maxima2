import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  IconButton,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { SelectChangeEvent } from "@mui/material/Select";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

interface Signal {
  name: string;
  width: number;
  wave: [number, string][];
  hierarchy?: string[];
}

interface VCDData {
  signals: Signal[];
  timescale: number;
  maxCycles: number;
}

interface WaveformViewerProps {
  data: VCDData;
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f5f5f7",
  color: theme.palette.mode === "dark" ? "#ffffff" : "#1d1d1f",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
}));

const StyledCanvas = styled("canvas")({
  display: "block",
  width: "100%",
  height: "100%",
  transition: "all 0.3s ease",
});

const WaveformViewer: React.FC<WaveformViewerProps> = ({ data }) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [showHoverInfo, setShowHoverInfo] = useState(true);
  const [hoverInfo, setHoverInfo] = useState<{
    name: string;
    value: string;
    y: number;
  } | null>(null);

  const [expandedSignals, setExpandedSignals] = useState<Record<string, boolean>>({
    SW: false,
    LEDR: false,
  });

  const signalHeight = 40;
  const signalPadding = 8;
  const sidebarWidth = 200;
  const timeScaleHeight = 30;

  const groupedSignals = useMemo(() => {
    const groups: Record<string, Signal[]> = {};
    data.signals.forEach((signal) => {
      if (signal.name === "SW" || signal.name === "LEDR") {
        if (!groups[signal.name]) {
          groups[signal.name] = [];
        }
        // Split multi-bit signal into individual bits
        for (let i = 0; i < signal.width; i++) {
          groups[signal.name].push({
            name: `${signal.name}[${i}]`,
            width: 1,
            wave: signal.wave.map(([time, value]) => [time, value[signal.width - 1 - i]]),
          });
        }
      } else {
        const baseName = signal.name.split("[")[0];
        if (!groups[baseName]) {
          groups[baseName] = [];
        }
        groups[baseName].push(signal);
      }
    });
    return groups;
  }, [data.signals]);

  const { maxTime, minTime } = useMemo(() => {
    let max = -Infinity;
    let min = Infinity;
    data.signals?.forEach((signal) => {
      signal.wave?.forEach(([time]) => {
        max = Math.max(max, time);
        min = Math.min(min, time);
      });
    });
    return {
      maxTime: max === -Infinity ? 0 : max,
      minTime: min === Infinity ? 0 : min,
    };
  }, [data.signals]);

  const timeRange = maxTime - minTime;

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Use theme colors
    const backgroundColor =
      theme.palette.mode === "dark" ? "#121212" : "#ffffff";
    const textColor = theme.palette.mode === "dark" ? "#ffffff" : "#000000";
    const signalColor = theme.palette.mode === "dark" ? "#00ffff" : "#007aff";
    const errorColor = theme.palette.error.main;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw time scale
    ctx.fillStyle = textColor;
    ctx.font = "12px Arial";

    // Calculate scales
    const xScale = ((width - sidebarWidth) * zoom) / timeRange;
    const visibleTimeRange = timeRange / zoom;
    const visibleStartTime = minTime + offset.x / xScale;
    const visibleEndTime = visibleStartTime + visibleTimeRange;

    // Draw time scale
    ctx.fillStyle = signalColor;
    ctx.font =
      "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif";

    const timeStep = Math.pow(10, Math.floor(Math.log10(visibleTimeRange / 5)));
    const startTime = Math.floor(visibleStartTime / timeStep) * timeStep;

    for (
      let t = startTime;
      t <= Math.min(maxTime, visibleEndTime);
      t += timeStep
    ) {
      const x = (t - visibleStartTime) * xScale + sidebarWidth;
      if (x >= sidebarWidth && x <= width) {
        ctx.fillText(`${t} ps`, x, timeScaleHeight - 5);

        // Draw vertical grid line
        ctx.strokeStyle = theme.palette.mode === "dark" ? "#333333" : "#e5e5e5";
        ctx.beginPath();
        ctx.moveTo(x, timeScaleHeight);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Draw cycle count
    ctx.fillStyle = textColor;
    ctx.fillText(
      `Cycle: ${Math.floor(visibleStartTime / data.timescale)}/${data.maxCycles}`,
      sidebarWidth + 10,
      15,
    );

    // Draw signals
    let yOffset = timeScaleHeight - offset.y;
    Object.entries(groupedSignals).forEach(([groupName, signals]) => {
      if (
        (groupName === "SW" || groupName === "LEDR") &&
        !expandedSignals[groupName]
      ) {
        // Draw grouped signal
        const groupedSignal: Signal = {
          name: groupName,
          width: signals[0].width * signals.length,
          wave: signals[0].wave.map(([time, _]) => [
            time,
            signals
              .map((s) => s.wave.find((w) => w[0] === time)?.[1] || "0")
              .join(""),
          ]),
        };
        drawSignal(
          ctx,
          groupedSignal,
          yOffset,
          width,
          height,
          xScale,
          visibleStartTime,
          visibleEndTime,
          true,
        );
        yOffset += signalHeight;
      } else {
        // Draw individual signals
        signals.forEach((signal, index) => {
          drawSignal(
            ctx,
            signal,
            yOffset,
            width,
            height,
            xScale,
            visibleStartTime,
            visibleEndTime,
            false,
            index,
          );
          yOffset += signalHeight;
        });
      }
    });

    // Draw cursor and hover info
    if (cursorPosition !== null) {
      const cursorX =
        (cursorPosition - visibleStartTime) * xScale + sidebarWidth;
      ctx.strokeStyle = "rgba(0, 122, 255, 0.5)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cursorX, timeScaleHeight);
      ctx.lineTo(cursorX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw hover info
      if (showHoverInfo && hoverInfo) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(cursorX + 5, hoverInfo.y - 20, 100, 40);
        ctx.fillStyle = textColor;
        ctx.fillText(
          `${hoverInfo.name}: ${hoverInfo.value}`,
          cursorX + 10,
          hoverInfo.y,
        );
      }
    }
  };
  const drawUndefinedBox = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    endX: number,
    y: number,
    height: number,
    value: string
  ) => {
    const boxHeight = height - 10;
    ctx.beginPath();
    ctx.strokeStyle = theme.palette.error.main; // Red outline
    ctx.rect(startX, y - boxHeight / 2, endX - startX, boxHeight);
    ctx.stroke();
  
    // Draw 'x' or 'z' inside the box
    ctx.fillStyle = theme.palette.error.main;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(value, (startX + endX) / 2, y);
  };

  const drawSignal = (
    ctx: CanvasRenderingContext2D,
    signal: Signal,
    yOffset: number,
    width: number,
    height: number,
    xScale: number,
    visibleStartTime: number,
    visibleEndTime: number,
    isGrouped: boolean = false,
    indexInGroup: number = 0,
  ) => {
    const effectiveYOffset = yOffset + signalPadding / 2;
    const effectiveSignalHeight = signalHeight - signalPadding;
  
    if (
      effectiveYOffset + effectiveSignalHeight < timeScaleHeight ||
      effectiveYOffset > height
    )
      return;
  
    ctx.lineWidth = 2;
  
    let lastX = sidebarWidth;
    let lastY = effectiveYOffset + effectiveSignalHeight / 2;
    let lastValue: string | null = null;
  
    const drawHexagon = (
      startX: number,
      endX: number,
      y: number,
      height: number,
      isUndefined: boolean
    ) => {
      const halfHeight = height / 2;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + halfHeight / 2, y - halfHeight);
      ctx.lineTo(endX - halfHeight / 2, y - halfHeight);
      ctx.lineTo(endX, y);
      ctx.lineTo(endX - halfHeight / 2, y + halfHeight);
      ctx.lineTo(startX + halfHeight / 2, y + halfHeight);
      ctx.closePath();
      ctx.strokeStyle = isUndefined ? theme.palette.error.main : (theme.palette.mode === "dark" ? "#00ffff" : "#007aff");
      ctx.stroke();
    };
  
    const drawWaveLine = (
      startX: number,
      endX: number,
      startY: number,
      endY: number,
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = theme.palette.mode === "dark" ? "#00ffff" : "#007aff";
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    };
  
    const maxEndX = Math.min(
      (visibleEndTime - visibleStartTime) * xScale + sidebarWidth,
      width,
    );
  
    signal.wave.forEach(([time, value], index) => {
      const x = Math.min(
        (time - visibleStartTime) * xScale + sidebarWidth,
        maxEndX
      );
      let y = effectiveYOffset + effectiveSignalHeight / 2;
  
      const nextTime = signal.wave[index + 1]
        ? signal.wave[index + 1][0]
        : visibleEndTime;
      const nextX = Math.min(
        (nextTime - visibleStartTime) * xScale + sidebarWidth,
        maxEndX
      );
  
      if (x >= sidebarWidth - 1 && x <= maxEndX) {
        if (value === "x" || value === "z") {
          // Draw undefined state as a box
          ctx.beginPath();
          ctx.rect(x, y - (effectiveSignalHeight - 10) / 2, nextX - x, effectiveSignalHeight - 10);
          ctx.strokeStyle = theme.palette.error.main;
          ctx.stroke();
  
          // Draw 'x' or 'z' inside the box
          ctx.fillStyle = theme.palette.error.main;
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(value, (x + nextX) / 2, y);
        } else {
          if (!isGrouped && signal.width === 1) {
            // Draw single-bit signal
            const binaryValue = parseInt(value, 2);
            y = effectiveYOffset + (binaryValue === 0 ? (3 * effectiveSignalHeight) / 4 : effectiveSignalHeight / 4);
  
            if (lastValue !== null) {
              drawWaveLine(lastX, x, lastY, lastY);
              if (lastValue !== value) {
                drawWaveLine(x, x, lastY, y);
              }
            }
            drawWaveLine(x, nextX, y, y);
          } else {
            // Draw multi-bit signal as hexagon
            drawHexagon(x, nextX, y, effectiveSignalHeight - 10, false);
            
            ctx.fillStyle = theme.palette.text.primary;
            ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            
            // Ensure correct display of SW signal
            let displayValue = signal.name === 'SW' 
              ? value.split('').reverse().join('')
              : value;
            ctx.fillText(displayValue, x + 5, y);
          }
        }
  
        lastX = x;
        lastY = y;
        lastValue = value;
      }
    });
  
    // Draw signal name
    ctx.fillStyle = theme.palette.text.primary;
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif";
    let signalName = signal.name;
    if (
      (signalName.startsWith("SW") || signalName.startsWith("LEDR")) &&
      !isGrouped
    ) {
      signalName += `[${indexInGroup}]`;
    }
    ctx.fillText(
      signalName,
      5,
      effectiveYOffset + effectiveSignalHeight / 2 + 5,
    );
  };

  const drawHexagon = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    isError: boolean,
  ) => {
    const sideLength = height / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + sideLength / 2, y - height / 2);
    ctx.lineTo(x + width - sideLength / 2, y - height / 2);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width - sideLength / 2, y + height / 2);
    ctx.lineTo(x + sideLength / 2, y + height / 2);
    ctx.closePath();
    ctx.strokeStyle = isError
      ? theme.palette.error.main
      : theme.palette.mode === "dark"
        ? "#00ffff"
        : "#007aff";
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      drawWaveform();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [
    data.signals,
    zoom,
    offset,
    maxTime,
    minTime,
    timeRange,
    data.maxCycles,
    cursorPosition,
    showHoverInfo,
    hoverInfo,
    expandedSignals,
    theme.palette.mode,
  ]);

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom * 1.2, 10));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom / 1.2, 0.1));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setOffset({
      x: e.currentTarget.scrollLeft,
      y: e.currentTarget.scrollTop,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - sidebarWidth;
    const y = e.clientY - rect.top;
    const xScale = ((canvas.width - sidebarWidth) * zoom) / timeRange;
    const time = x / xScale + minTime + offset.x / xScale;
    setCursorPosition(time);

    // Find the signal and value at the cursor position
    const signalIndex = Math.floor(
      (y - timeScaleHeight + offset.y) / signalHeight,
    );
    if (signalIndex >= 0 && signalIndex < data.signals.length) {
      const signal = data.signals[signalIndex];
      const wavePoint = signal.wave.find(([t]) => t > time);
      const waveValue = wavePoint
        ? wavePoint[1]
        : signal.wave[signal.wave.length - 1]?.[1] ?? "Unknown";
      setHoverInfo({
        name: signal.name,
        value: waveValue,
        y: y,
      });
    } else {
      setHoverInfo(null);
    }
  };

  const handleMouseLeave = () => {
    setCursorPosition(null);
    setHoverInfo(null);
  };

  const toggleHoverInfo = () => {
    setShowHoverInfo(!showHoverInfo);
  };

  const renderSignalNames = () => {
    return Object.entries(groupedSignals).map(([groupName, signals]) => {
      if (signals.length > 1 && (groupName === "SW" || groupName === "LEDR")) {
        return (
          <Box key={groupName} sx={{ height: signalHeight, paddingLeft: 2 }}>
            <Select
              value={expandedSignals[groupName] ? "expanded" : "collapsed"}
              onChange={(e: SelectChangeEvent) =>
                setExpandedSignals({
                  ...expandedSignals,
                  [groupName]: e.target.value === "expanded",
                })
              }
              size="small"
              sx={{ fontSize: 14 }}
            >
              <MenuItem value="collapsed">
                {groupName} [{signals.length - 1}:0]
              </MenuItem>
              <MenuItem value="expanded">{groupName} (Expanded)</MenuItem>
            </Select>
          </Box>
        );
      } else {
        return signals.map((signal) => (
          <Typography
            key={signal.name}
            sx={{
              height: signalHeight,
              paddingLeft: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: 14,
              lineHeight: `${signalHeight}px`,
            }}
          >
            {signal.name}
          </Typography>
        ));
      }
    });
  };

  if (!data || !data.signals || data.signals.length === 0) {
    return <Box sx={{ padding: 2 }}>No signal data available</Box>;
  }

  return (
    <StyledBox
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          padding: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Waveform Viewer
        </Typography>
        <IconButton onClick={handleZoomOut} aria-label="Zoom out">
          <ZoomOutIcon />
        </IconButton>
        <IconButton onClick={handleZoomIn} aria-label="Zoom in">
          <ZoomInIcon />
        </IconButton>
        <FormControlLabel
          control={
            <Switch checked={showHoverInfo} onChange={toggleHoverInfo} />
          }
          label="Show Details"
        />
      </Box>
      <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        <Box
          ref={sidebarRef}
          sx={{
            width: sidebarWidth,
            overflowY: "auto",
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {renderSignalNames()}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
          }}
          onScroll={handleScroll}
        >
          <StyledCanvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </Box>
      </Box>
    </StyledBox>
  );
};

export default WaveformViewer;
