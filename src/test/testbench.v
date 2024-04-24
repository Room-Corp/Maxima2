module testbench;
  // Inputs
  reg clk;
  reg reset;
  reg [7:0] data_in;

  // Outputs
  //wire [15:0] data_out;

  // Instantiate the module under test
  example dut (
    .clk(clk),
    .reset(reset),
    .data_in(data_in)
    //.data_out(data_out)
  );

  // Clock generation
  always #5 clk = ~clk;

  // Dump VCD file
  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, testbench);
  end

  // Testbench stimulus
  initial begin
    // Initialize inputs
    clk = 0;
    reset = 1;
    data_in = 0;

    // Apply reset
    #10 reset = 0;

    // Provide input stimulus
    #20 data_in = 8'h55;
    #20 data_in = 8'hAA;
    #20 data_in = 8'hFF;

    // End simulation
    #20 $finish;
  end
endmodule

