`timescale 1ns / 1ps
`default_nettype none

module simple_testbench();
logic clk, reset;
logic [1:0]SW;
logic [2:0]LEDR ;
simple dut (.*);
// Set up a simulated clock.
parameter CLOCK_PERIOD=100;
initial begin
 $dumpfile("simple.vcd"); //file to store value change dump (vcd)
        $dumpvars(0,simple_testbench); //store everything at the current level and below
clk <= 0;
forever #(CLOCK_PERIOD/2) clk <= ~clk; // Forever toggle the clock
end
// Set up the inputs to the design. Each line is a clock cycle.
initial begin
@(posedge clk);
reset <= 1; @(posedge clk); // Always reset FSMs at start // two clock cycles to check alternating test
@(posedge clk);
reset <= 0; @(posedge clk); // two clock cycles to check alternating test
@(posedge clk);
@(posedge clk);
@(posedge clk);
SW <= 2'b00;  @(posedge clk);
@(posedge clk);
@(posedge clk);
@(posedge clk);
SW <= 2'b01;  @(posedge clk);
@(posedge clk);
@(posedge clk);
@(posedge clk);
SW <= 2'b10; @(posedge clk);
@(posedge clk);
@(posedge clk);
@(posedge clk);
SW <= 2'b11; @(posedge clk);
@(posedge clk);
@(posedge clk);
@(posedge clk);
$stop; // End the simulation.
end
endmodule
