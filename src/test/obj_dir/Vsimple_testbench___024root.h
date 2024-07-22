// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design internal header
// See Vsimple_testbench.h for the primary calling header

#ifndef VERILATED_VSIMPLE_TESTBENCH___024ROOT_H_
#define VERILATED_VSIMPLE_TESTBENCH___024ROOT_H_  // guard

#include "verilated.h"
#include "verilated_timing.h"


class Vsimple_testbench__Syms;

class alignas(VL_CACHE_LINE_BYTES) Vsimple_testbench___024root final : public VerilatedModule {
  public:

    // DESIGN SPECIFIC STATE
    CData/*0:0*/ simple_testbench__DOT__clk;
    CData/*0:0*/ __Vtrigprevexpr___TOP__simple_testbench__DOT__clk__0;
    CData/*0:0*/ __VactContinue;
    IData/*31:0*/ __VactIterCount;
    VlDelayScheduler __VdlySched;
    VlTriggerScheduler __VtrigSched_h76e973be__0;
    VlTriggerVec<2> __VactTriggered;
    VlTriggerVec<2> __VnbaTriggered;

    // INTERNAL VARIABLES
    Vsimple_testbench__Syms* const vlSymsp;

    // CONSTRUCTORS
    Vsimple_testbench___024root(Vsimple_testbench__Syms* symsp, const char* v__name);
    ~Vsimple_testbench___024root();
    VL_UNCOPYABLE(Vsimple_testbench___024root);

    // INTERNAL METHODS
    void __Vconfigure(bool first);
};


#endif  // guard
