import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { WaveGraph } from "d3-wave";

const WaveformGraph = (props) => {
  const waveGraphRef = useRef(null);

  useEffect(() => {
    console.log("this is " + props.parsedData);
    if (props.parsedData != null) {
      const svg = d3.select(waveGraphRef.current);
      const waveGraph = new WaveGraph(svg);
      waveGraph.setSizes();
      waveGraph.setZoom(25);
      waveGraph.bindData(props.parsedData);
    } else {
      console.log("ur cooked bud");
    }
    // Create the waveform visualization here

    // Any additional setup or event handling for the waveform visualization
  }, [props.parsedData]);

  return <svg ref={waveGraphRef} />;
};

export default WaveformGraph;
