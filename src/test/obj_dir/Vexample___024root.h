// Verilated -*- SystemC -*-
// DESCRIPTION: Verilator output: Design internal header
// See Vexample.h for the primary calling header

#ifndef VERILATED_VEXAMPLE___024ROOT_H_
#define VERILATED_VEXAMPLE___024ROOT_H_  // guard

#include "systemc"
#include "verilated_sc.h"
#include "verilated.h"
#include "verilated_timing.h"


class Vexample__Syms;

class alignas(VL_CACHE_LINE_BYTES) Vexample___024root final : public VerilatedModule {
  public:

    // DESIGN SPECIFIC STATE
    CData/*0:0*/ example_tb__DOT__clk_in;
    CData/*0:0*/ example_tb__DOT__rst_in;
    CData/*5:0*/ example_tb__DOT__a_in;
    CData/*5:0*/ example_tb__DOT__b_in;
    CData/*4:0*/ example_tb__DOT__c_out;
    CData/*0:0*/ __Vtrigprevexpr___TOP__example_tb__DOT__clk_in__0;
    CData/*0:0*/ __VactContinue;
    IData/*31:0*/ example_tb__DOT__unnamedblk1__DOT__i;
    IData/*31:0*/ example_tb__DOT__unnamedblk1__DOT__unnamedblk2__DOT__j;
    IData/*31:0*/ __VactIterCount;
    VlUnpacked<CData/*0:0*/, 3> __Vm_traceActivity;
    VlDelayScheduler __VdlySched;
    VlTriggerVec<2> __VactTriggered;
    VlTriggerVec<2> __VnbaTriggered;

    // INTERNAL VARIABLES
    Vexample__Syms* const vlSymsp;

    // CONSTRUCTORS
    Vexample___024root(Vexample__Syms* symsp, const char* v__name);
    ~Vexample___024root();
    VL_UNCOPYABLE(Vexample___024root);

    // INTERNAL METHODS
    void __Vconfigure(bool first);
};


#endif  // guard
