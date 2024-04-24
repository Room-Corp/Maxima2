module centerLight (clk, reset, L, R, NL, NR, lightOn, done);
	input logic clk, reset;
	// L is true when left key is pressed, R is true when the right key
	// is pressed, NL is true when the light on the left is on, and NR
	// is true when the light on the right is on.
	input logic L, R, NL, NR, done;
	// when lightOn is true, the normal light should be on.
	output logic lightOn;
		
	logic ps, ns;
	
	always_comb begin
			casex({ps, R, L, NR, NL})
			5'b101xx: begin
						 ns = 0;
						 lightOn = 1;
						 end
			5'b110xx: begin ns = 0;
						 lightOn = 1;
						 end
			5'b1xxxx: begin ns = 1;
						 lightOn = 1;
						 end
			5'b0011x: begin ns = 1;
						 lightOn = 0;
						 end
			5'b010x1: begin ns = 1;
						 lightOn = 0;
						 end
			default: begin ns = 0;
						lightOn = 0;
						end
		endcase

	end
	
	
	always_ff @(posedge clk) begin
		if(reset | ~done) 
			ps <= 1;
		else
			ps <= ns;
	end
	
endmodule 

module centerLight_testbench();
	logic L, R, NL, NR, done;
	logic lightOn;
	logic clk, reset; 

	centerLight dut (.clk, .reset, .lightOn, .L, .R, .NL, .NR, .done);
	
	//Set up the clock
	parameter CLOCK_PERIOD = 100;
	initial begin
		clk <= 0;
		forever #(CLOCK_PERIOD / 2) 
		clk <= ~clk;
	end
	
	//Set up the inputs to the design. Each line is a clock cycle
	initial begin
														@(posedge clk)
		reset <= 1;									@(posedge clk)
														@(posedge clk)
		reset <= 0;									@(posedge clk)
														@(posedge clk)
		L <= 1; R <= 0; NL <= 0; NR <= 1;	@(posedge clk)
														@(posedge clk)
														@(posedge clk)
														@(posedge clk)
							 NL <= 1; NR <= 0;	@(posedge clk)
														@(posedge clk)
														@(posedge clk)
														@(posedge clk)
		L <= 0; R <= 1; 							@(posedge clk)
														@(posedge clk)
														@(posedge clk)
														@(posedge clk)
							 NL <= 0; NR <= 1; 	@(posedge clk)
														@(posedge clk)
														@(posedge clk)
														@(posedge clk)
		L <= 1; 			 NL <= 1; NR <= 0;	@(posedge clk)
														@(posedge clk)
														@(posedge clk)
														@(posedge clk)
		reset <= 1;									@(posedge clk)
														@(posedge clk)
														@(posedge clk)
		L <= 0; R <= 1; NL <= 1; NR <= 0;	@(posedge clk)
														@(posedge clk)
														@(posedge clk)
		L <= 1; R <= 0; NL <= 0; NR <= 0;	@(posedge clk)
														@(posedge clk)
														@(posedge clk)
		L <= 0; R <= 1; NL <= 0; NR <= 0;	@(posedge clk)
														@(posedge clk)
														@(posedge clk)
		$stop; 
	end 
endmodule 