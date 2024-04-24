// Verilated -*- SystemC -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vexample.h for the primary calling header

#include "Vexample__pch.h"
#include "Vexample__Syms.h"
#include "Vexample___024root.h"

VL_INLINE_OPT VlCoroutine Vexample___024root___eval_initial__TOP__Vtiming__0(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_initial__TOP__Vtiming__0\n"); );
    // Init
    VlWide<3>/*95:0*/ __Vtemp_1;
    // Body
    __Vtemp_1[0U] = 0x2e766364U;
    __Vtemp_1[1U] = 0x6d706c65U;
    __Vtemp_1[2U] = 0x657861U;
    vlSymsp->_vm_contextp__->dumpfile(VL_CVT_PACK_STR_NW(3, __Vtemp_1));
    vlSymsp->_traceDumpOpen();
    VL_WRITEF_NX("Starting Sim\n",0);
    vlSelf->example_tb__DOT__clk_in = 0U;
    vlSelf->example_tb__DOT__rst_in = 0U;
    vlSelf->example_tb__DOT__a_in = 0U;
    vlSelf->example_tb__DOT__b_in = 0U;
    co_await vlSelf->__VdlySched.delay(0x2710ULL, nullptr, 
                                       "example_tb.sv", 
                                       30);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->example_tb__DOT__rst_in = 1U;
    co_await vlSelf->__VdlySched.delay(0x2710ULL, nullptr, 
                                       "example_tb.sv", 
                                       32);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->example_tb__DOT__rst_in = 0U;
    VL_WRITEF_NX("a_in    b_in    c_out\n",0);
    vlSelf->example_tb__DOT__unnamedblk1__DOT__i = 0U;
    while (VL_GTS_III(32, 0x100U, vlSelf->example_tb__DOT__unnamedblk1__DOT__i)) {
        vlSelf->example_tb__DOT__unnamedblk1__DOT__unnamedblk2__DOT__j = 0U;
        while (VL_GTS_III(32, 0x100U, vlSelf->example_tb__DOT__unnamedblk1__DOT__unnamedblk2__DOT__j)) {
            vlSelf->example_tb__DOT__a_in = (0x3fU 
                                             & vlSelf->example_tb__DOT__unnamedblk1__DOT__i);
            vlSelf->example_tb__DOT__b_in = (0x3fU 
                                             & vlSelf->example_tb__DOT__unnamedblk1__DOT__unnamedblk2__DOT__j);
            co_await vlSelf->__VdlySched.delay(0x2710ULL, 
                                               nullptr, 
                                               "example_tb.sv", 
                                               39);
            vlSelf->__Vm_traceActivity[2U] = 1U;
            VL_WRITEF_NX("%8b %8b %5c\n",0,6,vlSelf->example_tb__DOT__a_in,
                         6,(IData)(vlSelf->example_tb__DOT__b_in),
                         5,vlSelf->example_tb__DOT__c_out);
            vlSelf->example_tb__DOT__unnamedblk1__DOT__unnamedblk2__DOT__j 
                = ((IData)(1U) + vlSelf->example_tb__DOT__unnamedblk1__DOT__unnamedblk2__DOT__j);
        }
        vlSelf->example_tb__DOT__unnamedblk1__DOT__i 
            = ((IData)(1U) + vlSelf->example_tb__DOT__unnamedblk1__DOT__i);
    }
    VL_WRITEF_NX("Finishing Sim\n",0);
    VL_FINISH_MT("example_tb.sv", 44, "");
    vlSelf->__Vm_traceActivity[2U] = 1U;
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vexample___024root___dump_triggers__act(Vexample___024root* vlSelf);
#endif  // VL_DEBUG

void Vexample___024root___eval_triggers__act(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_triggers__act\n"); );
    // Body
    vlSelf->__VactTriggered.set(0U, ((IData)(vlSelf->example_tb__DOT__clk_in) 
                                     & (~ (IData)(vlSelf->__Vtrigprevexpr___TOP__example_tb__DOT__clk_in__0))));
    vlSelf->__VactTriggered.set(1U, vlSelf->__VdlySched.awaitingCurrentTime());
    vlSelf->__Vtrigprevexpr___TOP__example_tb__DOT__clk_in__0 
        = vlSelf->example_tb__DOT__clk_in;
#ifdef VL_DEBUG
    if (VL_UNLIKELY(vlSymsp->_vm_contextp__->debug())) {
        Vexample___024root___dump_triggers__act(vlSelf);
    }
#endif
}
