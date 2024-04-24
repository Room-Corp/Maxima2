`timescale 1ns / 1ps
`default_nettype none

// a simple module that will increment c_out on the clock edge if a_in < b_in
// otherwise, c_out doesn't change.
module example (
        input wire          clk_in,
        input wire          rst_in,
        input wire [5:0]    a_in,
        input wire [5:0]    b_in,
        output logic [4:0]  c_out);

  always_ff @(posedge clk_in) begin
    if (rst_in) begin
      // reset to 0
      c_out <= 0;
    end else begin
      c_out <= (a_in > b_in) ? c_out : c_out + 1;
    end
  end
endmodule

`default_nettype wire
