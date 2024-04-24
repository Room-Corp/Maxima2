module mux_2to1_tb;

// Parameters
parameter PERIOD = 10; // Time period for clock // Simulation time

// Inputs
reg a, b, sel;
// Output
wire` out;
// Instantiate the multiplexer
mux_2to1 uut (
    .a(a),
    .b(b),
    .sel(sel),
    .out(out)
);

// Clock generation
reg clk = 0;

always #((PERIOD/2)) clk <= ~clk;

// Test stimulus
initial begin
    $dumpfile("random.vcd");
    $dumpvars(0, tb);
    // Test case 1: a = 1, b = 0, sel = 0
    a = 1'b1; b = 1'b0; sel = 1'b0;
    #20;
    // Test case 2: a = 1, b = 0, sel = 1
    a = 1'b1; b = 1'b0; sel = 1'b1;
    #20;
    // Test case 3: a = 0, b = 1, sel = 0
    a = 1'b0; b = 1'b1; sel = 1'b0;
    #20;
    // Test case 4: a = 0, b = 1, sel = 1
    a = 1'b0; b = 1'b1; sel = 1'b1;
    #20;
    // End simulation
    $finish;
end

endmodule
