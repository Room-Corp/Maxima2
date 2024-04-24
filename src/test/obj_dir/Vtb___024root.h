// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design internal header
// See Vtb.h for the primary calling header

#ifndef VERILATED_VTB___024ROOT_H_
#define VERILATED_VTB___024ROOT_H_  // guard

#include "verilated.h"
#include "verilated_timing.h"


class Vtb__Syms;

class alignas(VL_CACHE_LINE_BYTES) Vtb___024root final : public VerilatedModule {
  public:

    // DESIGN SPECIFIC STATE
    CData/*0:0*/ tb__DOT__rstn;
    CData/*0:0*/ tb__DOT__clk;
    CData/*7:0*/ tb__DOT__value;
    CData/*7:0*/ tb__DOT__rnd;
    CData/*7:0*/ __Vdlyvval__tb__DOT__rnd__v0;
    CData/*0:0*/ __Vdlyvset__tb__DOT__rnd__v0;
    CData/*0:0*/ __Vdlyvval__tb__DOT__clk__v0;
    CData/*0:0*/ __Vdlyvset__tb__DOT__clk__v0;
    CData/*0:0*/ __Vtrigprevexpr___TOP__tb__DOT__clk__0;
    CData/*0:0*/ __Vtrigprevexpr___TOP__tb__DOT__rstn__0;
    CData/*0:0*/ __VactContinue;
    IData/*31:0*/ tb__DOT__seed;
    IData/*31:0*/ __VactIterCount;
    VlDelayScheduler __VdlySched;
    VlTriggerVec<2> __VactTriggered;
    VlTriggerVec<2> __VnbaTriggered;

    // INTERNAL VARIABLES
    Vtb__Syms* const vlSymsp;

    // CONSTRUCTORS
    Vtb___024root(Vtb__Syms* symsp, const char* v__name);
    ~Vtb___024root();
    VL_UNCOPYABLE(Vtb___024root);

    // INTERNAL METHODS
    void __Vconfigure(bool first);
};


#endif  // guard
