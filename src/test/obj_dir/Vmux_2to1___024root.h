// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design internal header
// See Vmux_2to1.h for the primary calling header

#ifndef VERILATED_VMUX_2TO1___024ROOT_H_
#define VERILATED_VMUX_2TO1___024ROOT_H_  // guard

#include "verilated.h"
#include "verilated_timing.h"


class Vmux_2to1__Syms;

class alignas(VL_CACHE_LINE_BYTES) Vmux_2to1___024root final : public VerilatedModule {
  public:

    // DESIGN SPECIFIC STATE
    CData/*0:0*/ mux_2to1_tb__DOT__a;
    CData/*0:0*/ mux_2to1_tb__DOT__b;
    CData/*0:0*/ mux_2to1_tb__DOT__sel;
    CData/*0:0*/ mux_2to1_tb__DOT__clk;
    CData/*0:0*/ __Vdlyvval__mux_2to1_tb__DOT__clk__v0;
    CData/*0:0*/ __Vdlyvset__mux_2to1_tb__DOT__clk__v0;
    CData/*0:0*/ __VactContinue;
    IData/*31:0*/ __VactIterCount;
    VlDelayScheduler __VdlySched;
    VlTriggerVec<1> __VactTriggered;
    VlTriggerVec<1> __VnbaTriggered;

    // INTERNAL VARIABLES
    Vmux_2to1__Syms* const vlSymsp;

    // CONSTRUCTORS
    Vmux_2to1___024root(Vmux_2to1__Syms* symsp, const char* v__name);
    ~Vmux_2to1___024root();
    VL_UNCOPYABLE(Vmux_2to1___024root);

    // INTERNAL METHODS
    void __Vconfigure(bool first);
};


#endif  // guard
