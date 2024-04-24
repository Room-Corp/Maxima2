`timescale 1ns / 1ps
`default_nettype none
module example_tb();

    logic clk_in;
    logic rst_in;
    logic [5:0] a_in, b_in;
    logic [4:0] c_out;

    example uut(  .clk_in(clk_in),
                  .rst_in(rst_in),
                  .a_in(a_in),
                  .b_in(b_in),
                  .c_out(c_out));

    always begin
        #5;  //every 5 ns switch...so period of clock is 10 ns...100 MHz clock
        clk_in = !clk_in;
    end

    //initial block...this is our test simulation
    initial begin
        $dumpfile("example.vcd"); //file to store value change dump (vcd)
        $dumpvars(0,example_tb); //store everything at the current level and below
        $display("Starting Sim"); //print nice message at start
        clk_in = 0; //0 is generally a safe value to initialize with and not specify size
        rst_in = 0;
        a_in = 0;
        b_in = 0;
        #10
        rst_in = 1; //always good to reset
        #10
        rst_in = 0;
        $display("a_in    b_in    c_out");
        for (integer i=0; i<256; i = i+1)begin
          for (integer j=0; j<256; j= j+1)begin
            a_in = i;
            b_in = j;
            #10; //wait
            $display("%8b %8b %5c",a_in, b_in, c_out); //print values C-style formatting
          end
        end
        $display("Finishing Sim"); //print nice message at end
        $finish;
    end
endmodule
`default_nettype wire
