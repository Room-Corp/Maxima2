module mux_2to1 (
    input wire a,
    input wire b,
    input wire sel,
    output wire out
);

assign out = (sel == 1'b0) ? a : b;

endmodule
