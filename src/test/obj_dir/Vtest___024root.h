// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design internal header
// See Vtest.h for the primary calling header

#ifndef VERILATED_VTEST___024ROOT_H_
#define VERILATED_VTEST___024ROOT_H_  // guard

#include "verilated.h"
#include "verilated_timing.h"


class Vtest__Syms;

class alignas(VL_CACHE_LINE_BYTES) Vtest___024root final : public VerilatedModule {
  public:

    // DESIGN SPECIFIC STATE
    CData/*0:0*/ centerLight_testbench__DOT__clk;
    CData/*0:0*/ centerLight_testbench__DOT__L;
    CData/*0:0*/ centerLight_testbench__DOT__R;
    CData/*0:0*/ centerLight_testbench__DOT__NL;
    CData/*0:0*/ centerLight_testbench__DOT__NR;
    CData/*0:0*/ centerLight_testbench__DOT__done;
    CData/*0:0*/ centerLight_testbench__DOT__lightOn;
    CData/*0:0*/ centerLight_testbench__DOT__reset;
    CData/*0:0*/ centerLight_testbench__DOT__dut__DOT__ps;
    CData/*0:0*/ centerLight_testbench__DOT__dut__DOT__ns;
    CData/*0:0*/ __VstlFirstIteration;
    CData/*0:0*/ __Vtrigprevexpr___TOP__centerLight_testbench__DOT__clk__0;
    CData/*0:0*/ __VactContinue;
    IData/*31:0*/ __VactIterCount;
    VlUnpacked<CData/*0:0*/, 3> __Vm_traceActivity;
    VlDelayScheduler __VdlySched;
    VlTriggerScheduler __VtrigSched_hd2770c93__0;
    VlTriggerVec<1> __VstlTriggered;
    VlTriggerVec<2> __VactTriggered;
    VlTriggerVec<2> __VnbaTriggered;

    // INTERNAL VARIABLES
    Vtest__Syms* const vlSymsp;

    // CONSTRUCTORS
    Vtest___024root(Vtest__Syms* symsp, const char* v__name);
    ~Vtest___024root();
    VL_UNCOPYABLE(Vtest___024root);

    // INTERNAL METHODS
    void __Vconfigure(bool first);
};


#endif  // guard
