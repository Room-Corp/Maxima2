`timescale 1ns / 1ps
`default_nettype none
module mux2_1_tb();
    logic i0, i1, sel;
    logic out;
    mux2_1 dut (.out, .i0, .i1, .sel);

    initial begin
        $dumpfile("example2.vcd"); //file to store value change dump (vcd)
        $dumpvars(0,mux2_1_tb); //store everything at the current level and below

        sel=0; i0=0; i1=0; #10;
        sel=0; i0=0; i1=1; #10;
        sel=0; i0=1; i1=0; #10;
        sel=0; i0=1; i1=1; #10;
        sel=1; i0=0; i1=0; #10;
        sel=1; i0=0; i1=1; #10;
        sel=1; i0=1; i1=0; #10;
        sel=1; i0=1; i1=1; #10;
    end
endmodule
