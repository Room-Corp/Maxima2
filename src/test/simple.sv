`timescale 1ns / 1ps
`default_nettype none

module simple (clk, reset, SW, LEDR);
input logic clk, reset;
input logic [1:0]SW;
output logic [2:0]LEDR ;
// State variables
//enum { none, got_one, got_two } ps, ns;
enum logic [2:0] {outer = 3'b101, right = 3'b001, middle = 3'b010, left= 3'b100} ps, ns;
// Next State logic
//always_comb begin
//case (ps)
//none: if (w) ns = got_one;
//else ns = none;
//got_one: if (w) ns = got_two;
//else ns = none;
//got_two: if (w) ns = got_two;
//else ns = none;
//endcase
//end
//
always_comb begin
case (ps)
	outer: if(~SW[0] & ~SW[1] & ~reset) ns = middle;
				else if(SW[0] & ~SW[1] & ~reset) ns = right;
				else if(~SW[0] & SW[1] & ~reset) ns = left;
				else ns = middle;
	right: if(~SW[0] & ~SW[1] & ~reset) ns = outer;
				else if(SW[0] & ~SW[1] & ~reset) ns = middle;
				else if(~SW[0] & SW[1] & ~reset) ns = left;
				else ns = outer;
	left: if(~SW[0] & ~SW[1] & ~reset) ns = middle;
				else if(SW[0] & ~SW[1] & ~reset) ns = right;
				else if(~SW[0] & SW[1] & ~reset) ns = middle;
				else ns = outer;
	middle: if(~SW[0] & ~SW[1] & ~reset) ns = outer;
				else if(SW[0] & ~SW[1] & ~reset) ns = left;
				else if(~SW[0] & SW[1] & ~reset ) ns = right;
				else ns = outer;
endcase
end

// Output logic - could also be another always_comb block.

// DFFs
always_ff @(posedge clk) begin
if (reset) begin
//ps <= outer;
ps <= outer;
LEDR <= ps;
end
else begin
ps <= ns;
LEDR <= ps;
end
end
endmodule

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
